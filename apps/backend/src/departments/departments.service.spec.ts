import { BadRequestException, ConflictException, ForbiddenException } from '@nestjs/common';
import { DoctorDaoMock } from '../reservations/mock/doctor.dao.mock';
import { DepartmentDao } from './department.dao';
import { DepartmentsService } from './departments.service';

const adminUser = { id: 'USER-ADMIN', role: 'admin' };

describe('DepartmentsService', () => {
  let service: DepartmentsService;
  let departmentDao: DepartmentDao;

  beforeEach(() => {
    departmentDao = new DepartmentDao();
    service = new DepartmentsService(departmentDao, new DoctorDaoMock());
  });

  it('creates department with valid input', async () => {
    const dto = {
      name: 'Interna',
      doctorsList: ['DOC-1'],
      capacity: 10,
      contact: 'interna@nemocnice.cz',
      note: 'Poznámka',
    };

    const result = await service.create(dto, adminUser);

    expect(result.department.id).toBeDefined();
    expect(result.department.name).toBe('Interna');
    expect(result.department.doctorsList).toEqual(['DOC-1']);
    expect(result.unsupportedKeyList).toEqual([]);
  });

  it('throws invalid input error when required field is missing', async () => {
    const dto = {
      doctorsList: ['DOC-1'],
      capacity: 5,
      contact: 'kontakt@example.com',
    } as any;

    await expect(service.create(dto, adminUser)).rejects.toBeInstanceOf(BadRequestException);
  });

  it('rejects unauthorized user', async () => {
    const dto = {
      name: 'Chirurgie',
      doctorsList: ['DOC-1'],
      capacity: 5,
      contact: 'kontakt@example.com',
    };

    await expect(
      service.create(dto, { id: 'USER-2', role: 'patient' }),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('throws error when department with the same name exists', async () => {
    const dto = {
      name: 'Ortopedie',
      doctorsList: ['DOC-1'],
      capacity: 5,
      contact: 'kontakt@example.com',
    };

    await service.create(dto, adminUser);

    await expect(service.create(dto, adminUser)).rejects.toBeInstanceOf(ConflictException);
  });
});
