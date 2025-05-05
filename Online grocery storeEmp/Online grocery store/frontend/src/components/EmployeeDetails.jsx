import React from "react";

const EmployeeDetails = ({ employee }) => {
  if (!employee) return <div>Loading employee details...</div>;

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4">{employee.name}</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-gray-600">Position</p>
          <p className="font-medium">{employee.position}</p>
        </div>
        
        <div>
          <p className="text-gray-600">Status</p>
          <p className={`font-medium ${
            employee.status === 'Active' ? 'text-green-600' : 'text-red-600'
          }`}>
            {employee.status}
          </p>
        </div>
        
        <div>
          <p className="text-gray-600">Basic Salary</p>
          <p className="font-medium">${employee.salary}</p>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetails;