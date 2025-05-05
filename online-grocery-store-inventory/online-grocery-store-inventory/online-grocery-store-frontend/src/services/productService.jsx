import axios from 'axios';

// Update all endpoints to use '/api' prefix
export const getProducts = async () => {
  return await axios.get('/api/products'); // Changed from 'http://localhost:3000/api/products'
};

export const createProduct = async (productData) => {
  return await axios.post('/api/products', productData);
};

export const updateProduct = async (id, productData) => {
  return await axios.put(`/api/products/${id}`, productData);
};

export const deleteProduct = async (id) => {
  return await axios.delete(`/api/products/${id}`);
};