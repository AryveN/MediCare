import { Module } from '@nestjs/common';
import { ReservationsController } from './reservations.controller';
import { ReservationsService } from './reservations.service';

import { DoctorDaoMock } from './mock/doctor.dao.mock';
import { PatientDaoMock } from './mock/patient.dao.mock';
import { ProcedureDaoMock } from './mock/procedure.dao.mock';
import { DepartmentDaoMock } from './mock/department.dao.mock';
import { ReservationDaoMock } from './mock/reservation.dao.mock';

@Module({
  controllers: [ReservationsController],
  providers: [
    ReservationsService,
    DoctorDaoMock,
    PatientDaoMock,
    ProcedureDaoMock,
    DepartmentDaoMock,
    ReservationDaoMock,
  ],
  exports: [ReservationsService],
})
export class ReservationsModule {}