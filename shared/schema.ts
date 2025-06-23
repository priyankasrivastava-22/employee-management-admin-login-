import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const employees = pgTable("employees", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone").notNull(),
  department: text("department").notNull(),
  position: text("position").notNull(),
  status: text("status").notNull().default("Present"), // Present, Absent, Leave
  hireDate: text("hire_date").notNull(),
  manager: text("manager"),
  employeeId: text("employee_id").notNull().unique(),
  lastClockIn: text("last_clock_in"),
  lastClockOut: text("last_clock_out"),
  weekHours: text("week_hours").default("0"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertEmployeeSchema = createInsertSchema(employees).omit({
  id: true,
  createdAt: true,
  employeeId: true,
  lastClockIn: true,
  lastClockOut: true,
  weekHours: true,
}).extend({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
  department: z.string().min(1, "Department is required"),
  position: z.string().min(1, "Position is required"),
  status: z.enum(["Present", "Absent", "Leave"]).default("Present"),
  hireDate: z.string().min(1, "Hire date is required"),
  manager: z.string().optional(),
});

export type InsertEmployee = z.infer<typeof insertEmployeeSchema>;
export type Employee = typeof employees.$inferSelect;

// Statistics type for dashboard
export type EmployeeStats = {
  totalEmployees: number;
  presentToday: number;
  onLeave: number;
  absent: number;
};
