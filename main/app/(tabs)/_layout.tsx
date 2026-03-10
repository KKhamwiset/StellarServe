import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function TabLayout() {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const loadRole = async () => {
      const userData = await AsyncStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        setRole(user.role || 'consumer');
      } else {
        setRole('consumer');
      }
    };
    loadRole();
  }, []);

  const isSeller = role === 'seller';

  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: Colors.white },
        headerTintColor: Colors.text,
        headerShadowVisible: false,
        tabBarStyle: {
          backgroundColor: Colors.tabBar,
          borderTopColor: Colors.border,
          height: 64,
          paddingBottom: 10,
          paddingTop: 6,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.06,
          shadowRadius: 8,
        },
        tabBarActiveTintColor: Colors.tabActive,
        tabBarInactiveTintColor: Colors.tabInactive,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >
      {/* Consumer tabs */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          headerShown: false,
          href: isSeller ? null : '/(tabs)',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="storefront" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          headerShown: false,
          href: isSeller ? null : '/(tabs)/search',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="favorite"
        options={{
          title: 'Favorite',
          headerShown: false,
          href: isSeller ? null : '/(tabs)/favorite',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="bookmark" size={size} color={color} />
          ),
        }}
      />

      {/* Seller tabs */}
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          headerShown: false,
          href: isSeller ? '/(tabs)/dashboard' : null,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="grid" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="menu-manager"
        options={{
          title: 'Menu',
          headerShown: false,
          href: isSeller ? '/(tabs)/menu-manager' : null,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="restaurant" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="seller-orders"
        options={{
          title: 'Orders',
          headerShown: false,
          href: isSeller ? '/(tabs)/seller-orders' : null,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="receipt" size={size} color={color} />
          ),
        }}
      />

      {/* Shared tab */}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
