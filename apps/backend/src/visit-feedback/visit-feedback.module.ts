import { Module } from '@nestjs/common';
import { ReservationDaoMock } from '../reservations/mock/reservation.dao.mock';
import { VisitFeedbackController } from './visit-feedback.controller';
import { VisitFeedbackDao } from './visit-feedback.dao';
import { VisitFeedbackService } from './visit-feedback.service';

@Module({
  controllers: [VisitFeedbackController],
  providers: [VisitFeedbackService, ReservationDaoMock, VisitFeedbackDao],
})
export class VisitFeedbackModule {}
