import React from "react";
import { Link } from "react-router-dom";

const EmployeeList = ({ employees, onDelete, searchTerm }) => {
  const filteredEmployees = searchTerm
    ? employees.filter(emp => 
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : employees;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white shadow-md rounded-lg">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-3 px-4 text-left">Employee Name</th>
            <th className="py-3 px-4 text-left">Position</th>
            <th className="py-3 px-4 text-left">Basic Salary</th>
            <th className="py-3 px-4 text-left">Status</th>
            <th className="py-3 px-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredEmployees.length > 0 ? (
            filteredEmployees.map(emp => (
              <tr key={emp._id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">{emp.name}</td>
                <td className="py-3 px-4">{emp.position}</td>
                <td className="py-3 px-4">${emp.salary}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    emp.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {emp.status}
                  </span>
                </td>
                <td className="py-3 px-4 flex space-x-2">
                  <Link to={`/employee/${emp._id}`} className="text-blue-500 hover:underline">View</Link>
                  <Link to={`/edit/${emp._id}`} className="text-yellow-500 hover:underline">Edit</Link>
                  <button 
                    onClick={() => onDelete(emp._id)}
                    className="text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="py-4 text-center text-gray-500">No employees found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeList;
