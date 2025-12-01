import { ArrayNotEmpty, IsArray, IsInt, IsOptional, IsPositive, IsString, MinLength } from 'class-validator';

export class CreateDepartmentDto {
  @IsString()
  @MinLength(2)
  name!: string;

  @IsArray()
  @IsString({ each: true })
  doctorsList!: string[];

  @IsInt()
  @IsPositive()
  capacity!: number;

  @IsString()
  @MinLength(3)
  contact!: string;

  @IsOptional()
  @IsString()
  note?: string;
}
