import Supplier from '../models/supplier.model.js';
import Product from '../models/product.model.js';

// Create new supplier
export const createSupplier = async (req, res) => {
    try {
        const supplier = new Supplier(req.body);
        await supplier.save();
        res.status(201).json(supplier);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all suppliers
export const getAllSuppliers = async (req, res) => {
    try {
        const suppliers = await Supplier.find().populate('productsSupplied', 'name price');
        res.json(suppliers);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get single supplier
export const getSupplierById = async (req, res) => {
    try {
        const supplier = await Supplier.findById(req.params.id)
            .populate('productsSupplied', 'name price stock');
        
        if (!supplier) {
            return res.status(404).json({ message: 'Supplier not found' });
        }
        res.json(supplier);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update supplier
export const updateSupplier = async (req, res) => {
    try {
        const supplier = await Supplier.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!supplier) {
            return res.status(404).json({ message: 'Supplier not found' });
        }
        res.json(supplier);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Generate purchase order (for low stock items)
export const generatePurchaseOrder = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const supplier = await Supplier.findById(req.params.id);
        
        if (!supplier) {
            return res.status(404).json({ message: 'Supplier not found' });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Check if supplier provides this product
        if (!supplier.productsSupplied.includes(productId)) {
            return res.status(400).json({ message: 'This supplier does not provide the requested product' });
        }

        const purchaseOrder = await supplier.generatePurchaseOrder(productId, quantity);
        
        // In a real app, you would save the PO to database here
        // await PurchaseOrder.create(purchaseOrder);
        
        res.json({
            message: 'Purchase order generated successfully',
            purchaseOrder,
            supplierEmail: supplier.email
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// In supplier.controller.js
export const deleteSupplier = async (req, res) => {
    try {
        console.log('Deleting supplier ID:', req.params.id); // Debug log
        const deletedSupplier = await Supplier.findByIdAndDelete(req.params.id);
        
        if (!deletedSupplier) {
            console.log('Supplier not found'); // Debug log
            return res.status(404).json({ message: 'Supplier not found' });
        }
        
        console.log('Successfully deleted:', deletedSupplier); // Debug log
        res.json({ message: 'Supplier deleted successfully' });
    } catch (error) {
        console.error('Delete error:', error); // Debug log
        res.status(500).json({ 
            message: 'Error deleting supplier',
            error: error.message 
        });
    }
};