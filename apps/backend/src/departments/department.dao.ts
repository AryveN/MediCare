import { Department } from './department.types';

export class DepartmentDao {
  private departments: Department[] = [];

  async create(department: Department): Promise<Department> {
    await Promise.resolve();
    this.departments.push(department);
    return department;
  }

  async getByName(name: string): Promise<Department | null> {
    await Promise.resolve();
    return this.departments.find(
      (department) => department.name.toLowerCase() === name.toLowerCase(),
    ) ?? null;
  }

  async list(): Promise<Department[]> {
    await Promise.resolve();
    return [...this.departments];
  }
}
