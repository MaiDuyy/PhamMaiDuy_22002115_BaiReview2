import React, { useState, useEffect } from 'react'
import { View, TextInput, StyleSheet, Text, Image, TouchableOpacity, ScrollView, Alert } from 'react-native'
import api from '../service/shoeService'

const sizes = ['S', 'M', 'L', 'XL', 'XXL']

export default function ProductFormScreen({ navigation, route }) {
  const { mode, item } = route.params || {}
  const isEdit = mode === 'edit'

  const [form, setForm] = useState({
    productCode: '',
    productName: '',
    size: 'M',
    price: '',
    quantity: '',
    image: '',
    description: '',
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (isEdit && item) {
      setForm({
        productCode: item.productCode ?? '',
        productName: item.productName ?? '',
        size: item.size ?? 'M',
        price: String(item.price ?? ''),
        quantity: String(item.quantity ?? ''),
        image: item.image ?? '',
        description: item.description ?? '',
      })
    }
  }, [isEdit, item])

  const handleChange = (key, val) => setForm(prev => ({ ...prev, [key]: val }))

  const validate = () => {
    if (!form.productName?.trim()) return 'Tên sản phẩm là bắt buộc'
    if (!form.productCode?.trim()) return 'Mã sản phẩm là bắt buộc'
    const priceNum = Number(form.price)
    if (Number.isNaN(priceNum) || priceNum < 0) return 'Giá không hợp lệ'
    const qtyNum = parseInt(form.quantity, 10)
    if (Number.isNaN(qtyNum) || qtyNum < 0) return 'Số lượng không hợp lệ'
    return null
  }

  const handleSubmit = async () => {
    const err = validate()
    if (err) return Alert.alert('Thiếu dữ liệu', err)
    if (submitting) return

    const payload = {
      ...form,
      price: Number(form.price),
      quantity: parseInt(form.quantity, 10)
    }

    try {
      setSubmitting(true)
      if (isEdit) {
        await api.update(item.id, payload)
        Alert.alert('Thành công', 'Đã cập nhật sản phẩm')
      } else {
        await api.add(payload)
        Alert.alert('Thành công', 'Đã thêm sản phẩm')
      }
      navigation.goBack()
    } catch (e) {
      Alert.alert('Lỗi', isEdit ? 'Không thể cập nhật' : 'Không thể thêm sản phẩm')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 50 }}>
      <TextInput style={styles.input} placeholder="Mã sản phẩm"
        value={form.productCode} onChangeText={t => handleChange('productCode', t)} />
      <TextInput style={styles.input} placeholder="Tên sản phẩm"
        value={form.productName} onChangeText={t => handleChange('productName', t)} />

      <Text style={styles.label}>Chọn size</Text>
      <View style={styles.sizeRow}>
        {sizes.map(s => (
          <TouchableOpacity
            key={s}
            style={[styles.sizeChip, form.size === s && styles.sizeChipActive]}
            onPress={() => handleChange('size', s)}>
            <Text style={[styles.sizeText, form.size === s && styles.sizeTextActive]}>{s}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TextInput style={styles.input} placeholder="Giá" keyboardType="decimal-pad"
        value={form.price} onChangeText={t => handleChange('price', t)} />
      <TextInput style={styles.input} placeholder="Số lượng" keyboardType="number-pad"
        value={form.quantity} onChangeText={t => handleChange('quantity', t)} />
      <TextInput style={styles.input} placeholder="Link ảnh"
        value={form.image} onChangeText={t => handleChange('image', t)} />
      {!!form.image && <Image source={{ uri: form.image }} style={styles.preview} />}
      <TextInput style={[styles.input, { height: 90 }]} multiline placeholder="Mô tả"
        value={form.description} onChangeText={t => handleChange('description', t)} />

      <View style={styles.row}>
        <TouchableOpacity style={styles.saveBtn} onPress={handleSubmit}>
          <Text style={styles.btnText}>{submitting ? 'Đang lưu...' : isEdit ? 'Lưu' : 'Thêm'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.btnText}>Hủy</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  input: {
    backgroundColor: '#f7f7f7', borderRadius: 8, padding: 12, marginBottom: 10,
    borderWidth: 1, borderColor: '#ddd'
  },
  label: { fontWeight: '600', marginBottom: 6, marginTop: 4 },
  sizeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 10 },
  sizeChip: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 20, borderWidth: 1, borderColor: '#bbb' },
  sizeChipActive: { backgroundColor: '#2980b9', borderColor: '#2980b9' },
  sizeText: { color: '#333', fontWeight: '600' },
  sizeTextActive: { color: '#fff' },
  preview: { width: '100%', height: 150, borderRadius: 8, marginBottom: 10 },
  row: { flexDirection: 'row', gap: 10, marginTop: 10 },
  saveBtn: { backgroundColor: '#27ae60', padding: 12, borderRadius: 8, flex: 1, alignItems: 'center' },
  cancelBtn: { backgroundColor: '#7f8c8d', padding: 12, borderRadius: 8, flex: 1, alignItems: 'center' },
  btnText: { color: 'white', fontWeight: 'bold' }
})
