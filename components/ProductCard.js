import React from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'

export default function ProductCard({ item, onEdit, onDelete }) {
  return (
    <View style={styles.card}>
      <Text style={styles.name}>{item.productName}</Text>
      <Text>Mã: {item.productCode}</Text>
      <Text>Size: {item.size}</Text>
      <Text>Giá: ${item.price}</Text>
      {!!item.image && (
        <Image source={{ uri: item.image }} style={styles.image} resizeMode="cover" />
      )}
      <View style={styles.row}>
        <TouchableOpacity style={styles.editBtn} onPress={onEdit}>
          <Text style={styles.btnText}>Sửa</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteBtn} onPress={onDelete}>
          <Text style={styles.btnText}>Xóa</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff', padding: 12, marginVertical: 6, borderRadius: 8,
    shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 3, elevation: 2
  },
  name: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  image: { width: '100%', height: 150, borderRadius: 8, marginTop: 8, backgroundColor: '#eee' },
  row: { flexDirection: 'row', gap: 10, marginTop: 10 },
  editBtn: { backgroundColor: '#2980b9', padding: 10, borderRadius: 8, flex: 1, alignItems: 'center' },
  deleteBtn: { backgroundColor: '#e74c3c', padding: 10, borderRadius: 8, flex: 1, alignItems: 'center' },
  btnText: { color: 'white', fontWeight: 'bold' }
})
