import React, { useEffect, useState } from 'react'
import { StyleSheet, View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native'
import api from '../service/shoeService'
import ProductCard from '../components/ProductCard'
import { confirmAsync, safeAlert } from '../utils/alerts'

export default function ProductListScreen({ navigation }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  const loadProducts = async () => {
    try {
      setLoading(true)
      const data = await api.list()
      setProducts(Array.isArray(data) ? data : [])
    } catch (e) {
      safeAlert('Lỗi', 'Không thể tải danh sách sản phẩm')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadProducts)
    return unsubscribe
  }, [navigation])

  const getKey = (item) => item?._id || item?.id

  const handleDelete = async (item) => {
    const key = getKey(item)
    if (!key) {
      safeAlert('Lỗi', 'Không xác định được ID sản phẩm')
      return
    }

    const ok = await confirmAsync('Xác nhận xóa', 'Bạn có chắc chắn muốn xóa sản phẩm này không?')
    if (!ok) return

    try {
      await api.delete(key) // backend sẽ nhận _id hoặc id (xem phần server bên dưới)
      setProducts(prev => prev.filter(p => (p._id || p.id) !== key))
      safeAlert('Đã xóa', 'Sản phẩm đã được xóa')
    } catch (e) {
      console.error(e)
      safeAlert('Lỗi', 'Không thể xóa sản phẩm')
    }
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Đang tải dữ liệu...</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        keyExtractor={(item, idx) => String(getKey(item) ?? idx)}
        renderItem={({ item }) => (
          <ProductCard
            item={item}
            onEdit={() => navigation.navigate('ProductForm', { mode: 'edit', item })}
            onDelete={() => handleDelete(item)}
          />
        )}
        contentContainerStyle={{ paddingBottom: 90 }}
      />

      <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('ProductForm', { mode: 'add' })}>
        <Text style={styles.fabText}>＋</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#ecf0f1' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  fab: {
    position: 'absolute', right: 16, bottom: 24, width: 56, height: 56,
    borderRadius: 28, backgroundColor: '#27ae60', alignItems: 'center',
    justifyContent: 'center', elevation: 4
  },
  fabText: { color: '#fff', fontSize: 28, lineHeight: 28, fontWeight: 'bold', marginTop: -2 }
})
