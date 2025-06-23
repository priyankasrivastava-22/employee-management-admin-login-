import { useQuery } from "@tanstack/react-query";
import { Users, CheckCircle, CalendarX, XCircle, ArrowUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { EmployeeStats } from "@shared/schema";

export function StatisticsDashboard() {
  const { data: stats, isLoading } = useQuery<EmployeeStats>({
    queryKey: ["/api/employees/stats/dashboard"],
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <Skeleton className="h-16 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-gray-500">Failed to load statistics</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const attendanceRate = stats.totalEmployees > 0 
    ? ((stats.presentToday / stats.totalEmployees) * 100).toFixed(1)
    : "0";

  const absenteeRate = stats.totalEmployees > 0
    ? ((stats.absent / stats.totalEmployees) * 100).toFixed(1)
    : "0";

  const leaveRate = stats.totalEmployees > 0
    ? ((stats.onLeave / stats.totalEmployees) * 100).toFixed(1)
    : "0";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Total Employees</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalEmployees}</p>
              <p className="text-xs text-green-600 dark:text-green-400 mt-1 flex items-center">
                <ArrowUp className="h-3 w-3 mr-1" />
                +12 this month
              </p>
            </div>
            <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
              <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Present Today</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.presentToday}</p>
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">{attendanceRate}% attendance</p>
            </div>
            <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full">
              <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">On Leave</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.onLeave}</p>
              <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">{leaveRate}% of workforce</p>
            </div>
            <div className="bg-yellow-100 dark:bg-yellow-900/30 p-3 rounded-full">
              <CalendarX className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Absent</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.absent}</p>
              <p className="text-xs text-red-600 dark:text-red-400 mt-1">{absenteeRate}% absence rate</p>
            </div>
            <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-full">
              <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
