import { employees, type Employee, type InsertEmployee, type EmployeeStats } from "@shared/schema";
import { db } from "./db";
import { eq, ilike, or } from "drizzle-orm";

export interface IStorage {
  getEmployee(id: number): Promise<Employee | undefined>;
  getEmployeeByEmail(email: string): Promise<Employee | undefined>;
  createEmployee(employee: InsertEmployee): Promise<Employee>;
  updateEmployee(id: number, employee: Partial<Employee>): Promise<Employee | undefined>;
  deleteEmployee(id: number): Promise<boolean>;
  getAllEmployees(): Promise<Employee[]>;
  getEmployeesByStatus(status: string): Promise<Employee[]>;
  searchEmployees(query: string): Promise<Employee[]>;
  getEmployeeStats(): Promise<EmployeeStats>;
}

export class DatabaseStorage implements IStorage {
  async getEmployee(id: number): Promise<Employee | undefined> {
    const [employee] = await db.select().from(employees).where(eq(employees.id, id));
    return employee || undefined;
  }

  async getEmployeeByEmail(email: string): Promise<Employee | undefined> {
    const [employee] = await db.select().from(employees).where(eq(employees.email, email));
    return employee || undefined;
  }

  async createEmployee(insertEmployee: InsertEmployee): Promise<Employee> {
    const [employee] = await db
      .insert(employees)
      .values({
        ...insertEmployee,
        employeeId: `EMP-${String(Math.floor(Math.random() * 10000)).padStart(3, '0')}`,
      })
      .returning();
    return employee;
  }

  async updateEmployee(id: number, updateData: Partial<Employee>): Promise<Employee | undefined> {
    const [employee] = await db
      .update(employees)
      .set(updateData)
      .where(eq(employees.id, id))
      .returning();
    return employee || undefined;
  }

  async deleteEmployee(id: number): Promise<boolean> {
    const result = await db.delete(employees).where(eq(employees.id, id));
    return (result.rowCount || 0) > 0;
  }

  async getAllEmployees(): Promise<Employee[]> {
    return await db.select().from(employees).orderBy(employees.fullName);
  }

  async getEmployeesByStatus(status: string): Promise<Employee[]> {
    if (status === "all") return this.getAllEmployees();
    return await db.select().from(employees).where(eq(employees.status, status));
  }

  async searchEmployees(query: string): Promise<Employee[]> {
    return await db
      .select()
      .from(employees)
      .where(
        or(
          ilike(employees.fullName, `%${query}%`),
          ilike(employees.email, `%${query}%`),
          ilike(employees.department, `%${query}%`),
          ilike(employees.position, `%${query}%`)
        )
      );
  }

  async getEmployeeStats(): Promise<EmployeeStats> {
    const allEmployees = await this.getAllEmployees();
    const totalEmployees = allEmployees.length;
    const presentToday = allEmployees.filter(emp => emp.status === "Present").length;
    const onLeave = allEmployees.filter(emp => emp.status === "Leave").length;
    const absent = allEmployees.filter(emp => emp.status === "Absent").length;

    return {
      totalEmployees,
      presentToday,
      onLeave,
      absent,
    };
  }
}

export class MemStorage implements IStorage {
  private employees: Map<number, Employee>;
  private currentId: number;

  constructor() {
    this.employees = new Map();
    this.currentId = 1;
    this.seedData();
  }

  private seedData() {
    // Add some initial employees for testing
    const initialEmployees: (InsertEmployee & { employeeId: string; lastClockIn?: string; lastClockOut?: string; weekHours?: string })[] = [
      {
        fullName: "John Doe",
        email: "john.doe@company.com",
        phone: "+1 (555) 123-4567",
        department: "Engineering",
        position: "Senior Developer",
        status: "Present",
        hireDate: "January 15, 2022",
        manager: "Sarah Johnson",
        employeeId: "EMP-001",
        lastClockIn: "Today, 9:00 AM",
        lastClockOut: "Yesterday, 6:00 PM",
        weekHours: "32.5 hours"
      },
      {
        fullName: "Alice Smith",
        email: "alice.smith@company.com",
        phone: "+1 (555) 234-5678",
        department: "Marketing",
        position: "Marketing Manager",
        status: "Leave",
        hireDate: "March 10, 2021",
        manager: "Mark Williams",
        employeeId: "EMP-002",
        lastClockIn: "Monday, 8:30 AM",
        lastClockOut: "Monday, 5:30 PM",
        weekHours: "24.0 hours"
      },
      {
        fullName: "Michael Johnson",
        email: "michael.johnson@company.com",
        phone: "+1 (555) 345-6789",
        department: "Sales",
        position: "Sales Representative",
        status: "Absent",
        hireDate: "August 5, 2022",
        manager: "Jennifer Davis",
        employeeId: "EMP-003",
        lastClockIn: "Friday, 9:15 AM",
        lastClockOut: "Friday, 6:00 PM",
        weekHours: "40.0 hours"
      },
      {
        fullName: "Emily Brown",
        email: "emily.brown@company.com",
        phone: "+1 (555) 456-7890",
        department: "HR",
        position: "HR Specialist",
        status: "Present",
        hireDate: "December 1, 2021",
        manager: "Sarah Johnson",
        employeeId: "EMP-004",
        lastClockIn: "Today, 8:45 AM",
        lastClockOut: "Yesterday, 5:45 PM",
        weekHours: "35.0 hours"
      },
      {
        fullName: "David Wilson",
        email: "david.wilson@company.com",
        phone: "+1 (555) 567-8901",
        department: "Finance",
        position: "Financial Analyst",
        status: "Present",
        hireDate: "June 20, 2023",
        manager: "Robert Taylor",
        employeeId: "EMP-005",
        lastClockIn: "Today, 9:30 AM",
        lastClockOut: "Yesterday, 6:15 PM",
        weekHours: "38.5 hours"
      }
    ];

    initialEmployees.forEach(emp => {
      const id = this.currentId++;
      const employee: Employee = {
        ...emp,
        id,
        createdAt: new Date(),
      };
      this.employees.set(id, employee);
    });
  }

  async getEmployee(id: number): Promise<Employee | undefined> {
    return this.employees.get(id);
  }

  async getEmployeeByEmail(email: string): Promise<Employee | undefined> {
    return Array.from(this.employees.values()).find(
      (employee) => employee.email === email,
    );
  }

  async createEmployee(insertEmployee: InsertEmployee): Promise<Employee> {
    const id = this.currentId++;
    const employeeId = `EMP-${String(id).padStart(3, '0')}`;
    const employee: Employee = {
      ...insertEmployee,
      id,
      employeeId,
      lastClockIn: null,
      lastClockOut: null,
      weekHours: "0",
      createdAt: new Date(),
    };
    this.employees.set(id, employee);
    return employee;
  }

  async updateEmployee(id: number, updateData: Partial<Employee>): Promise<Employee | undefined> {
    const employee = this.employees.get(id);
    if (!employee) return undefined;
    
    const updatedEmployee = { ...employee, ...updateData };
    this.employees.set(id, updatedEmployee);
    return updatedEmployee;
  }

  async deleteEmployee(id: number): Promise<boolean> {
    return this.employees.delete(id);
  }

  async getAllEmployees(): Promise<Employee[]> {
    return Array.from(this.employees.values()).sort((a, b) => a.fullName.localeCompare(b.fullName));
  }

  async getEmployeesByStatus(status: string): Promise<Employee[]> {
    if (status === "all") return this.getAllEmployees();
    return Array.from(this.employees.values()).filter(
      (employee) => employee.status.toLowerCase() === status.toLowerCase()
    );
  }

  async searchEmployees(query: string): Promise<Employee[]> {
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.employees.values()).filter(
      (employee) =>
        employee.fullName.toLowerCase().includes(lowercaseQuery) ||
        employee.email.toLowerCase().includes(lowercaseQuery) ||
        employee.department.toLowerCase().includes(lowercaseQuery) ||
        employee.position.toLowerCase().includes(lowercaseQuery)
    );
  }

  async getEmployeeStats(): Promise<EmployeeStats> {
    const allEmployees = Array.from(this.employees.values());
    const totalEmployees = allEmployees.length;
    const presentToday = allEmployees.filter(emp => emp.status === "Present").length;
    const onLeave = allEmployees.filter(emp => emp.status === "Leave").length;
    const absent = allEmployees.filter(emp => emp.status === "Absent").length;

    return {
      totalEmployees,
      presentToday,
      onLeave,
      absent,
    };
  }
}

export const storage = new DatabaseStorage();
