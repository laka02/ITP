import React from "react";
import EmployeeForm from "../components/EmployeeForm";
import { addEmployee } from "../api/employeeApi";
import { useNavigate } from "react-router-dom";

const AddEmployee = () => {
  const navigate = useNavigate();

  const handleSubmit = async (employee) => {
    await addEmployee(employee);
    navigate("/");
  };

  return <EmployeeForm onSubmit={handleSubmit} />;
};

export default AddEmployee;
