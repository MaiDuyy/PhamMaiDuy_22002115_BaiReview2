import axios from 'axios'

const MOCK_URL = "https://68e08c4e93207c4b4794b681.mockapi.io/api/products/shoes"; 
const MONGO_URL = "http://localhost:4000/shoes"; 

const api = axios.create({
  baseURL: MONGO_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
});

// Interceptor để log lỗi
api.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default {
  // Lấy danh sách toàn bộ sản phẩm
  list: async () => {
    try {
      const res = await api.get('/');
      return res.data;
    } catch (error) {
      console.error('List error:', error);
      throw error;
    }
  },

  // Thêm mới sản phẩm
  add: async (product) => {
    try {
      const res = await api.post('/', product);
      return res.data;
    } catch (error) {
      console.error('Add error:', error);
      throw error;
    }
  },

  // Cập nhật sản phẩm theo ID
  update: async (id, updatedProduct) => {
    try {
      console.log('Updating product:', id, updatedProduct);
      const res = await api.put(`/${id}`, updatedProduct);
      return res.data;
    } catch (error) {
      console.error('Update error:', error);
      throw error;
    }
  },

  // Xóa sản phẩm theo ID
  delete: async (id) => {
    try {
      console.log('Deleting product:', id);
      const res = await api.delete(`/${id}`);
      return res.data;
    } catch (error) {
      console.error('Delete error:', error);
      throw error;
    }
  }
}