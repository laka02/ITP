import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
    salaryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Salary', required: true },
    reportType: { type: String, enum: ['Salary Report', 'Attendance Report'], required: true },
    generatedAt: { type: Date, default: Date.now },
    fileUrl: { type: String, required: true } // Store the URL/path of the generated report
}, { timestamps: true });

export default mongoose.model('Report', reportSchema);
