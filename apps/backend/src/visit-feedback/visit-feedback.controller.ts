import { Body, Controller, Headers, Post } from '@nestjs/common';
import { CreateVisitFeedbackDto } from './dto/create-visit-feedback.dto';
import { CreateVisitFeedbackResponseDto } from './dto/create-visit-feedback.response';
import { VisitFeedbackService } from './visit-feedback.service';

@Controller('visit/feedback')
export class VisitFeedbackController {
  constructor(private readonly visitFeedbackService: VisitFeedbackService) {}

  @Post('create')
  async create(
    @Body() dto: CreateVisitFeedbackDto,
    @Headers('x-user-id') userId?: string,
    @Headers('x-patient-id') patientId?: string,
  ): Promise<CreateVisitFeedbackResponseDto> {
    const currentUser = {
      id: userId ?? 'USER-1',
      patientId: patientId ?? 'PAT-1',
    };

    return this.visitFeedbackService.create(dto, currentUser);
  }
}
