import { Department } from '../department.types';

export class CreateDepartmentResponseDto {
  department!: Department;
  notificationStatus!: {
    email: 'sent' | 'failed' | 'notRequested';
  };
  unsupportedKeyList!: string[];
  invalidTypeKeyMap!: Record<string, string>;
  invalidValueKeyMap!: Record<string, string>;
  missingKeyMap!: Record<string, string>;
}
