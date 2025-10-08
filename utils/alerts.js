
import { Alert } from 'react-native'

export const safeAlert = (title, message) => {
  if (typeof window !== 'undefined' && typeof window.alert === 'function') {
    // web
    window.alert(`${title ? title + ': ' : ''}${message ?? ''}`)
  } else {
    // RN
    Alert.alert(title ?? 'Thông báo', message ?? '')
  }
}

export const confirmAsync = (title, message, okText = 'Xóa', cancelText = 'Hủy') => {
  if (typeof window !== 'undefined' && typeof window.confirm === 'function') {
    // web
    return Promise.resolve(window.confirm(`${title ? title + ': ' : ''}${message ?? ''}`))
  }
  // RN: dùng Promise với Alert
  return new Promise((resolve) => {
    Alert.alert(title ?? 'Xác nhận', message ?? '', [
      { text: cancelText, style: 'cancel', onPress: () => resolve(false) },
      { text: okText, style: 'destructive', onPress: () => resolve(true) }
    ], { cancelable: true })
  })
}
