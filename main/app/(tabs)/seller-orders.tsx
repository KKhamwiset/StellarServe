import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/theme';
import { Order, getSellerOrders } from '@/services/api';

const STATUS_COLORS: Record<string, string> = {
    pending: Colors.warning,
    preparing: Colors.info,
    ready: Colors.success,
    delivered: Colors.textMuted,
    cancelled: Colors.error,
};

export default function SellerOrdersScreen() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    const loadOrders = useCallback(async () => {
        try {
            setLoading(true);
            const data = await getSellerOrders();
            setOrders(data);
        } catch (error) {
            console.error('Failed to load orders:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadOrders();
    }, [loadOrders]);

    const renderOrder = ({ item }: { item: Order }) => {
        const date = new Date(item.created_at);
        const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const dateStr = date.toLocaleDateString();
        const statusColor = STATUS_COLORS[item.status] || Colors.textMuted;

        return (
            <View style={styles.orderCard}>
                {/* Order header */}
                <View style={styles.orderHeader}>
                    <View>
                        <Text style={styles.orderId}>#{item.id.slice(-6).toUpperCase()}</Text>
                        <Text style={styles.orderDate}>{dateStr} • {timeStr}</Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: statusColor + '20' }]}>
                        <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
                        <Text style={[styles.statusText, { color: statusColor }]}>
                            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                        </Text>
                    </View>
                </View>

                {/* Order items */}
                <View style={styles.orderItems}>
                    {item.items.map((orderItem, i) => (
                        <View key={i} style={styles.orderItemRow}>
                            <Text style={styles.orderItemQty}>{orderItem.quantity}×</Text>
                            <Text style={styles.orderItemName} numberOfLines={1}>{orderItem.name}</Text>
                            <Text style={styles.orderItemPrice}>${orderItem.subtotal.toFixed(2)}</Text>
                        </View>
                    ))}
                </View>

                {/* Order total */}
                <View style={styles.orderFooter}>
                    <Text style={styles.totalLabel}>Total</Text>
                    <Text style={styles.totalPrice}>${item.total.toFixed(2)}</Text>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Orders</Text>
                <TouchableOpacity onPress={loadOrders} activeOpacity={0.7}>
                    <Ionicons name="refresh-outline" size={22} color={Colors.text} />
                </TouchableOpacity>
            </View>

            {orders.length === 0 && !loading ? (
                <View style={styles.emptyState}>
                    <Ionicons name="receipt-outline" size={64} color={Colors.textMuted} />
                    <Text style={styles.emptyTitle}>No orders yet</Text>
                    <Text style={styles.emptyText}>
                        When customers place orders from your restaurant, they will appear here.
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={orders}
                    keyExtractor={(item) => item.id}
                    renderItem={renderOrder}
                    contentContainerStyle={{ padding: Spacing.lg, gap: Spacing.md }}
                    showsVerticalScrollIndicator={false}
                    refreshing={loading}
                    onRefresh={loadOrders}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
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
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: Spacing.xl,
        gap: Spacing.sm,
    },
    emptyTitle: {
        fontSize: FontSize.lg,
        fontWeight: 'bold',
        color: Colors.textMuted,
    },
    emptyText: {
        fontSize: FontSize.sm,
        color: Colors.textSecondary,
        textAlign: 'center',
        lineHeight: 20,
    },
    // Order cards
    orderCard: {
        backgroundColor: Colors.card,
        borderRadius: BorderRadius.lg,
        padding: Spacing.md,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: Spacing.sm,
    },
    orderId: {
        fontSize: FontSize.md,
        fontWeight: '700',
        color: Colors.text,
    },
    orderDate: {
        fontSize: FontSize.xs,
        color: Colors.textMuted,
        marginTop: 2,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: Spacing.sm,
        paddingVertical: 4,
        borderRadius: BorderRadius.full,
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    statusText: {
        fontSize: FontSize.xs,
        fontWeight: '600',
    },
    orderItems: {
        borderTopWidth: 1,
        borderTopColor: Colors.border,
        paddingTop: Spacing.sm,
        gap: 6,
    },
    orderItemRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    orderItemQty: {
        fontSize: FontSize.sm,
        fontWeight: '700',
        color: Colors.primary,
        width: 30,
    },
    orderItemName: {
        flex: 1,
        fontSize: FontSize.sm,
        color: Colors.text,
    },
    orderItemPrice: {
        fontSize: FontSize.sm,
        color: Colors.textSecondary,
    },
    orderFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: Colors.border,
        paddingTop: Spacing.sm,
        marginTop: Spacing.sm,
    },
    totalLabel: {
        fontSize: FontSize.md,
        fontWeight: '600',
        color: Colors.textSecondary,
    },
    totalPrice: {
        fontSize: FontSize.lg,
        fontWeight: '700',
        color: Colors.primary,
    },
});
