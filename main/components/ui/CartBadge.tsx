import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import { getCart } from '@/services/api';

interface CartBadgeProps {
  color?: string;
  size?: number;
  style?: any;
}

export function CartBadge({ color = '#1F1D2B', size = 24, style }: CartBadgeProps) {
  const [count, setCount] = useState(0);
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const fetchCart = async () => {
        try {
          const cart = await getCart();
          if (isActive) {
            const totalItems = cart.items ? cart.items.reduce((sum: number, item: any) => sum + item.quantity, 0) : 0;
            setCount(totalItems);
          }
        } catch {
          if (isActive) setCount(0);
        }
      };

      fetchCart();
      
      return () => {
        isActive = false;
      };
    }, [])
  );

  return (
    <TouchableOpacity onPress={() => router.push('/cart')} style={style}>
      <View>
        <Ionicons name="cart-outline" size={size} color={color} />
        {count > 0 && (
          <View style={badgeStyles.badge}>
            <Text style={badgeStyles.badgeText}>{count > 99 ? '99+' : count}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const badgeStyles = StyleSheet.create({
  badge: {
    position: 'absolute',
    top: -6,
    right: -8,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
});
