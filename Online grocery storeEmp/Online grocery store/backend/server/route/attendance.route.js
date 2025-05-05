import express from 'express';
import { markAttendance, getAttendanceByEmployee, updateAttendance, deleteAttendance } from '../controllers/attendance.controller.js';

const router = express.Router();

//  Add Attendance
router.post('/mark', markAttendance);

//  Get Attendance by Employee ID
router.get('/:employeeId', getAttendanceByEmployee);

// Update Attendance
router.put('/update/:id', updateAttendance);

//  Delete Attendance
router.delete('/delete/:id', deleteAttendance);

export default router;
