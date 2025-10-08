import axios from 'axios'

const MOCK_URL = "https://68e08c4e93207c4b4794b681.mockapi.io/api/products/shoes" ; 
const MONGO_URL = "http://localhost:4000/shoes" ; 
const api = axios.create({
  baseURL :MONGO_URL  , 
  headers : {
    'Content-Type' : ' application/json'
  }, 
  timeout : 10000

})
export default {
  // Lấy danh sách toàn bộ sản phẩm
  list: async () => {
    const res = await api.get('/')
    return res.data
  },

  // Thêm mới sản phẩm
  add: async (product) => {
    const res = await api.post('/', product)
    return res.data
  },

  // Cập nhật sản phẩm theo ID
  update: async (id, updatedProduct) => {
    const res = await api.put(`/${id}`, updatedProduct)
    return res.data
  },

  // Xóa sản phẩm theo ID
  delete: async (id) => {
    const res = await api.delete(`/${id}`)
    return res.data
  }
}