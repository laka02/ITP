import React, { useState, useEffect } from "react";

const EmployeeForm = ({ initialData = {}, onSubmit }) => {
  const [employee, setEmployee] = useState({
    name: "",
    position: "",
    salary: "",
    overtime: "",
    deductions: "",
    status: "Active",
    ...initialData,
  });

  const [nameError, setNameError] = useState("");

  useEffect(() => {
    setEmployee(initialData);
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "name") {
      if (!/^[A-Za-z ]*$/.test(value)) {
        setNameError("Name can only contain letters.");
        return;
      } else {
        setNameError("");
      }
    }

    setEmployee({ ...employee, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (nameError) return;
    onSubmit(employee);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="name"
        value={employee.name}
        onChange={handleChange}
        placeholder="Name"
        required
      />
      {nameError && <p style={{ color: "red" }}>{nameError}</p>}

      <input
        type="text"
        name="position"
        value={employee.position}
        onChange={handleChange}
        placeholder="Position"
        required
      />
      <input
        type="number"
        name="salary"
        value={employee.salary}
        onChange={handleChange}
        placeholder="Salary"
        required
      />
      <input
        type="number"
        name="overtime"
        value={employee.overtime}
        onChange={handleChange}
        placeholder="Overtime"
      />
      <input
        type="number"
        name="deductions"
        value={employee.deductions}
        onChange={handleChange}
        placeholder="Deductions"
      />
      <select name="status" value={employee.status} onChange={handleChange}>
        <option value="Active">Active</option>
        <option value="Inactive">Inactive</option>
      </select>
      <button type="submit">Submit</button>
    </form>
  );
};

export default EmployeeForm;