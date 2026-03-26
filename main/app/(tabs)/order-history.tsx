import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/theme';
import { getOrders, checkUserReview } from '@/services/api';
import { ReviewStat, Order } from '@/types/api';
import { ModalProps } from '@/components/ui/modal';

const STATUS_CONFIG: Record<string, { icon: string; color: string; label: string }> = {
    pending: { icon: 'time-outline', color: Colors.warning, label: 'Pending' },
    confirmed: { icon: 'checkmark-circle-outline', color: Colors.info, label: 'Confirmed' },
    preparing: { icon: 'flame-outline', color: '#F97316', label: 'Preparing' },
    picked_up: { icon: 'bag-check-outline', color: '#8B5CF6', label: 'Picked Up' },
    delivering: { icon: 'bicycle-outline', color: Colors.info, label: 'Delivering' },
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

export default function OrderHistoryScreen() {
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [reviewedOrder, setReviewedOrder] = useState<Record<string, boolean>>({});

    const load = async () => {
        try {
            const data = await getOrders();
            const uniqueOrder = [...new Set(data.map(order => order.id))];
            const reviewStatuses = await Promise.all(
                uniqueOrder.map(async (id) => {
                    try {
                        const res = await checkUserReview(id) as unknown as ReviewStat;
                        return { id, hasReviewed: res.has_reviewed };
                    } catch {
                        return { id, hasReviewed: false };
                    }
                })
            );

            const statusMap: Record<string, boolean> = {};
            reviewStatuses.forEach(status => {
                statusMap[status.id] = status.hasReviewed;
            });

            setReviewedOrder(statusMap);
            setOrders(data);
        } catch (e) {
            console.error('Failed to load orders:', e);
        } finally {
            setIsLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => { load(); }, []);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        load();
    }, []);

    /* ─── Loading ──────────────────────────────────────── */
    if (isLoading) {
        return (
            <SafeAreaView style={[styles.container, styles.center]} edges={['top']}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </SafeAreaView>
        );
    }

    /* ─── Empty ────────────────────────────────────────── */
    if (orders.length === 0) {
        return (
            <SafeAreaView style={[styles.container, styles.center]} edges={['top']}>
                <Ionicons name="receipt-outline" size={56} color={Colors.textMuted} />
                <Text style={styles.emptyTitle}>No orders yet</Text>
                <Text style={styles.emptySubtitle}>Your order history will appear here</Text>
            </SafeAreaView>
        );
    }

    /* ─── List ─────────────────────────────────────────── */
    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <Text style={styles.screenTitle}>Order History</Text>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 32 }}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            >
                {orders.map((order) => {
                    const sc = getStatusConfig(order.status);
                    return (
                        <View key={order.id} style={styles.card}>
                            <TouchableOpacity
                                onPress={() => setSelectedOrder(order)}>
                                {/* Card header */}
                                <View style={styles.cardHeader}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.restaurantName}>{order.restaurant_name}</Text>
                                        <Text style={styles.dateText}>{formatDate(order.created_at)}</Text>
                                    </View>
                                    <View style={[styles.statusBadge, { backgroundColor: sc.color + '18' }]}>
                                        <Ionicons name={sc.icon as any} size={14} color={sc.color} />
                                        <Text style={[styles.statusLabel, { color: sc.color }]}>{sc.label}</Text>
                                    </View>
                                </View>

                                {/* Items summary */}
                                <View style={styles.itemsList}>
                                    {order.items.map((item, idx) => (
                                        <View key={idx} style={styles.itemRow}>
                                            <Text style={styles.itemQty}>{item.quantity}×</Text>
                                            <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                                            <Text style={styles.itemPrice}>฿{item.subtotal.toFixed(2)}</Text>
                                        </View>
                                    ))}
                                </View>

                                {/* Total */}
                                <View style={styles.totalRow}>
                                    <Text style={styles.totalLabel}>Total</Text>
                                    <Text style={styles.totalValue}>฿{order.total.toFixed(2)}</Text>
                                </View>
                            </TouchableOpacity>
                            {order.status.toLowerCase() == "delivered" && (
                                !reviewedOrder[order.id] ? (
                                    <View style={styles.reviewButtonContainer}>
                                        <TouchableOpacity
                                            style={styles.reviewButton}
                                            onPress={() => router.push(`/restaurant/${order.restaurant_id}/createReview?order=${order.id}`)}
                                        >
                                            <Ionicons name="star" size={16} color={Colors.white} />
                                            <Text style={styles.reviewButtonText}>Write a Review</Text>
                                        </TouchableOpacity>
                                    </View>
                                ) : (
                                    <View style={styles.reviewButtonContainer}>
                                        <Ionicons name="checkmark-circle" size={18} color={Colors.yellow}></Ionicons>
                                        <Text style={styles.reviewButtonText}>You have already reviewed this order</Text>
                                    </View>
                                )
                            )}
                        </View>
                    )
                })}
            </ScrollView>

            {/* Order Detail Modal */}
            {selectedOrder && (() => {
                const sc = getStatusConfig(selectedOrder.status);
                return (
                    <ModalProps title="Order Details" onClose={() => setSelectedOrder(null)}>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            {/* Restaurant & Status */}
                            <Text style={styles.modalRestaurant}>{selectedOrder.restaurant_name}</Text>
                            <View style={[styles.statusBadge, { backgroundColor: sc.color + '18', alignSelf: 'flex-start', marginBottom: Spacing.sm }]}>
                                <Ionicons name={sc.icon as any} size={14} color={sc.color} />
                                <Text style={[styles.statusLabel, { color: sc.color }]}>{sc.label}</Text>
                            </View>

                            {/* Date */}
                            <View style={styles.modalRow}>
                                <Ionicons name="calendar-outline" size={15} color={Colors.textMuted} />
                                <Text style={styles.modalDetail}>{formatDate(selectedOrder.created_at)}</Text>
                            </View>

                            {/* Delivery Address */}
                            {selectedOrder.delivery_address && (
                                <View style={styles.modalRow}>
                                    <Ionicons name="location-outline" size={15} color={Colors.textMuted} />
                                    <Text style={styles.modalDetail}>{selectedOrder.delivery_address}</Text>
                                </View>
                            )}

                            {/* Phone */}
                            {selectedOrder.phone && (
                                <View style={styles.modalRow}>
                                    <Ionicons name="call-outline" size={15} color={Colors.textMuted} />
                                    <Text style={styles.modalDetail}>{selectedOrder.phone}</Text>
                                </View>
                            )}

                            {/* Notes */}
                            {selectedOrder.notes && (
                                <View style={styles.modalRow}>
                                    <Ionicons name="chatbox-outline" size={15} color={Colors.textMuted} />
                                    <Text style={styles.modalDetail}>{selectedOrder.notes}</Text>
                                </View>
                            )}

                            {/* Items */}
                            <View style={styles.modalDivider} />
                            <Text style={styles.modalSectionTitle}>Items</Text>
                            {selectedOrder.items.map((item, idx) => (
                                <View key={idx} style={styles.modalItemRow}>
                                    <Text style={styles.modalItemQty}>{item.quantity}×</Text>
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.modalItemName}>{item.name}</Text>
                                        <Text style={styles.modalItemUnit}>฿{item.price.toFixed(2)} each</Text>
                                    </View>
                                    <Text style={styles.modalItemSubtotal}>฿{item.subtotal.toFixed(2)}</Text>
                                </View>
                            ))}

                            {/* Rider Info */}
                            {selectedOrder.rider_name && (
                                <>
                                    <View style={styles.modalDivider} />
                                    <Text style={styles.modalSectionTitle}>Rider Info</Text>
                                    <View style={styles.modalRow}>
                                        <Ionicons name="bicycle-outline" size={15} color={Colors.textMuted} />
                                        <Text style={styles.modalDetail}>{selectedOrder.rider_name}</Text>
                                    </View>
                                    {selectedOrder.rider_phone && (
                                        <View style={styles.modalRow}>
                                            <Ionicons name="call-outline" size={15} color={Colors.textMuted} />
                                            <Text style={styles.modalDetail}>{selectedOrder.rider_phone}</Text>
                                        </View>
                                    )}
                                </>
                            )}

                            {/* Fee Breakdown & Total */}
                            <View style={styles.modalDivider} />
                            <View style={[styles.modalTotalRow, { borderTopWidth: 0, paddingVertical: 4 }]}>
                                <Text style={[styles.modalTotalLabel, { color: Colors.textSecondary, fontWeight: '500' }]}>Subtotal</Text>
                                <Text style={[styles.modalTotalValue, { fontSize: FontSize.md, color: Colors.text }]}>฿{(selectedOrder.total - (selectedOrder.delivery_fee || 0)).toFixed(2)}</Text>
                            </View>
                            <View style={[styles.modalTotalRow, { borderTopWidth: 0, paddingVertical: 4 }]}>
                                <Text style={[styles.modalTotalLabel, { color: Colors.textSecondary, fontWeight: '500' }]}>Delivery Fee</Text>
                                <Text style={[styles.modalTotalValue, { fontSize: FontSize.md, color: Colors.text }]}>฿{(selectedOrder.delivery_fee || 0).toFixed(2)}</Text>
                            </View>

                            <View style={styles.modalTotalRow}>
                                <Text style={styles.modalTotalLabel}>Total</Text>
                                <Text style={styles.modalTotalValue}>฿{selectedOrder.total.toFixed(2)}</Text>
                            </View>
                        </ScrollView>
                    </ModalProps>
                );
            })()}
        </SafeAreaView>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center',
        gap: Spacing.sm,
    },
    screenTitle: {
        fontSize: FontSize.xl,
        fontWeight: '800',
        color: Colors.text,
        paddingHorizontal: Spacing.lg,
        paddingTop: Spacing.md,
        paddingBottom: Spacing.sm,
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
    dateText: {
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

    itemsList: {
        gap: 4,
        borderTopWidth: 1,
        borderTopColor: Colors.borderLight,
        paddingTop: Spacing.sm,
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
    itemPrice: {
        fontSize: FontSize.sm,
        fontWeight: '600',
        color: Colors.text,
    },

    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderTopWidth: 1,
        borderTopColor: Colors.border,
        marginTop: Spacing.sm,
        paddingTop: Spacing.sm,
    },
    totalLabel: {
        fontSize: FontSize.md,
        fontWeight: '700',
        color: Colors.text,
    },
    totalValue: {
        fontSize: FontSize.md,
        fontWeight: '800',
        color: Colors.accent,
    },
    reviewButtonContainer: {
        flexDirection: "row",
        gap: 10,
        marginTop: Spacing.md,
        paddingTop: Spacing.sm,
        borderTopWidth: 1,
        borderTopColor: Colors.borderLight,
    },
    reviewButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        padding: Spacing.md,
        backgroundColor: Colors.yellow,
        paddingVertical: 10,
        borderRadius: BorderRadius.md,
    },
    reviewButtonText: {
        color: Colors.primary,
        fontSize: FontSize.sm,
        fontWeight: '700',
    },

    // Modal styles
    modalRestaurant: {
        fontSize: FontSize.xl,
        fontWeight: '800',
        color: Colors.text,
        marginBottom: 4,
    },
    modalRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 6,
    },
    modalDetail: {
        fontSize: FontSize.sm,
        color: Colors.textSecondary,
        flex: 1,
    },
    modalDivider: {
        height: 1,
        backgroundColor: Colors.border,
        marginVertical: Spacing.md,
    },
    modalSectionTitle: {
        fontSize: FontSize.md,
        fontWeight: '700',
        color: Colors.text,
        marginBottom: Spacing.sm,
    },
    modalItemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingVertical: 6,
    },
    modalItemQty: {
        fontSize: FontSize.sm,
        fontWeight: '700',
        color: Colors.primary,
        width: 28,
    },
    modalItemName: {
        fontSize: FontSize.sm,
        fontWeight: '600',
        color: Colors.text,
    },
    modalItemUnit: {
        fontSize: FontSize.xs,
        color: Colors.textMuted,
    },
    modalItemSubtotal: {
        fontSize: FontSize.sm,
        fontWeight: '700',
        color: Colors.text,
    },
    modalTotalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderTopWidth: 1,
        borderTopColor: Colors.border,
        marginTop: Spacing.sm,
        paddingTop: Spacing.md,
    },
    modalTotalLabel: {
        fontSize: FontSize.lg,
        fontWeight: '800',
        color: Colors.text,
    },
    modalTotalValue: {
        fontSize: FontSize.lg,
        fontWeight: '800',
        color: Colors.accent,
    },
});
