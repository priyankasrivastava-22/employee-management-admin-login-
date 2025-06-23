import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, ArrowUpDown, Eye } from "lucide-react";
import type { Employee } from "@shared/schema";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getInitials, getStatusBadgeClasses } from "@/lib/utils";
import { EmployeeDetailsModal } from "./employee-details-modal";

type FilterStatus = "all" | "present" | "absent" | "leave";
type SortField = "name" | "department" | "position";
type SortDirection = "asc" | "desc";

export function EmployeeDataTable() {
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: employees = [], isLoading, error } = useQuery<Employee[]>({
    queryKey: ["/api/employees"],
  });

  const filteredAndSortedEmployees = useMemo(() => {
    let filtered = employees;

    // Filter by status
    if (filterStatus !== "all") {
      filtered = filtered.filter(emp => 
        emp.status.toLowerCase() === filterStatus.toLowerCase()
      );
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(emp =>
        emp.fullName.toLowerCase().includes(query) ||
        emp.email.toLowerCase().includes(query) ||
        emp.department.toLowerCase().includes(query) ||
        emp.position.toLowerCase().includes(query)
      );
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue: string;
      let bValue: string;

      switch (sortField) {
        case "name":
          aValue = a.fullName;
          bValue = b.fullName;
          break;
        case "department":
          aValue = a.department;
          bValue = b.department;
          break;
        case "position":
          aValue = a.position;
          bValue = b.position;
          break;
        default:
          aValue = a.fullName;
          bValue = b.fullName;
      }

      const comparison = aValue.localeCompare(bValue);
      return sortDirection === "asc" ? comparison : -comparison;
    });

    return filtered;
  }, [employees, filterStatus, searchQuery, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleViewDetails = (employeeId: number) => {
    setSelectedEmployeeId(employeeId);
    setIsModalOpen(true);
  };

  const getFilterButtonClasses = (filter: FilterStatus) => {
    const baseClasses = "px-3 py-1 text-sm font-medium rounded-md transition-colors";
    if (filterStatus === filter) {
      return `${baseClasses} bg-white dark:bg-gray-800 text-[hsl(216,90%,26%)] shadow`;
    }
    return `${baseClasses} text-gray-600 dark:text-gray-400 hover:text-[hsl(216,90%,26%)]`;
  };

  if (error) {
    return (
      <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <CardContent className="p-6">
          <div className="text-center text-red-600 dark:text-red-400">
            Failed to load employees. Please try again.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        {/* Table Header with Filters */}
        <CardHeader className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Employee Directory</h2>
            
            {/* Filters and Search */}
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Status Filter */}
              <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                <button
                  className={getFilterButtonClasses("all")}
                  onClick={() => setFilterStatus("all")}
                >
                  All
                </button>
                <button
                  className={getFilterButtonClasses("present")}
                  onClick={() => setFilterStatus("present")}
                >
                  Present
                </button>
                <button
                  className={getFilterButtonClasses("absent")}
                  onClick={() => setFilterStatus("absent")}
                >
                  Absent
                </button>
                <button
                  className={getFilterButtonClasses("leave")}
                  onClick={() => setFilterStatus("leave")}
                >
                  Leave
                </button>
              </div>
              
              {/* Search Input */}
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search employees..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[hsl(216,90%,26%)] focus:border-[hsl(216,90%,26%)]"
                />
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>
        </CardHeader>
        
        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  <Button
                    variant="ghost"
                    className="p-0 h-auto font-medium hover:bg-gray-100 dark:hover:bg-gray-600"
                    onClick={() => handleSort("name")}
                  >
                    Name
                    <ArrowUpDown className="ml-1 h-3 w-3" />
                  </Button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden sm:table-cell">
                  <Button
                    variant="ghost"
                    className="p-0 h-auto font-medium hover:bg-gray-100 dark:hover:bg-gray-600"
                    onClick={() => handleSort("department")}
                  >
                    Department
                    <ArrowUpDown className="ml-1 h-3 w-3" />
                  </Button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">
                  <Button
                    variant="ghost"
                    className="p-0 h-auto font-medium hover:bg-gray-100 dark:hover:bg-gray-600"
                    onClick={() => handleSort("position")}
                  >
                    Position
                    <ArrowUpDown className="ml-1 h-3 w-3" />
                  </Button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {isLoading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <Skeleton className="w-10 h-10 rounded-full" />
                        <div className="ml-3">
                          <Skeleton className="h-4 w-32" />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden sm:table-cell">
                      <Skeleton className="h-4 w-24" />
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <Skeleton className="h-4 w-28" />
                    </td>
                    <td className="px-6 py-4">
                      <Skeleton className="h-6 w-16 rounded-full" />
                    </td>
                    <td className="px-6 py-4">
                      <Skeleton className="h-8 w-20" />
                    </td>
                  </tr>
                ))
              ) : filteredAndSortedEmployees.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    {searchQuery || filterStatus !== "all" 
                      ? "No employees match your search criteria." 
                      : "No employees found."}
                  </td>
                </tr>
              ) : (
                filteredAndSortedEmployees.map((employee) => (
                  <tr 
                    key={employee.id} 
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-[hsl(216,90%,26%)] text-white rounded-full flex items-center justify-center font-medium">
                          {getInitials(employee.fullName)}
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {employee.fullName}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 sm:hidden">
                            {employee.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden sm:table-cell">
                      <span className="text-sm text-gray-900 dark:text-white">
                        {employee.department}
                      </span>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <span className="text-sm text-gray-900 dark:text-white">
                        {employee.position}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={getStatusBadgeClasses(employee.status)}>
                        {employee.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewDetails(employee.id)}
                        className="text-[hsl(216,90%,26%)] hover:text-[hsl(216,90%,20%)] hover:bg-blue-50 dark:hover:bg-blue-900/20"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Details
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700 dark:text-gray-300">
              Showing <span className="font-medium">1</span> to{" "}
              <span className="font-medium">{filteredAndSortedEmployees.length}</span> of{" "}
              <span className="font-medium">{employees.length}</span> results
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button 
                size="sm" 
                className="bg-[hsl(216,90%,26%)] hover:bg-[hsl(216,90%,20%)] text-white"
              >
                1
              </Button>
              <Button variant="outline" size="sm" disabled>
                Next
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <EmployeeDetailsModal
        employeeId={selectedEmployeeId}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
