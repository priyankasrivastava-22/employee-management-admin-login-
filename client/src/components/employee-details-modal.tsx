import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { X, Edit, Mail, FileText, Save, XCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Employee } from "@shared/schema";
import { insertEmployeeSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { getInitials, getStatusBadgeClasses } from "@/lib/utils";

interface EmployeeDetailsModalProps {
  employeeId: number | null;
  isOpen: boolean;
  onClose: () => void;
}

const departments = ["Engineering", "Marketing", "Sales", "HR", "Finance"];

export function EmployeeDetailsModal({ employeeId, isOpen, onClose }: EmployeeDetailsModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: employee, isLoading, error } = useQuery<Employee>({
    queryKey: [`/api/employees/${employeeId}`],
    enabled: !!employeeId && isOpen,
  });

  const form = useForm({
    resolver: zodResolver(insertEmployeeSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      department: "",
      position: "",
      status: "Present" as const,
      hireDate: "",
      manager: "",
    },
  });

  // Update form when employee data loads
  if (employee && !isLoading) {
    form.reset({
      fullName: employee.fullName || "",
      email: employee.email || "",
      phone: employee.phone || "",
      department: employee.department || "",
      position: employee.position || "",
      status: employee.status as "Present" | "Absent" | "Leave",
      hireDate: employee.hireDate || "",
      manager: employee.manager || "",
    });
  }

  const updateEmployeeMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("PATCH", `/api/employees/${employeeId}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/employees"] });
      queryClient.invalidateQueries({ queryKey: [`/api/employees/${employeeId}`] });
      queryClient.invalidateQueries({ queryKey: ["/api/employees/stats/dashboard"] });
      setIsEditing(false);
      toast({
        title: "Success",
        description: "Employee updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update employee.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: any) => {
    updateEmployeeMutation.mutate(data);
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-white">
              Employee Details
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="p-2">
          {isLoading ? (
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <Skeleton className="w-20 h-20 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-5 w-40" />
                  </div>
                ))}
              </div>
            </div>
          ) : employee ? (
            <>
              {isEditing ? (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input {...field} type="email" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phone</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="department"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Department</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {departments.map((dept) => (
                                  <SelectItem key={dept} value={dept}>
                                    {dept}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="position"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Position</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Status</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Present">Present</SelectItem>
                                <SelectItem value="Absent">Absent</SelectItem>
                                <SelectItem value="Leave">Leave</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="hireDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Hire Date</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="manager"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Manager</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="flex gap-3 pt-4">
                      <Button 
                        type="submit" 
                        disabled={updateEmployeeMutation.isPending}
                        className="bg-[hsl(216,90%,26%)] text-white hover:bg-[hsl(216,90%,20%)]"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        {updateEmployeeMutation.isPending ? "Saving..." : "Save Changes"}
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setIsEditing(false)}
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  </form>
                </Form>
              ) : (
                <>
                  {/* Employee Profile Section */}
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-20 h-20 bg-[hsl(216,90%,26%)] text-white rounded-full flex items-center justify-center text-2xl font-bold">
                      {getInitials(employee.fullName)}
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {employee.fullName}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400">{employee.position}</p>
                      <div className="flex items-center mt-2">
                        <span className={getStatusBadgeClasses(employee.status)}>
                          {employee.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Employee Information Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          Email Address
                        </label>
                        <p className="text-gray-900 dark:text-white">{employee.email}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          Phone Number
                        </label>
                        <p className="text-gray-900 dark:text-white">{employee.phone}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          Department
                        </label>
                        <p className="text-gray-900 dark:text-white">{employee.department}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          Employee ID
                        </label>
                        <p className="text-gray-900 dark:text-white">{employee.employeeId}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          Hire Date
                        </label>
                        <p className="text-gray-900 dark:text-white">{employee.hireDate}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          Manager
                        </label>
                        <p className="text-gray-900 dark:text-white">
                          {employee.manager || "Not assigned"}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Additional Information */}
                  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <h5 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">
                      Recent Activity
                    </h5>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-900 dark:text-white">Last Clock In</span>
                        <span className="text-gray-600 dark:text-gray-400">
                          {employee.lastClockIn || "Not available"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-900 dark:text-white">Last Clock Out</span>
                        <span className="text-gray-600 dark:text-gray-400">
                          {employee.lastClockOut || "Not available"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-900 dark:text-white">This Week Hours</span>
                        <span className="text-gray-600 dark:text-gray-400">
                          {employee.weekHours || "0 hours"}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <Button 
                      onClick={() => setIsEditing(true)}
                      className="bg-[hsl(216,90%,26%)] text-white hover:bg-[hsl(216,90%,20%)] flex-1"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Employee
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Mail className="h-4 w-4 mr-2" />
                      Send Message
                    </Button>
                    <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-900/20 flex-1">
                      <FileText className="h-4 w-4 mr-2" />
                      Generate Report
                    </Button>
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="text-center text-gray-500 dark:text-gray-400 py-8">
              Employee not found.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
