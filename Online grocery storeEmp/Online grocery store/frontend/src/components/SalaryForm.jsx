import React, { useState, useEffect } from "react";
import { getEmployees, getEmployeeById } from "../api/employeeApi.js";

const SalaryForm = ({ initialData = {}, onSubmit, isEditing = false }) => {
  const [salary, setSalary] = useState({
    employeeId: "",
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    basicSalary: 0,
    overtimePay: 0,
    deductions: 0,
    status: "Pending",
    attendanceStatus: "Pending",
    daysWorked: 0,
    bonus: 0,
    attendanceDetails: [], // New field to track daily attendance
    ...initialData
  });

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingSalary, setFetchingSalary] = useState(false);
  const [calendarDays, setCalendarDays] = useState([]);

  // Existing useEffects for fetching employees and setting initial data
  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      try {
        const { data } = await getEmployees();
        setEmployees(data);
      } catch (error) {
        console.error("Failed to load employees", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setSalary(initialData);
    }
  }, [initialData]);

  // New effect to generate calendar days based on selected month and year
  useEffect(() => {
    generateCalendarDays(salary.year, salary.month);
  }, [salary.month, salary.year]);

  // Effect to calculate total days worked from attendance details
  useEffect(() => {
    if (salary.attendanceDetails && salary.attendanceDetails.length > 0) {
      const presentDays = salary.attendanceDetails.filter(day => day.status === 'present').length;
      setSalary(prev => ({
        ...prev,
        daysWorked: presentDays
      }));
    }
  }, [salary.attendanceDetails]);

  // Effect to calculate bonus based on days worked
  useEffect(() => {
    if (salary.daysWorked > 15) {
      // Apply 5% bonus on basic salary if employee worked more than 15 days
      const bonusAmount = salary.basicSalary * 0.05;
      setSalary(prev => ({ ...prev, bonus: bonusAmount }));
    } else {
      setSalary(prev => ({ ...prev, bonus: 0 }));
    }
  }, [salary.daysWorked, salary.basicSalary]);

  // Function to generate calendar days for the selected month/year
  const generateCalendarDays = (year, month) => {
    const daysInMonth = new Date(year, month, 0).getDate();
    const newCalendarDays = [];
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month - 1, day);
      const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday
      
      // Check if this date exists in attendance details
      const existingAttendance = salary.attendanceDetails?.find(
        att => att.day === day
      );
      
      newCalendarDays.push({
        day,
        dayOfWeek,
        isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
        status: existingAttendance?.status || (dayOfWeek === 0 || dayOfWeek === 6 ? 'weekend' : 'absent')
      });
    }
    
    setCalendarDays(newCalendarDays);
  };

  // Function to handle attendance status toggle
  const handleAttendanceToggle = (day) => {
    // Don't allow toggling weekends
    if (calendarDays.find(d => d.day === day)?.isWeekend) {
      return;
    }
    
    const updatedCalendarDays = calendarDays.map(calDay => {
      if (calDay.day === day) {
        // Toggle between present and absent
        const newStatus = calDay.status === 'present' ? 'absent' : 'present';
        return { ...calDay, status: newStatus };
      }
      return calDay;
    });
    
    setCalendarDays(updatedCalendarDays);
    
    // Update attendance details in state
    const updatedAttendanceDetails = updatedCalendarDays
      .filter(day => !day.isWeekend)
      .map(day => ({
        day: day.day,
        status: day.status
      }));
    
    setSalary(prev => ({
      ...prev,
      attendanceDetails: updatedAttendanceDetails
    }));
  };

  // Existing handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSalary({ ...salary, [name]: value });
  };

  const handleNumericChange = (e) => {
    const { name, value } = e.target;
    setSalary({ ...salary, [name]: parseFloat(value) || 0 });
  };

  const handleEmployeeChange = async (e) => {
    const selectedEmployeeId = e.target.value;
    
    // Update employeeId immediately for responsive UI
    setSalary({ ...salary, employeeId: selectedEmployeeId });
    
    // Only fetch details if an employee is selected
    if (selectedEmployeeId) {
      setFetchingSalary(true);
      try {
        // Fetch employee details to get the salary
        const { data: employeeData } = await getEmployeeById(selectedEmployeeId);
        
        // Update the salary state with the employee's basic salary
        setSalary(prevState => ({ 
          ...prevState, 
          basicSalary: employeeData.salary || 0 
        }));
      } catch (error) {
        console.error("Failed to fetch employee details:", error);
      } finally {
        setFetchingSalary(false);
      }
    }
  };

  // Manually set the days worked value
  const handleDaysWorkedChange = (e) => {
    const { value } = e;
    const daysWorked = parseInt(value) || 0;
    
    // Create attendance details based on the manually entered value
    const newAttendanceDetails = [];
    for (let day = 1; day <= calendarDays.length; day++) {
      const isWeekend = calendarDays.find(d => d.day === day)?.isWeekend;
      if (!isWeekend) {
        if (newAttendanceDetails.length < daysWorked) {
          newAttendanceDetails.push({ day, status: 'present' });
        } else {
          newAttendanceDetails.push({ day, status: 'absent' });
        }
      }
    }
    
    setSalary(prev => ({
      ...prev,
      daysWorked,
      attendanceDetails: newAttendanceDetails
    }));
    
    // Update calendar days to reflect changes
    const updatedCalendarDays = calendarDays.map(calDay => {
      const attendanceEntry = newAttendanceDetails.find(a => a.day === calDay.day);
      return {
        ...calDay,
        status: attendanceEntry ? attendanceEntry.status : (calDay.isWeekend ? 'weekend' : 'absent')
      };
    });
    
    setCalendarDays(updatedCalendarDays);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Calculate total salary with bonus before submitting
    const totalWithBonus = {
      ...salary,
      // Include the calculated bonus in the final calculation
      netSalary: (salary.basicSalary + salary.overtimePay + salary.bonus) - 
                 (salary.deductions)
    };
    
    onSubmit(totalWithBonus);
  };

  const getDayName = (dayOfWeek) => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return days[dayOfWeek];
  };

  // Get days in week groups for the calendar
  const getDaysByWeek = () => {
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
    <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      {/* Employee selection, month/year selectors (existing code) */}
      {!isEditing && (
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Employee</label>
          <select
            name="employeeId"
            value={salary.employeeId}
            onChange={handleEmployeeChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
            disabled={isEditing}
          >
            <option value="">Select an Employee</option>
            {employees.map((employee) => (
              <option key={employee._id} value={employee._id}>
                {employee.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-gray-700 mb-2">Month</label>
          <select
            name="month"
            value={salary.month}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
            disabled={isEditing}
          >
            {/* Month options */}
            {[
              { value: 1, label: "January" },
              { value: 2, label: "February" },
              { value: 3, label: "March" },
              { value: 4, label: "April" },
              { value: 5, label: "May" },
              { value: 6, label: "June" },
              { value: 7, label: "July" },
              { value: 8, label: "August" },
              { value: 9, label: "September" },
              { value: 10, label: "October" },
              { value: 11, label: "November" },
              { value: 12, label: "December" }
            ].map((month) => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Year</label>
          <select
            name="year"
            value={salary.year}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
            disabled={isEditing}
          >
            {/* Year options */}
            {Array.from(
              { length: new Date().getFullYear() - 2019 },
              (_, i) => 2020 + i
            ).map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Attendance Calendar */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Attendance Calendar</h3>
        <p className="text-sm text-gray-500 mb-2">Click on a day to toggle attendance status</p>
        
        <div className="border rounded-md overflow-hidden">
          {/* Calendar header with days of week */}
          <div className="grid grid-cols-7 bg-gray-100">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
              <div key={day} className="p-2 text-center text-xs font-medium">
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar body */}
          <div className="divide-y">
            {getDaysByWeek().map((week, weekIndex) => (
              <div key={weekIndex} className="grid grid-cols-7">
                {week.map((day, dayIndex) => (
                  <div 
                    key={`${weekIndex}-${dayIndex}`} 
                    className={`p-2 text-center border-r last:border-r-0 cursor-pointer ${
                      !day ? 'opacity-0' :
                      day.isWeekend ? 'bg-gray-50 cursor-not-allowed' :
                      day.status === 'present' ? 'bg-green-100' : 'bg-red-50'
                    }`}
                    onClick={() => day && handleAttendanceToggle(day.day)}
                  >
                    {day && (
                      <>
                        <div className="text-sm font-medium">{day.day}</div>
                        {!day.isWeekend && (
                          <div className="text-xs mt-1">
                            {day.status === 'present' ? '✓' : '✗'}
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
        
        <div className="flex items-center justify-center mt-2 text-sm">
          <span className="flex items-center mr-4">
            <span className="inline-block w-3 h-3 bg-green-100 mr-1"></span>
            Present
          </span>
          <span className="flex items-center mr-4">
            <span className="inline-block w-3 h-3 bg-red-50 mr-1"></span>
            Absent
          </span>
          <span className="flex items-center">
            <span className="inline-block w-3 h-3 bg-gray-50 mr-1"></span>
            Weekend
          </span>
        </div>
      </div>

      {/* Days Worked (automatically calculated) */}
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Days Worked</label>
        <input
          type="number"
          name="daysWorked"
          value={salary.daysWorked}
          onChange={handleNumericChange}
          placeholder="Number of days worked"
          className="w-full p-2 border border-gray-300 rounded bg-gray-50"
          min="0"
          max="31"
          required
          readOnly
        />
        <p className="text-xs text-gray-500 mt-1">
          Automatically calculated from attendance calendar
        </p>
        {salary.daysWorked > 15 && (
          <p className="text-xs text-green-600 mt-1">
            Eligible for 5% attendance bonus!
          </p>
        )}
      </div>

      {/* Existing basic salary field */}
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">
          Basic Salary ($)
          {fetchingSalary && <span className="ml-2 text-xs text-blue-500">Fetching salary...</span>}
        </label>
        <input
          type="number"
          name="basicSalary"
          value={salary.basicSalary}
          onChange={handleNumericChange}
          placeholder="Basic Salary"
          className={`w-full p-2 border border-gray-300 rounded ${fetchingSalary ? 'bg-gray-100' : ''}`}
          required
          min="0"
          step="0.01"
          disabled={fetchingSalary}
        />
        {salary.employeeId && !fetchingSalary && (
          <p className="text-xs text-gray-500 mt-1">
            Auto-populated from employee record
          </p>
        )}
      </div>

      {/* Bonus display field - read only */}
      <div className="mb-4">
      <label className="block text-gray-700 mb-2">Attendance Bonus (5% if {">"}15 days)</label>
        <input
          type="number"
          name="bonus"
          value={salary.bonus}
          readOnly
          className="w-full p-2 border border-gray-300 rounded bg-gray-50"
          step="0.01"
        />
      </div>

      {/* Rest of the form (existing fields) */}
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Overtime Pay ($)</label>
        <input
          type="number"
          name="overtimePay"
          value={salary.overtimePay}
          onChange={handleNumericChange}
          placeholder="Overtime Pay"
          className="w-full p-2 border border-gray-300 rounded"
          min="0"
          step="0.01"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Deductions ($)</label>
        <input
          type="number"
          name="deductions"
          value={salary.deductions}
          onChange={handleNumericChange}
          placeholder="Deductions"
          className="w-full p-2 border border-gray-300 rounded"
          min="0"
          step="0.01"
        />
      </div>

      {/* Net salary preview */}
      <div className="mb-4 p-4 bg-gray-50 rounded border border-gray-200">
        <label className="block text-gray-700 mb-2 font-semibold">Estimated Net Salary:</label>
        <p className="text-xl font-bold text-green-600">
          ${((salary.basicSalary + salary.overtimePay + salary.bonus) - salary.deductions).toFixed(2)}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          (Basic + Overtime + Bonus - Deductions) - EPF & ETF will be calculated by the system
        </p>
      </div>

      {/* Status fields for edit mode */}
      {isEditing && (
        <>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Status</label>
            <select
              name="status"
              value={salary.status}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Attendance Status</label>
            <select
              name="attendanceStatus"
              value={salary.attendanceStatus}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            >
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
            </select>
          </div>
        </>
      )}

      <button
        type="submit"
        className="bg-primary-200 hover:bg-primary-100 text-white font-medium py-2 px-4 rounded w-full"
      >
        {isEditing ? "Update Salary" : "Calculate Salary"}
      </button>
    </form>
  );
};

export default SalaryForm;
