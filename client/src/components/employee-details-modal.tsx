import { useQuery } from "@tanstack/react-query";
import { X, Edit, Mail, FileText } from "lucide-react";
import type { Employee } from "@shared/schema";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getInitials, getStatusBadgeClasses } from "@/lib/utils";

interface EmployeeDetailsModalProps {
  employeeId: number | null;
  isOpen: boolean;
  onClose: () => void;
}

export function EmployeeDetailsModal({ employeeId, isOpen, onClose }: EmployeeDetailsModalProps) {
  const { data: employee, isLoading } = useQuery<Employee>({
    queryKey: ["/api/employees", employeeId],
    enabled: !!employeeId && isOpen,
  });

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
              {/* Employee Profile Section */}
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-20 h-20 bg-[hsl(216,90%,26%)] text-white rounded-full flex items-center justify-center text-2xl font-bold">
                  {getInitials(employee.fullName || "")}
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {employee.fullName || "Unknown Employee"}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400">{employee.position || "No Position"}</p>
                  <div className="flex items-center mt-2">
                    <span className={getStatusBadgeClasses(employee.status || "")}>
                      {employee.status || "Unknown"}
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
                <Button className="bg-[hsl(216,90%,26%)] text-white hover:bg-[hsl(216,90%,20%)] flex-1">
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
