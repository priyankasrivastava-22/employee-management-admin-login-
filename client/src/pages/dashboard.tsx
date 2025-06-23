import { NavigationHeader } from "@/components/navigation-header";
import { StatisticsDashboard } from "@/components/statistics-dashboard";
import { EmployeeRegistrationForm } from "@/components/employee-registration-form";
import { EmployeeDataTable } from "@/components/employee-data-table";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-150">
      <NavigationHeader />
      
      {/* Main Container */}
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <StatisticsDashboard />
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Employee Registration Form */}
          <div className="lg:col-span-1">
            <EmployeeRegistrationForm />
          </div>
          
          {/* Employee Data Table */}
          <div className="lg:col-span-3">
            <EmployeeDataTable />
          </div>
        </div>
      </div>
    </div>
  );
}
