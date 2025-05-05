import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getEmployeeById } from "../api/employeeApi";
import EmployeeDetails from "../components/EmployeeDetails";

const EmployeeDetail = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        setLoading(true);
        const { data } = await getEmployeeById(id);
        setEmployee(data);
      } catch (err) {
        setError("Failed to load employee details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [id]);

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/" className="text-blue-500 hover:underline">
          ← Back to Employees
        </Link>
      </div>
      
      <h1 className="text-3xl font-bold mb-6">Employee Details</h1>
      <EmployeeDetails employee={employee} />
      
      <div className="mt-6 space-x-4">
        <Link 
          to={`/edit/${id}`}
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-4 rounded"
        >
          Edit Employee
        </Link>
      </div>
    </div>
  );
};

export default EmployeeDetail;
