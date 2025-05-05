import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    position: { type: String, required: true },
    salary: { type: Number, required: true },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' }
}, { timestamps: true });

export default mongoose.model('Employee', employeeSchema);
