import { Body, Controller, Headers, Post } from '@nestjs/common';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { CreateDepartmentResponseDto } from './dto/create-department.response';
import { DepartmentsService } from './departments.service';

@Controller('department')
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) {}

  @Post('create')
  async create(
    @Body() dto: CreateDepartmentDto,
    @Headers('x-user-id') userId?: string,
    @Headers('x-user-role') role?: string,
  ): Promise<CreateDepartmentResponseDto> {
    const currentUser = { id: userId ?? 'USER-ADMIN', role: role ?? 'admin' };
    return this.departmentsService.create(dto, currentUser);
  }
}
