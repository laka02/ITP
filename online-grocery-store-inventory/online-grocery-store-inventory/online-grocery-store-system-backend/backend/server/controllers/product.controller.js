import Product from '../models/product.model.js';
import { upload, imageUploadUtil, cloudinary } from '../utils/cloudinary.util.js';

// Create a new product with image upload
export const createProduct = async (req, res) => {
    try {
        console.log('Request files received:', {
            count: req.files?.length,
            files: req.files?.map(f => ({
                name: f.originalname,
                size: f.size,
                type: f.mimetype
            }))
        });

        let images = [];
        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                try {
                    const result = await imageUploadUtil(file);
                    images.push({
                        public_id: result.public_id,
                        url: result.secure_url
                    });
                } catch (uploadError) {
                    console.error(`Failed to upload ${file.originalname}:`, uploadError);
                    // Continue with other files even if one fails
                }
            }
        }

        if (images.length === 0 && req.files?.length > 0) {
            throw new Error('All image uploads failed');
        }

        const product = new Product({
            ...req.body,
            images
        });

        await product.save();
        res.status(201).json(product);
    } catch (error) {
        console.error('Product creation failed:', {
            error: error.message,
            body: req.body,
            stack: error.stack
        });
        res.status(400).json({ 
            success: false,
            message: error.message,
            ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
        });
    }
};

// Get all products
export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single product by ID
export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a product (with optional image update)
export const updateProduct = async (req, res) => {
    try {
        let updateData = { ...req.body };
        
        // Handle image upload if present
        if (req.files && req.files.length > 0) {
            const images = [];
            for (const file of req.files) {
                try {
                    const result = await imageUploadUtil(file);
                    images.push({
                        public_id: result.public_id,
                        url: result.secure_url
                    });
                } catch (uploadError) {
                    console.error(`Failed to upload ${file.originalname}:`, uploadError);
                    // Continue with other files even if one fails
                }
            }
            
            // Combine existing images with new ones
            if (req.body.existingImages) {
                const existingImages = JSON.parse(req.body.existingImages);
                updateData.images = [...existingImages, ...images];
            } else {
                updateData.images = images;
            }
        } else if (req.body.existingImages) {
            // If no new images but existing images are provided
            updateData.images = JSON.parse(req.body.existingImages);
        }

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );
        
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        console.error('Product update failed:', {
            error: error.message,
            body: req.body,
            stack: error.stack
        });
        res.status(400).json({ 
            success: false,
            message: error.message,
            ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
        });
    }
};

// Delete a product (and its images from Cloudinary)
export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Delete images from Cloudinary if they exist
        if (product.images && product.images.length > 0) {
            try {
                for (const image of product.images) {
                    if (image.public_id) {
                        await cloudinary.uploader.destroy(image.public_id);
                    }
                }
            } catch (cloudinaryError) {
                console.error('Error deleting images from Cloudinary:', cloudinaryError);
                // Continue with product deletion even if image deletion fails
            }
        }

        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ message: error.message });
    }
};

// Get total stock sum of all products
export const getTotalStock = async (req, res) => {
    try {
        const result = await Product.aggregate([
            {
                $group: {
                    _id: null,
                    totalStock: { $sum: "$stock" }
                }
            }
        ]);

        const totalStock = result.length > 0 ? result[0].totalStock : 0;
        res.json({ totalStock });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get comprehensive inventory statistics
export const getInventoryStats = async (req, res) => {
    try {
        const result = await Product.aggregate([
            {
                $group: {
                    _id: null,
                    totalStock: { $sum: "$stock" },
                    totalProducts: { $sum: 1 },
                    averagePrice: { $avg: "$price" },
                    totalValue: { $sum: { $multiply: ["$price", "$stock"] } },
                    categories: { $addToSet: "$category" }
                }
            },
            {
                $project: {
                    _id: 0,
                    totalStock: 1,
                    totalProducts: 1,
                    averagePrice: { $round: ["$averagePrice", 2] },
                    totalValue: { $round: ["$totalValue", 2] },
                    categoryCount: { $size: "$categories" }
                }
            }
        ]);

        res.json(result[0] || {
            totalStock: 0,
            totalProducts: 0,
            averagePrice: 0,
            totalValue: 0,
            categoryCount: 0
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};