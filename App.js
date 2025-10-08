import * as React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import ProductListScreen from './screens/ProductListScreen'
import ProductFormScreen from './screens/ProductFormScreen'

const Stack = createNativeStackNavigator()

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Products" component={ProductListScreen} options={{ title: 'Danh sách sản phẩm' }} />
        <Stack.Screen name="ProductForm" component={ProductFormScreen} options={{ title: 'Thêm / Sửa sản phẩm' }} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
