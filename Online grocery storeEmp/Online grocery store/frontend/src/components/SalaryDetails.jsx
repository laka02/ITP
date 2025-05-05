import React from "react";

const SalaryDetails = ({ salary }) => {
  if (!salary) return <div>Loading salary details...</div>;

  const formatMonth = (month) => {
    const months = [
      "January", "February", "March", "April",
      "May", "June", "July", "August",
      "September", "October", "November", "December"
    ];
    return months[month - 1];
  };
  
  // Generate calendar grid for the month
  const generateCalendarDays = () => {
    const daysInMonth = new Date(salary.year, salary.month, 0).getDate();
    const calendarDays = [];
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(salary.year, salary.month - 1, day);
      const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      
      // Check if this date exists in attendance details
      const existingAttendance = salary.attendanceDetails?.find(
        att => att.day === day
      );
      
      calendarDays.push({
        day,
        dayOfWeek,
        isWeekend,
        status: existingAttendance?.status || (isWeekend ? 'weekend' : 'absent')
      });
    }
    
    return calendarDays;
  };
  
  // Get days grouped by weeks for the calendar display
  const getDaysByWeek = () => {
    const calendarDays = generateCalendarDays();
    const weeks = [];
    let currentWeek = [];
    
    // Add empty days at the beginning to align with the correct day of week
    const firstDayOfWeek = new Date(salary.year, salary.month - 1, 1).getDay();
    for (let i = 0; i < firstDayOfWeek; i++) {
      currentWeek.push(null);
    }
    
    calendarDays.forEach(day => {
      currentWeek.push(day);
      if (currentWeek.length === 7) {
        weeks.push([...currentWeek]);
        currentWeek = [];
      }
    });
    
    // Add empty days at the end to complete the last week
    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push(null);
      }
      weeks.push(currentWeek);
    }
    
    return weeks;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Employee & Salary Info - Left Column */}
      <div className="lg:col-span-1 space-y-6">
        {/* Employee Info Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 overflow-hidden">
          <div className="flex items-center mb-4">
            <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-500">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
            </div>
            <div className="ml-4">
              <h2 className="text-xl font-bold text-gray-800">{salary.employeeId.name}</h2>
              <p className="text-gray-500">{salary.employeeId.position}</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Employee Status</span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                salary.employeeId.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {salary.employeeId.status}
              </span>
            </div>
            
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Days Worked</span>
              <div className="flex flex-col items-end">
                <span className="font-semibold text-gray-800">{salary.daysWorked || 'N/A'}</span>
                {(salary.daysWorked > 15) && (
                  <span className="text-xs text-green-600 mt-0.5">Bonus eligible!</span>
                )}
              </div>
            </div>
            
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Salary Period</span>
              <span className="font-semibold text-gray-800">
                {formatMonth(salary.month)} {salary.year}
              </span>
            </div>
            
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Salary Status</span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                salary.status === 'Approved' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {salary.status}
              </span>
            </div>
            
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600">Attendance Status</span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                salary.attendanceStatus === 'Approved' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {salary.attendanceStatus}
              </span>
            </div>
          </div>
        </div>

        {/* Salary Breakdown Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 overflow-hidden">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
            Salary Breakdown
          </h3>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Basic Salary</span>
              <span className="font-semibold text-gray-800">${salary.basicSalary.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Overtime Pay</span>
              <span className="font-semibold text-gray-800">${salary.overtimePay.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Attendance Bonus (5%)</span>
              <span className="font-semibold text-green-600">
                +${(salary.bonus || 0).toFixed(2)}
              </span>
            </div>
            
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">EPF (8%)</span>
              <span className="font-semibold text-red-500">-${salary.epf.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">ETF (3%)</span>
              <span className="font-semibold text-red-500">-${salary.etf.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Other Deductions</span>
              <span className="font-semibold text-red-500">-${salary.deductions.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between items-center py-3 mt-2 bg-gray-50 -mx-6 px-6 border-t border-gray-100">
              <span className="font-bold text-gray-800">Net Salary</span>
              <span className="font-bold text-xl text-green-600">${salary.netSalary.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Attendance Calendar - Right Column */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 overflow-hidden">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            Attendance Calendar - {formatMonth(salary.month)} {salary.year}
          </h3>
          
          <div className="border rounded-lg overflow-hidden">
            {/* Calendar header with days of week */}
            <div className="grid grid-cols-7 bg-gray-50 border-b">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                <div key={day} className="py-2 text-center text-xs font-semibold text-gray-700">
                  {day}
                </div>
              ))}
            </div>
            
            {/* Calendar body */}
            <div>
              {getDaysByWeek().map((week, weekIndex) => (
                <div key={weekIndex} className="grid grid-cols-7 border-b last:border-b-0">
                  {week.map((day, dayIndex) => (
                    <div 
                      key={`${weekIndex}-${dayIndex}`} 
                      className={`aspect-square flex flex-col items-center justify-center p-2 border-r last:border-r-0 ${
                        !day ? 'bg-white' :
                        day.isWeekend ? 'bg-gray-50' :
                        day.status === 'present' ? 'bg-green-50' : 'bg-red-50'
                      }`}
                    >
                      {day && (
                        <>
                          <div className={`text-sm font-medium ${
                            day.isWeekend ? 'text-gray-400' : 
                            day.status === 'present' ? 'text-green-800' : 'text-red-800'
                          }`}>
                            {day.day}
                          </div>
                          {!day.isWeekend && (
                            <div className="mt-1">
                              {day.status === 'present' ? (
                                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                              ) : (
                                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                              )}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex items-center justify-center mt-4 space-x-6">
            <div className="flex items-center">
              <span className="w-3 h-3 inline-block bg-green-50 border border-green-200 rounded-sm mr-2"></span>
              <span className="text-sm text-gray-600">Present</span>
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 inline-block bg-red-50 border border-red-200 rounded-sm mr-2"></span>
              <span className="text-sm text-gray-600">Absent</span>
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 inline-block bg-gray-50 border border-gray-200 rounded-sm mr-2"></span>
              <span className="text-sm text-gray-600">Weekend</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalaryDetails;
