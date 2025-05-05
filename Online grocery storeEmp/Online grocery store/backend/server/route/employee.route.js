import express from 'express';
import { addEmployee, getAllEmployees, getEmployeeById, updateEmployee, deleteEmployee } from '../controllers/employee.controller.js';

const router = express.Router();

// Create a new Employee
router.post('/add', addEmployee);

//  Get All Employees
router.get('/', getAllEmployees);

//  Get Employee by ID
router.get('/:id', getEmployeeById);

//  Update Employee
router.put('/update/:id', updateEmployee);

//  Delete Employee
router.delete('/delete/:id', deleteEmployee);

export default router;
