import React, { useEffect, useState } from "react";
import EmployeeForm from "../components/EmployeeForm";
import { getEmployeeById, updateEmployee } from "../api/employeeApi";
import { useParams, useNavigate } from "react-router-dom";

const EditEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);

  useEffect(() => {
    getEmployeeById(id).then(({ data }) => setEmployee(data));
  }, [id]);

  const handleSubmit = async (updatedEmployee) => {
    await updateEmployee(id, updatedEmployee);
    navigate("/");
  };

  return employee ? <EmployeeForm initialData={employee} onSubmit={handleSubmit} /> : <p>Loading...</p>;
};

export default EditEmployee;
