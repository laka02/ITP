import React, { useState, useEffect } from "react";
import { getEmployees, deleteEmployee } from "../api/employeeApi.js";
import { Link } from "react-router-dom";
import EmployeeList from "../components/EmployeeList.jsx";

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const { data } = await getEmployees();
      setEmployees(data);
    } catch (err) {
      setError("Failed to load employees");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        await deleteEmployee(id);
        fetchEmployees();
      } catch (err) {
        setError("Failed to delete employee");
        console.error(err);
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Employees</h1>
        <Link 
          to="/add" 
          className="bg-primary-200 hover:bg-primary-100 text-white font-medium py-2 px-4 rounded"
        >
          Add Employee
        </Link>
      </div>
      
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search employees..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-200"
        />
      </div>
      
      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : error ? (
        <div className="text-center py-8 text-red-500">{error}</div>
      ) : (
        <EmployeeList 
          employees={employees} 
          onDelete={handleDelete} 
          searchTerm={search} 
        />
      )}
    </div>
  );
};

export default Employees;