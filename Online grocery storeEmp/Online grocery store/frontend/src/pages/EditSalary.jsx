import React, { useEffect, useState } from "react";
import SalaryForm from "../components/SalaryForm.jsx"; // Ensure correct import
import { getSalaryById, updateSalary } from "../api/salaryApi.js";
import { useNavigate, useParams } from "react-router-dom";
import ApiStatus from "../components/ApiStatus.jsx"; // Add API status component

const EditSalary = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [salary, setSalary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSalary = async () => {
      try {
        setLoading(true);
        const { data } = await getSalaryById(id);
        setSalary(data);
      } catch (err) {
        setError("Failed to load salary details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSalary();
  }, [id]);

  const handleSubmit = async (updatedSalary) => {
    try {
      await updateSalary(id, updatedSalary);
      navigate("/salaries");
    } catch (err) {
      setError("Failed to update salary");
      console.error(err);
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-center">Edit Salary</h1>
      </div>
      {salary && <SalaryForm initialData={salary} onSubmit={handleSubmit} isEditing={true} />}
    </div>
  );
};

export default EditSalary;
