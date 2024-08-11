import { View, Text } from 'react-native'
import React from 'react'
import { useAuthStore } from '@/store'
import Login from '@/components/Login'
import { Link } from 'expo-router'

const Index = () => {
  const isLoggedIn = useAuthStore(state => state.isLoggedIn)
  if (!isLoggedIn) {
    return (
      <Login />
    )
  } else {
    return (
      <View>
        <Text>Hello World</Text>
        <Link href={'/additional-information'} >Go to additional information page</Link>
      </View>
    )
  }
}

export default Index