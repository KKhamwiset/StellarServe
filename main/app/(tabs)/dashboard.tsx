import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/theme';
import { useState, useEffect } from 'react';
import { getMyRestaurant, getRestaurantOrders, getRestaurantMenu, getRevenue } from '@/services/api';
import { Restaurant } from '@/types/api'
import { StatCard } from '@/components/ui/StatCard';
import { NotificationBadge } from '@/components/ui/NotificationBadge';

export default function DashboardScreen() {
    const [restaurantData, setRestaurantData] = useState<Restaurant | null>(null);
    const [orderData, setOrderData] = useState<{ orders_count: number; income: number } | null>(null);
    const [revenue, setRevenue] = useState<number | null>(null);
    const [menuData, setMenuData] = useState<{ items: number } | null>(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const init = async () => {
            try {
                const restaurant = await getMyRestaurant();
                setRestaurantData(restaurant);

                const orderData = await getRestaurantOrders(restaurant.id);
                setOrderData(orderData);

                const rev = await getRevenue(restaurant.id);
                setRevenue(rev.total_revenue)
                const menuData = await getRestaurantMenu(restaurant.id);

                setMenuData(menuData);
            } catch (error) {
                console.error('Failed to load restaurants:', error);
            }

            setLoading(false);
        };
        init();
    }, []);

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={[styles.header, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
                <Text style={styles.headerTitle}>{restaurantData?.name}</Text>
                <NotificationBadge size={24} color={Colors.primary} />
            </View>

            <View style={styles.content}>
                <View style={styles.statsGrid}>
                    <StatCard
                        icon="receipt-outline"
                        value={orderData?.orders_count}
                        label="Orders Today"
                    />
                    <StatCard
                        icon="cash-outline"
                        value={`฿${revenue}`}
                        label="Revenue"
                        iconColor={Colors.accent}
                    />
                    <StatCard
                        icon="fast-food-outline"
                        value={menuData?.items}
                        label="Menu Items"
                    />
                    <StatCard
                        icon="star"
                        value={restaurantData?.rating}
                        label="Rating"
                        iconColor={Colors.star}
                    />
                </View>

                <View style={styles.infoCard}>
                    <Ionicons name="information-circle-outline" size={24} color={Colors.primary} />
                    <Text style={styles.infoText}>
                        Welcome to your seller dashboard! Manage your restaurant, menu items, and orders from here.
                    </Text>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    header: {
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    headerTitle: {
        fontSize: FontSize.xl,
        fontWeight: 'bold',
        color: Colors.text,
    },
    content: {
        flex: 1,
        padding: Spacing.lg,
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.md,
        marginBottom: Spacing.xl,
    },
    statValue: {
        fontSize: FontSize.xxl,
        fontWeight: 'bold',
        color: Colors.text,
    },
    statLabel: {
        fontSize: FontSize.sm,
        color: Colors.textSecondary,
    },
    infoCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.md,
        backgroundColor: Colors.surface,
        borderRadius: BorderRadius.lg,
        padding: Spacing.lg,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    infoText: {
        flex: 1,
        fontSize: FontSize.sm,
        color: Colors.textSecondary,
        lineHeight: 20,
    },
});
