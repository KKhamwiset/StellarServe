import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState, useCallback, useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/theme';
import { getRiderOrders, updateRiderOrderStatus } from '@/services/api';
import { Order } from '@/types/api';
import { NotificationBadge } from '@/components/ui/NotificationBadge';

const STATUS_CONFIG: Record<string, { icon: string; color: string; label: string; nextStatus?: string; nextLabel?: string }> = {
    pending: { icon: 'time-outline', color: Colors.warning, label: 'Pending', nextStatus: 'picked_up', nextLabel: 'Pick Up' },
    confirmed: { icon: 'checkmark-circle-outline', color: Colors.info, label: 'Confirmed', nextStatus: 'picked_up', nextLabel: 'Pick Up' },
    preparing: { icon: 'flame-outline', color: '#F97316', label: 'Preparing', nextStatus: 'picked_up', nextLabel: 'Pick Up' },
    picked_up: { icon: 'bag-check-outline', color: '#8B5CF6', label: 'Picked Up', nextStatus: 'delivering', nextLabel: 'Start Delivery' },
    delivering: { icon: 'bicycle-outline', color: Colors.info, label: 'Delivering', nextStatus: 'delivered', nextLabel: 'Complete Delivery' },
    delivered: { icon: 'checkmark-done-outline', color: Colors.success, label: 'Delivered' },
    cancelled: { icon: 'close-circle-outline', color: Colors.error, label: 'Cancelled' },
};

function getStatusConfig(status: string) {
    return STATUS_CONFIG[status.toLowerCase()] ?? { icon: 'help-outline', color: Colors.textMuted, label: status };
}

function formatDate(iso: string) {
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        + ' · '
        + d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

type FilterTab = 'active' | 'completed';

export default function RiderDeliveriesScreen() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<FilterTab>('active');
    const isFetchingRef = useRef(false);

    const load = useCallback(async () => {
        if (isFetchingRef.current) return;
        isFetchingRef.current = true;
        try {
            const data = await getRiderOrders();
            setOrders(data);
        } catch (e) {
            console.error('Failed to load rider orders:', e);
        } finally {
            isFetchingRef.current = false;
            setIsLoading(false);
            setRefreshing(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            load();

            const intervalId = setInterval(() => {
                load();
            }, 5000);

            return () => clearInterval(intervalId);
        }, [load])
    );

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        load();
    }, [load]);

    const handleStatusUpdate = async (orderId: string, newStatus: string) => {
        setUpdatingId(orderId);
        try {
            await updateRiderOrderStatus(orderId, newStatus);
            await load();
        } catch (e) {
            console.error('Failed to update status:', e);
        } finally {
            setUpdatingId(null);
        }
    };

    const activeOrders = orders.filter(o => !['delivered', 'cancelled'].includes(o.status.toLowerCase()));
    const completedOrders = orders.filter(o => ['delivered', 'cancelled'].includes(o.status.toLowerCase()));
    const filteredOrders = activeTab === 'active' ? activeOrders : completedOrders;
    
    /* ─── Loading ──────────────────────────────────────── */
    if (isLoading) {
        return (
            <SafeAreaView style={[styles.container, styles.center]} edges={['top']}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </SafeAreaView>
        );
    }

    /* ─── Render ───────────────────────────────────────── */
    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={[styles.headerSection, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }]}>
                <View>
                    <Text style={styles.screenTitle}>My Deliveries</Text>
                    <View style={styles.statsRow}>
                        <View style={styles.statBadge}>
                            <Ionicons name="bicycle" size={16} color={Colors.info} />
                            <Text style={styles.statText}>{activeOrders.length} Active</Text>
                        </View>
                        <View style={styles.statBadge}>
                            <Ionicons name="checkmark-done" size={16} color={Colors.success} />
                            <Text style={styles.statText}>{completedOrders.length} Done</Text>
                        </View>
                    </View>
                </View>
                <View style={{ paddingTop: 4 }}>
                    <NotificationBadge size={24} color={Colors.primary} />
                </View>
            </View>

            {/* Tabs */}
            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'active' && styles.tabActive]}
                    onPress={() => setActiveTab('active')}
                >
                    <Text style={[styles.tabText, activeTab === 'active' && styles.tabTextActive]}>
                        Active ({activeOrders.length})
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'completed' && styles.tabActive]}
                    onPress={() => setActiveTab('completed')}
                >
                    <Text style={[styles.tabText, activeTab === 'completed' && styles.tabTextActive]}>
                        Completed ({completedOrders.length})
                    </Text>
                </TouchableOpacity>
            </View>

            {filteredOrders.length === 0 ? (
                <View style={styles.center}>
                    <Ionicons
                        name={activeTab === 'active' ? 'bicycle-outline' : 'checkmark-done-outline'}
                        size={56}
                        color={Colors.textMuted}
                    />
                    <Text style={styles.emptyTitle}>
                        {activeTab === 'active' ? 'No active deliveries' : 'No completed deliveries'}
                    </Text>
                    <Text style={styles.emptySubtitle}>
                        {activeTab === 'active'
                            ? 'New delivery assignments will appear here'
                            : 'Your delivery history will show here'}
                    </Text>
                </View>
            ) : (
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 32 }}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                >
                    {filteredOrders.map((order) => {
                        const sc = getStatusConfig(order.status);
                        const isUpdating = updatingId === order.id;
                        const canUpdate = order.status.toLowerCase() === 'preparing' || order.status.toLowerCase() === 'picked_up' || order.status.toLowerCase() === 'delivering';
                        return (
                            <View key={order.id} style={styles.card}>
                                {/* Card header */}
                                <View style={styles.cardHeader}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.restaurantName}>{order.restaurant_name}</Text>
                                        <Text style={styles.orderId}>#{order.id}</Text>
                                    </View>
                                    <View style={[styles.statusBadge, { backgroundColor: sc.color + '18' }]}>
                                        <Ionicons name={sc.icon as any} size={14} color={sc.color} />
                                        <Text style={[styles.statusLabel, { color: sc.color }]}>{sc.label}</Text>
                                    </View>
                                </View>

                                {/* Delivery info */}
                                {order.delivery_address && (
                                    <View style={styles.infoRow}>
                                        <Ionicons name="location-outline" size={16} color={Colors.textMuted} />
                                        <Text style={styles.infoText} numberOfLines={2}>{order.delivery_address}</Text>
                                    </View>
                                )}
                                {order.phone && (
                                    <View style={styles.infoRow}>
                                        <Ionicons name="call-outline" size={16} color={Colors.textMuted} />
                                        <Text style={styles.infoText}>{order.phone}</Text>
                                    </View>
                                )}
                                {order.notes && (
                                    <View style={styles.infoRow}>
                                        <Ionicons name="chatbox-outline" size={16} color={Colors.textMuted} />
                                        <Text style={styles.infoText} numberOfLines={2}>{order.notes}</Text>
                                    </View>
                                )}

                                {/* Items summary */}
                                <View style={styles.itemsList}>
                                    {order.items.map((item, idx) => (
                                        <View key={idx} style={styles.itemRow}>
                                            <Text style={styles.itemQty}>{item.quantity}×</Text>
                                            <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                                        </View>
                                    ))}
                                </View>

                                {/* Footer with total + date */}
                                <View style={styles.footerRow}>
                                    <View>
                                        <Text style={styles.totalValue}>฿{order.total.toFixed(2)}</Text>
                                        <Text style={styles.dateText}>{formatDate(order.created_at)}</Text>
                                    </View>
                                </View>

                                {/* Action button */}
                                {sc.nextStatus && (
                                    <TouchableOpacity
                                        style={[styles.actionButton, (isUpdating || !canUpdate) && styles.actionButtonDisabled]}
                                        onPress={() => handleStatusUpdate(order.id, sc.nextStatus!)}
                                        disabled={isUpdating || !canUpdate}
                                    >
                                        {isUpdating ? (
                                            <ActivityIndicator size="small" color={Colors.white} />
                                        ) : (
                                            <>
                                                <Ionicons
                                                    name={sc.nextStatus === 'delivered' ? 'checkmark-done' : 'arrow-forward'}
                                                    size={18}
                                                    color={Colors.white}
                                                />
                                                <Text style={styles.actionButtonText}>{sc.nextLabel}</Text>
                                            </>
                                        )}
                                    </TouchableOpacity>
                                )}

                                {order.status.toLowerCase() === 'delivered' && (
                                    <View style={styles.completedBanner}>
                                        <Ionicons name="checkmark-circle" size={18} color={Colors.success} />
                                        <Text style={styles.completedText}>Delivery Completed</Text>
                                    </View>
                                )}
                            </View>
                        );
                    })}
                </ScrollView>
            )}
        </SafeAreaView>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: Spacing.sm,
    },
    headerSection: {
        paddingHorizontal: Spacing.lg,
        paddingTop: Spacing.md,
        paddingBottom: Spacing.sm,
    },
    screenTitle: {
        fontSize: FontSize.xl,
        fontWeight: '800',
        color: Colors.text,
    },
    statsRow: {
        flexDirection: 'row',
        gap: Spacing.sm,
        marginTop: Spacing.sm,
    },
    statBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: Colors.surface,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: BorderRadius.full,
        borderWidth: 1,
        borderColor: Colors.borderLight,
    },
    statText: {
        fontSize: FontSize.xs,
        fontWeight: '600',
        color: Colors.text,
    },

    tabContainer: {
        flexDirection: 'row',
        marginHorizontal: Spacing.lg,
        marginBottom: Spacing.sm,
        backgroundColor: Colors.surface,
        borderRadius: BorderRadius.md,
        padding: 4,
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 10,
        borderRadius: BorderRadius.sm,
    },
    tabActive: {
        backgroundColor: Colors.primary,
    },
    tabText: {
        fontSize: FontSize.sm,
        fontWeight: '600',
        color: Colors.textMuted,
    },
    tabTextActive: {
        color: Colors.white,
    },

    emptyTitle: {
        fontSize: FontSize.lg,
        fontWeight: '700',
        color: Colors.text,
        marginTop: Spacing.md,
    },
    emptySubtitle: {
        fontSize: FontSize.sm,
        color: Colors.textMuted,
        textAlign: 'center',
        paddingHorizontal: Spacing.xl,
    },

    card: {
        marginHorizontal: Spacing.lg,
        marginTop: Spacing.md,
        backgroundColor: Colors.surface,
        borderRadius: BorderRadius.lg,
        padding: Spacing.md,
        borderWidth: 1,
        borderColor: Colors.borderLight,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: Spacing.sm,
    },
    restaurantName: {
        fontSize: FontSize.md,
        fontWeight: '700',
        color: Colors.text,
    },
    orderId: {
        fontSize: FontSize.xs,
        color: Colors.textMuted,
        marginTop: 2,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: BorderRadius.full,
    },
    statusLabel: {
        fontSize: FontSize.xs,
        fontWeight: '600',
    },

    infoRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 8,
        marginBottom: 6,
        paddingLeft: 2,
    },
    infoText: {
        flex: 1,
        fontSize: FontSize.sm,
        color: Colors.textSecondary,
    },

    itemsList: {
        gap: 4,
        borderTopWidth: 1,
        borderTopColor: Colors.borderLight,
        paddingTop: Spacing.sm,
        marginTop: Spacing.xs,
    },
    itemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    itemQty: {
        fontSize: FontSize.sm,
        fontWeight: '600',
        color: Colors.textSecondary,
        width: 24,
    },
    itemName: {
        flex: 1,
        fontSize: FontSize.sm,
        color: Colors.text,
    },

    footerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: Colors.border,
        marginTop: Spacing.sm,
        paddingTop: Spacing.sm,
    },
    totalValue: {
        fontSize: FontSize.md,
        fontWeight: '800',
        color: Colors.accent,
    },
    dateText: {
        fontSize: FontSize.xs,
        color: Colors.textMuted,
        marginTop: 2,
    },

    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: Colors.primary,
        paddingVertical: 12,
        borderRadius: BorderRadius.md,
        marginTop: Spacing.md,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    actionButtonDisabled: {
        opacity: 0.6,
    },
    actionButtonText: {
        color: Colors.white,
        fontSize: FontSize.md,
        fontWeight: '700',
    },

    completedBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        marginTop: Spacing.md,
        paddingVertical: 8,
        borderTopWidth: 1,
        borderTopColor: Colors.borderLight,
    },
    completedText: {
        fontSize: FontSize.sm,
        fontWeight: '600',
        color: Colors.success,
    },
});
