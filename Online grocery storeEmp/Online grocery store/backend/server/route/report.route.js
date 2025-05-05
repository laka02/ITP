import express from 'express';
import { generateSalaryReport } from '../controllers/report.controller.js';

const router = express.Router();

//  Generate Salary Report
router.get('/salary', generateSalaryReport);

export default router;
