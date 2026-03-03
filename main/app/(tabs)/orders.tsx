import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/theme';

// Mock orders for the UI scaffold
const MOCK_ORDERS = [
    {
        id: 'ord-abc12345',
        restaurant: 'Midnight Ramen House',
        items: '2x Tonkotsu Ramen, 1x Gyoza',
        total: 680,
        status: 'delivered',
        date: '2 hours ago',
    },
    {
        id: 'ord-def67890',
        restaurant: 'Moonlight Thai Kitchen',
        items: '1x Pad Thai, 1x Green Curry',
        total: 400,
        status: 'preparing',
        date: 'Just now',
    },
];

const statusConfig: Record<string, { color: string; icon: string; label: string }> = {
    pending: { color: Colors.warning, icon: 'time', label: 'Pending' },
    confirmed: { color: Colors.info, icon: 'checkmark-circle', label: 'Confirmed' },
    preparing: { color: Colors.primary, icon: 'flame', label: 'Preparing' },
    delivering: { color: Colors.info, icon: 'bicycle', label: 'On the way' },
    delivered: { color: Colors.success, icon: 'checkmark-done', label: 'Delivered' },
    cancelled: { color: Colors.error, icon: 'close-circle', label: 'Cancelled' },
};

export default function OrdersScreen() {
    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
                <Text style={styles.title}>Your Orders</Text>
                <Text style={styles.subtitle}>{MOCK_ORDERS.length} orders</Text>
            </View>

            {MOCK_ORDERS.map((order) => {
                const status = statusConfig[order.status] || statusConfig.pending;
                return (
                    <TouchableOpacity key={order.id} style={styles.orderCard} activeOpacity={0.7}>
                        <View style={styles.orderHeader}>
                            <View style={styles.orderRestaurant}>
                                <Ionicons name="restaurant" size={18} color={Colors.primary} />
                                <Text style={styles.restaurantName}>{order.restaurant}</Text>
                            </View>
                            <View style={[styles.statusBadge, { backgroundColor: status.color + '22' }]}>
                                <Ionicons name={status.icon as any} size={12} color={status.color} />
                                <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
                            </View>
                        </View>

                        <Text style={styles.orderItems}>{order.items}</Text>

                        <View style={styles.orderFooter}>
                            <Text style={styles.orderTotal}>฿{order.total.toFixed(2)}</Text>
                            <Text style={styles.orderDate}>{order.date}</Text>
                        </View>
                    </TouchableOpacity>
                );
            })}

            <View style={{ height: 32 }} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    header: {
        paddingHorizontal: Spacing.lg,
        paddingTop: Spacing.xl,
        paddingBottom: Spacing.md,
    },
    title: {
        fontSize: FontSize.xxl,
        fontWeight: '700',
        color: Colors.text,
    },
    subtitle: {
        fontSize: FontSize.sm,
        color: Colors.textSecondary,
        marginTop: Spacing.xs,
    },
    orderCard: {
        backgroundColor: Colors.card,
        marginHorizontal: Spacing.lg,
        marginBottom: Spacing.sm,
        borderRadius: BorderRadius.lg,
        padding: Spacing.md,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.sm,
    },
    orderRestaurant: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
        flex: 1,
    },
    restaurantName: {
        fontSize: FontSize.md,
        fontWeight: '600',
        color: Colors.text,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: BorderRadius.full,
    },
    statusText: {
        fontSize: FontSize.xs,
        fontWeight: '600',
    },
    orderItems: {
        fontSize: FontSize.sm,
        color: Colors.textSecondary,
        marginBottom: Spacing.sm,
    },
    orderFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: Colors.border,
        paddingTop: Spacing.sm,
    },
    orderTotal: {
        fontSize: FontSize.md,
        fontWeight: '700',
        color: Colors.primary,
    },
    orderDate: {
        fontSize: FontSize.xs,
        color: Colors.textMuted,
    },
});
