import React, { useState } from "react";
import EmployeeForm from "../components/EmployeeForm.jsx";
import { addEmployee } from "../api/employeeApi.js";
import { useNavigate } from "react-router-dom";
import ApiStatus from "../components/ApiStatus.jsx";

const AddEmployee = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (employee) => {
    try {
      setIsSubmitting(true);
      setError(null);
      const response = await addEmployee(employee);
      console.log("Employee added successfully:", response.data);
      navigate("/");
    } catch (err) {
      console.error("Failed to add employee:", err);
      setError(err.message || "An error occurred while adding the employee");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-center">Add Employee</h1>
      </div>
      
      {/* API Status Indicator */}
      <div className="mb-4">
        <ApiStatus />
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 mb-4 rounded">
          <strong>Error:</strong> {error}
        </div>
      )}
      
      <EmployeeForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </div>
  );
};

export default AddEmployee;
