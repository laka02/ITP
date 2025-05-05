import React, { useState } from "react";
import SalaryForm from "../components/SalaryForm.jsx";
import { calculateSalary } from "../api/salaryApi.js";
import { useNavigate, Link } from "react-router-dom";
import ApiStatus from "../components/ApiStatus.jsx";

const AddSalary = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (salaryData) => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      const employeeId = salaryData.employeeId;
      const { 
        month, 
        year, 
        daysWorked, 
        overtimePay, 
        deductions, 
        attendanceDetails 
      } = salaryData;
      
      await calculateSalary(employeeId, { 
        month, 
        year,
        daysWorked,
        overtimePay,
        deductions,
        attendanceDetails
      });
      
      navigate("/salaries");
    } catch (error) {
      console.error("Failed to calculate salary", error);
      setError(error.response?.data?.error || "Failed to calculate salary");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link 
          to="/salaries" 
          className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
        >
          <svg className="mr-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Back to Salaries
        </Link>
        
        <h1 className="text-3xl font-bold text-gray-800 mt-4">Calculate New Salary</h1>
        <p className="text-gray-600 mt-1">Fill in the details to calculate an employee's salary</p>
      </div>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error calculating salary</h3>
              <p className="mt-1 text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      <SalaryForm 
        onSubmit={handleSubmit} 
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default AddSalary;
