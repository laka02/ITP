import express from 'express';
import { 
    calculateSalary, 
    getAllSalaries, 
    getSalaryById,
    getSalariesByEmployee,
    updateSalary,
    approveSalary, 
    approveAttendance,
    generateSalaryReport,
    generateSingleSalaryPDF
} from '../controllers/salary.controller.js';

const router = express.Router();

// Calculate salary for an employee
router.post('/calculate/:id', calculateSalary);

// Get all salaries
router.get('/', getAllSalaries);

// Get salary by ID
router.get('/:id', getSalaryById);

// Get all salaries for a specific employee
router.get('/employee/:employeeId', getSalariesByEmployee);

// Update salary
router.put('/update/:id', updateSalary);

// Approve salary
router.put('/approve/:id', approveSalary);

// Approve attendance status
router.put('/approve-attendance/:id', approveAttendance);

// Generate salary report
router.get('/report', generateSalaryReport);

// Generate PDF for a single salary
router.get('/pdf/:id', generateSingleSalaryPDF);

export default router;
