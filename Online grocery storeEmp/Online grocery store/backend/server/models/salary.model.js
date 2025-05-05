import mongoose from 'mongoose';

const salarySchema = new mongoose.Schema(
    {
        employeeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Employee',
            required: true,
        },
        month: {
            type: Number,
            required: true,
        },
        year: {
            type: Number,
            required: true,
        },
        daysWorked: {
            type: Number,
            default: 0,
        },
        // New field to track daily attendance
        attendanceDetails: [{
            day: Number,
            status: {
                type: String,
                enum: ['present', 'absent', 'weekend', 'holiday'],
                default: 'absent'
            },
        }],
        basicSalary: {
            type: Number,
            required: true,
        },
        bonus: {
            type: Number,
            default: 0, // Attendance bonus
        },
        overtimePay: {
            type: Number,
            default: 0,
        },
        epf: {
            type: Number,
            default: 0, // Employee Provident Fund
        },
        etf: {
            type: Number,
            default: 0, // Employee Trust Fund
        },
        deductions: {
            type: Number,
            default: 0,
        },
        netSalary: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: ['Pending', 'Approved'],
            default: 'Pending',
        },
        attendanceStatus: {
            type: String,
            enum: ['Pending', 'Approved'],
            default: 'Pending',
        }
    },
    { timestamps: true }
);

const Salary = mongoose.model('Salary', salarySchema);

export default Salary;
