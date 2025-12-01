import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { DoctorDaoMock } from '../reservations/mock/doctor.dao.mock';
import { DepartmentDao } from './department.dao';
import { Department } from './department.types';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { CreateDepartmentResponseDto } from './dto/create-department.response';

const allowedKeys = ['name', 'doctorsList', 'capacity', 'contact', 'note'];
const authorizedRoles = ['admin', 'clinicManager'];

@Injectable()
export class DepartmentsService {
  constructor(
    private readonly departmentDao: DepartmentDao,
    private readonly doctorDao: DoctorDaoMock,
  ) {}

  async create(
    dto: CreateDepartmentDto,
    currentUser: { id: string; role?: string },
  ): Promise<CreateDepartmentResponseDto> {
    const dtoKeys = Object.keys(dto ?? {});
    const unsupportedKeyList = dtoKeys.filter((k) => !allowedKeys.includes(k));

    if (unsupportedKeyList.length > 0) {
      console.warn('department/create – unsupported keys in dto:', unsupportedKeyList);
    }

    const missingKeyMap: Record<string, string> = {};
    const invalidTypeKeyMap: Record<string, string> = {};
    const invalidValueKeyMap: Record<string, string> = {};

    if (dto.name === undefined) {
      missingKeyMap['name'] = 'name is required';
    } else if (typeof dto.name !== 'string') {
      invalidTypeKeyMap['name'] = 'name must be a string';
    } else if (dto.name.trim().length < 2) {
      invalidValueKeyMap['name'] = 'name must have at least 2 characters';
    }

    if (dto.doctorsList === undefined) {
      missingKeyMap['doctorsList'] = 'doctorsList is required';
    } else if (!Array.isArray(dto.doctorsList)) {
      invalidTypeKeyMap['doctorsList'] = 'doctorsList must be an array';
    } else if (dto.doctorsList.length === 0) {
      invalidValueKeyMap['doctorsList'] = 'doctorsList must contain at least one doctorId';
    } else if (!dto.doctorsList.every((id) => typeof id === 'string' && id.trim().length > 0)) {
      invalidValueKeyMap['doctorsList'] = 'each doctorId must be a non-empty string';
    }

    if (dto.capacity === undefined) {
      missingKeyMap['capacity'] = 'capacity is required';
    } else if (typeof dto.capacity !== 'number') {
      invalidTypeKeyMap['capacity'] = 'capacity must be a number';
    } else if (!Number.isInteger(dto.capacity) || dto.capacity < 1) {
      invalidValueKeyMap['capacity'] = 'capacity must be an integer greater than 0';
    }

    if (dto.contact === undefined) {
      missingKeyMap['contact'] = 'contact is required';
    } else if (typeof dto.contact !== 'string') {
      invalidTypeKeyMap['contact'] = 'contact must be a string';
    } else if (dto.contact.trim().length < 3) {
      invalidValueKeyMap['contact'] = 'contact must have at least 3 characters';
    }

    if (dto.note !== undefined && typeof dto.note !== 'string') {
      invalidTypeKeyMap['note'] = 'note must be a string';
    }

    if (
      Object.keys(missingKeyMap).length > 0 ||
      Object.keys(invalidTypeKeyMap).length > 0 ||
      Object.keys(invalidValueKeyMap).length > 0
    ) {
      throw new BadRequestException({
        code: 'departmentCreate/invalidInput',
        message: 'Validace vstupních dat selhala.',
        missingKeyMap,
        invalidTypeKeyMap,
        invalidValueKeyMap,
        unsupportedKeyList,
      });
    }

    const role = currentUser?.role ?? 'guest';
    if (!authorizedRoles.includes(role)) {
      throw new ForbiddenException({
        code: 'departmentCreate/unauthorized',
        message: 'Nemáte oprávnění vytvářet oddělení.',
      });
    }

    const duplicate = await this.departmentDao.getByName(dto.name);
    if (duplicate) {
      throw new ConflictException({
        code: 'departmentCreate/departmentAlreadyExists',
        message: 'Oddělení se stejným názvem již existuje.',
        name: dto.name,
      });
    }

    const missingDoctors: string[] = [];
    for (const doctorId of dto.doctorsList) {
      const doctor = await this.doctorDao.get(doctorId);
      if (!doctor) {
        missingDoctors.push(doctorId);
      } else if (doctor.aktivni === false) {
        invalidValueKeyMap['doctorNotActive'] = doctorId;
      }
    }

    if (missingDoctors.length > 0) {
      throw new BadRequestException({
        code: 'departmentCreate/doctorNotFound',
        message: 'One or more doctors were not found.',
        missingDoctors,
      });
    }

    if (Object.keys(invalidValueKeyMap).length > 0) {
      throw new BadRequestException({
        code: 'departmentCreate/doctorNotActive',
        message: 'Doctor is not active.',
        invalidValueKeyMap,
      });
    }

    const nowIso = new Date().toISOString();
    const department: Department = {
      id: `DEP-${Date.now()}`,
      name: dto.name,
      doctorsList: dto.doctorsList,
      capacity: dto.capacity,
      contact: dto.contact,
      note: dto.note,
      isActive: true,
      createdAt: nowIso,
      updatedAt: nowIso,
    };

    const saved = await this.departmentDao.create(department);

    return {
      department: saved,
      notificationStatus: { email: 'notRequested' },
      unsupportedKeyList,
      invalidTypeKeyMap: {},
      invalidValueKeyMap: {},
      missingKeyMap: {},
    } satisfies CreateDepartmentResponseDto;
  }
}
