import React from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();
  
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <h2 className="text-2xl font-bold text-secondary-200">Employee Management</h2>
          
          <div className="space-x-6">
            <Link 
              to="/" 
              className={`${location.pathname === '/' ? 'text-primary-200 font-medium' : 'text-gray-600 hover:text-primary-200'}`}
            >
              Employees
            </Link>
            <Link 
              to="/add" 
              className={`${location.pathname === '/add' ? 'text-primary-200 font-medium' : 'text-gray-600 hover:text-primary-200'}`}
            >
              Add Employee
            </Link>
            <Link 
              to="/salaries" 
              className={`${location.pathname.startsWith('/salar') ? 'text-primary-200 font-medium' : 'text-gray-600 hover:text-primary-200'}`}
            >
              Salary Management
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;