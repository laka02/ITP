import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import connectDB from './config/connectDB.js';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import Routes
import userRouter from './route/user.route.js';
import categoryRouter from './route/category.route.js';
import uploadRouter from './route/upload.router.js';
import subCategoryRouter from './route/subCategory.route.js';
import productRouter from './route/product.route.js';
import cartRouter from './route/cart.route.js';
import addressRouter from './route/address.route.js';
import orderRouter from './route/order.route.js';


// Employee Salary Management Routes
import employeeRouter from './route/employee.route.js';
import salaryRouter from './route/salary.route.js';
import attendanceRouter from './route/attendance.route.js'; 

// 🔹 Report Generation Route
import reportRouter from './route/report.route.js';  //  Added Report Route

const app = express();


// 🔹 Define Port Properly
const PORT = process.env.PORT || 5000;

// 🔹 Security Middleware
app.use(helmet({ crossOriginResourcePolicy: false }));

// 🔹 CORS Middleware
app.use(cors({
    credentials: true,
    origin: "http://localhost:5173", // Update this to match your Vite frontend port
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

// 🔹 Middleware
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

// Serve reports directory for PDF downloads
app.use('/downloads/reports', express.static(path.join(__dirname, 'reports')));

// 🔹 Test API Route
app.get("/", (req, res) => {
    res.json({ message: `Server is running on port ${PORT}` });
});

// 🔹 E-Commerce API Routes
app.use('/api/user', userRouter);
app.use("/api/category", categoryRouter);
app.use("/api/file", uploadRouter);
app.use("/api/subcategory", subCategoryRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/address", addressRouter);
app.use('/api/order', orderRouter);

// 🔹 Employee Salary Management API Routes
app.use('/api/employee', employeeRouter);   
app.use('/api/salary', salaryRouter);       
app.use('/api/attendance', attendanceRouter); 

// 🔹 Report API Route (New)
app.use('/api/report', reportRouter); //  Added Report Route

// 🔹 Connect to Database & Start Server
connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(` Server is running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error(" Database connection failed:", error);
        process.exit(1);
    });
