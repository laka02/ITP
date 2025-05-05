import React from "react";
import { Routes, Route } from "react-router-dom";
import Employees from "./pages/Employees.jsx";
import AddEmployee from "./pages/AddEmployee.jsx";
import EditEmployee from "./pages/EditEmployee.jsx";
import EmployeeDetail from "./pages/EmployeeDetail.jsx";
import Salaries from "./pages/Salaries.jsx";
import AddSalary from "./pages/AddSalary.jsx";
import EditSalary from "./pages/EditSalary.jsx";
import SalaryDetail from "./pages/SalaryDetail.jsx";
import Navbar from "./components/Navbar.jsx";
import ApiStatus from "./components/ApiStatus.jsx";

const App = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-2">
          <ApiStatus />
        </div>
      </div>
      <div className="py-6">
        <Routes>
          {/* Employee Routes */}
          <Route path="/" element={<Employees />} />
          <Route path="/add" element={<AddEmployee />} />
          <Route path="/edit/:id" element={<EditEmployee />} />
          <Route path="/employee/:id" element={<EmployeeDetail />} />
          
          {/* Salary Routes */}
          <Route path="/salaries" element={<Salaries />} />
          <Route path="/add-salary" element={<AddSalary />} />
          <Route path="/edit-salary/:id" element={<EditSalary />} />
          <Route path="/salary/:id" element={<SalaryDetail />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
