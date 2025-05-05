import React, { useState, useEffect } from "react";

const EmployeeForm = ({ initialData = {}, onSubmit, isSubmitting = false }) => {
  const [employee, setEmployee] = useState({
    name: "",
    position: "",
    salary: "",
    status: "Active",
    ...initialData
  });

  useEffect(() => {
    // Only update state if initialData has meaningful content and is different
    if (initialData && Object.keys(initialData).length > 0) {
      // Compare current state with initialData to avoid unnecessary updates
      const hasChanges = Object.keys(initialData).some(key => 
        employee[key] !== initialData[key]
      );
      
      if (hasChanges) {
        setEmployee({ ...initialData });
      }
    }
  }, [initialData]);

  const handleChange = (e) => {
    setEmployee({ ...employee, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(employee);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Employee Name</label>
        <input 
          type="text" 
          name="name" 
          value={employee.name} 
          onChange={handleChange} 
          placeholder="Employee Name" 
          className="w-full p-2 border border-gray-300 rounded"
          required 
          disabled={isSubmitting}
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Position</label>
        <input 
          type="text" 
          name="position" 
          value={employee.position} 
          onChange={handleChange} 
          placeholder="Position" 
          className="w-full p-2 border border-gray-300 rounded"
          required 
          disabled={isSubmitting}
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Basic Salary</label>
        <input 
          type="number" 
          name="salary" 
          value={employee.salary} 
          onChange={handleChange} 
          placeholder="Basic Salary" 
          className="w-full p-2 border border-gray-300 rounded"
          required 
          disabled={isSubmitting}
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Status</label>
        <select 
          name="status" 
          value={employee.status} 
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded"
          disabled={isSubmitting}
        >
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>
      
      <button 
        type="submit"
        className={`bg-primary-200 hover:bg-primary-100 text-white font-medium py-2 px-4 rounded w-full ${
          isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
        }`}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
};

export default EmployeeForm;
