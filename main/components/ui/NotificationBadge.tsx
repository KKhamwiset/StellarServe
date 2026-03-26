import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { getUnreadNotificationCount, getNotifications } from '@/services/api';
import Toast from 'react-native-toast-message';

interface NotificationBadgeProps {
  color?: string;
  size?: number;
  style?: any;
}

export function NotificationBadge({ color = '#1F1D2B', size = 24, style }: NotificationBadgeProps) {
  const [count, setCount] = useState(0);
  const router = useRouter();
  const previousCountRef = useRef(-1);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const data = await getUnreadNotificationCount();
        const countIncreased = previousCountRef.current !== -1 && data.unread_count > previousCountRef.current;

        if (countIncreased) {
          try {
            const allNotifs = await getNotifications();
            const latestUnread = allNotifs.find(n => !n.is_read);

            if (latestUnread) {
              Toast.show({
                type: 'info',
                text1: latestUnread.title,
                text2: latestUnread.message,
                position: 'top',
                onPress: () => {
                  router.push('/notifications');
                  Toast.hide();
                }
              });
            }
          } catch (e) {
            console.error(e);
          }
        }

        previousCountRef.current = data.unread_count;
        setCount(data.unread_count);
      } catch {
      }
    };

    fetchCount();
    const interval = setInterval(fetchCount, 5000); // Lower interval for more real-time feel
    return () => clearInterval(interval);
  }, []);

  return (
    <TouchableOpacity onPress={() => {
      router.push('/notifications');
      setCount(0);
    }} style={style}>
      <View>
        <Ionicons name="notifications-outline" size={size} color={color} />
        {count > 0 && (
          <View style={badgeStyles.badge}>
            <Text style={badgeStyles.badgeText}>{count > 9 ? '9+' : count}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const badgeStyles = StyleSheet.create({
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
});
