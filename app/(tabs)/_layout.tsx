import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: 'blue', // Customize active tab color
        headerShown: false, // Hide headers on all screens
        tabBarStyle: {
          backgroundColor: '#000000', // Set tab bar background to black
          borderTopColor: 'transparent', // Remove the top border for a seamless look
        },
        tabBarInactiveTintColor: 'gray', // Inactive tab color
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Chat', // Tab title
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />, // Tab icon
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile', // Tab title
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="user" color={color} />, // Tab icon
        }}
      />
    </Tabs>
  );
}
