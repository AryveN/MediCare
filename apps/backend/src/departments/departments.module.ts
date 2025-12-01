import { Module } from '@nestjs/common';
import { DoctorDaoMock } from '../reservations/mock/doctor.dao.mock';
import { DepartmentDao } from './department.dao';
import { DepartmentsController } from './departments.controller';
import { DepartmentsService } from './departments.service';

@Module({
  controllers: [DepartmentsController],
  providers: [DepartmentsService, DepartmentDao, DoctorDaoMock],
  exports: [DepartmentsService],
})
export class DepartmentsModule {}
