import { Body, Controller, Post } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { CreateReservationResponseDto } from './dto/create-reservation.response';

// TODO: až budete mít auth, nahradí se mock currentUser decorator.
const mockCurrentUser = { id: 'USER-1', patientId: 'PAT-1' };

@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Post()
  async create(
    @Body() dto: CreateReservationDto,
  ): Promise<CreateReservationResponseDto> {
    // v budoucnu: @CurrentUser() user
    return this.reservationsService.create(dto, mockCurrentUser);
  }
}