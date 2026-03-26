import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/theme';
import { getSellerOrders, updateOrderStatus } from '@/services/api';
import { Order } from '@/types/api';
import { ModalProps } from '@/components/ui/modal';
import { SuccessModal } from '@/components/ui/success-modal';

const STATUS_CONFIG: Record<string, { icon: string; color: string; label: string }> = {
    pending: { icon: 'time-outline', color: Colors.warning, label: 'Pending' },
    confirmed: { icon: 'checkmark-circle-outline', color: Colors.info, label: 'Confirmed' },
    preparing: { icon: 'flame-outline', color: '#F97316', label: 'Preparing' },
    picked_up: { icon: 'bag-check-outline', color: '#8B5CF6', label: 'Picked Up' },
    delivering: { icon: 'bicycle-outline', color: Colors.info, label: 'Delivering' },
    delivered: { icon: 'checkmark-done-outline', color: Colors.success, label: 'Delivered' },
    cancelled: { icon: 'close-circle-outline', color: Colors.error, label: 'Cancelled' },
};

const STATUS_FLOW = ['pending', 'confirmed', 'preparing', 'picked_up', 'delivering', 'delivered'];

function getStatusConfig(status: string) {
    return STATUS_CONFIG[status.toLowerCase()] ?? { icon: 'help-outline', color: Colors.textMuted, label: status };
}

function formatDate(iso: string) {
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        + ' · '
        + d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
}

export default function SellerOrdersScreen() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [updatingStatus, setUpdatingStatus] = useState(false);
    const [successModalVisible, setSuccessModalVisible] = useState(false);
    const [successModalConfig, setSuccessModalConfig] = useState({ title: '', message: '' });

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

    const handleStatusUpdate = async (orderId: string, newStatus: string) => {
        setUpdatingStatus(true);
        try {
            const updated = await updateOrderStatus(orderId, newStatus);
            setOrders(prev => prev.map(o => o.id === orderId ? updated : o));
            setSelectedOrder(updated);
            
            const sc = getStatusConfig(newStatus);
            if (newStatus === 'cancelled') {
                setSuccessModalConfig({ title: 'Order Cancelled', message: 'The order has been cancelled successfully.' });
            } else {
                setSuccessModalConfig({ title: 'Status Updated', message: `Order status changed to ${sc.label}.` });
            }
            setSuccessModalVisible(true);
        } catch (error) {
            console.error('Failed to update status:', error);
            Alert.alert('Error', 'Failed to update order status');
        } finally {
            setUpdatingStatus(false);
        }
    };

    const handleCancel = (orderId: string) => {
        Alert.alert('Cancel Order', 'Are you sure you want to cancel this order?', [
            { text: 'No', style: 'cancel' },
            {
                text: 'Yes, Cancel',
                style: 'destructive',
                onPress: () => handleStatusUpdate(orderId, 'cancelled'),
            },
        ]);
    };

    const renderOrder = ({ item }: { item: Order }) => {
        const sc = getStatusConfig(item.status);
        const date = new Date(item.created_at);
        const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const dateStr = date.toLocaleDateString();

        return (
            <TouchableOpacity
                style={styles.orderCard}
                activeOpacity={0.7}
                onPress={() => setSelectedOrder(item)}
            >
                {/* Order header */}
                <View style={styles.orderHeader}>
                    <View>
                        <Text style={styles.orderId}>#{item.id.slice(-6).toUpperCase()}</Text>
                        <Text style={styles.orderDate}>{dateStr} • {timeStr}</Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: sc.color + '20' }]}>
                        <View style={[styles.statusDot, { backgroundColor: sc.color }]} />
                        <Text style={[styles.statusText, { color: sc.color }]}>{sc.label}</Text>
                    </View>
                </View>
                <View>
                    <Text>
                        {item.customer_name}
                    </Text>
                </View>

                {/* Order items */}

                <View style={styles.orderItems}>
                    {item.items.map((orderItem, i) => (
                        <View key={i} style={styles.orderItemRow}>
                            <Text style={styles.orderItemQty}>{orderItem.quantity}×</Text>
                            <Text style={styles.orderItemName} numberOfLines={1}>{orderItem.name}</Text>
                            <Text style={styles.orderItemPrice}>฿{orderItem.subtotal.toFixed(2)}</Text>
                        </View>
                    ))}
                </View>

                {/* Order total */}
                <View style={styles.orderFooter}>
                    <Text style={styles.totalLabel}>Total</Text>
                    <Text style={styles.totalPrice}>฿{item.total.toFixed(2)}</Text>
                </View>
            </TouchableOpacity>
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

            {/* Order Detail Modal */}
            {selectedOrder && (() => {
                const sc = getStatusConfig(selectedOrder.status);
                const currentIdx = STATUS_FLOW.indexOf(selectedOrder.status.toLowerCase());
                const nextStatus = currentIdx >= 0 && currentIdx < STATUS_FLOW.length - 1
                    ? STATUS_FLOW[currentIdx + 1]
                    : null;
                const isCancelled = selectedOrder.status.toLowerCase() === 'cancelled';
                const isDelivered = selectedOrder.status.toLowerCase() === 'delivered';

                return (
                    <ModalProps title="Order Details" onClose={() => setSelectedOrder(null)}>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            {/* Order ID & Status */}
                            <Text style={styles.modalOrderId}>
                                #{selectedOrder.id.slice(-6).toUpperCase()}
                            </Text>
                            <View style={[styles.statusBadge, { backgroundColor: sc.color + '18', alignSelf: 'flex-start', marginBottom: Spacing.sm }]}>
                                <Ionicons name={sc.icon as any} size={14} color={sc.color} />
                                <Text style={[styles.statusText, { color: sc.color }]}>{sc.label}</Text>
                            </View>

                            {/* Date */}
                            <View style={styles.modalRow}>
                                <Ionicons name="calendar-outline" size={15} color={Colors.textMuted} />
                                <Text style={styles.modalDetail}>{formatDate(selectedOrder.created_at)}</Text>
                            </View>

                            {/* Delivery Address */}
                            <View style={styles.modalRow}>
                                <Text style={styles.modalDetail}>{selectedOrder.customer_name}</Text>
                            </View>
                            {selectedOrder.delivery_address ? (
                                <View style={styles.modalRow}>
                                    <Ionicons name="location-outline" size={15} color={Colors.textMuted} />
                                    <Text style={styles.modalDetail}>{selectedOrder.delivery_address}</Text>
                                </View>
                            ) : null}

                            {/* Phone */}
                            {selectedOrder.phone ? (
                                <View style={styles.modalRow}>
                                    <Ionicons name="call-outline" size={15} color={Colors.textMuted} />
                                    <Text style={styles.modalDetail}>{selectedOrder.phone}</Text>
                                </View>
                            ) : null}

                            {/* Notes */}
                            {selectedOrder.notes ? (
                                <View style={styles.modalRow}>
                                    <Ionicons name="chatbox-outline" size={15} color={Colors.textMuted} />
                                    <Text style={styles.modalDetail}>{selectedOrder.notes}</Text>
                                </View>
                            ) : null}

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

                            {/* Total */}
                            <View style={styles.modalTotalRow}>
                                <Text style={styles.modalTotalLabel}>Total</Text>
                                <Text style={styles.modalTotalValue}>฿{selectedOrder.total.toFixed(2)}</Text>
                            </View>

                            {/* Status Update Buttons */}
                            {!isCancelled && !isDelivered && (
                                <View style={styles.statusActions}>
                                    <Text style={styles.modalSectionTitle}>Update Status</Text>

                                    {/* Progress buttons */}
                                    {STATUS_FLOW.map((s) => {
                                        const cfg = getStatusConfig(s);
                                        const sIdx = STATUS_FLOW.indexOf(s);
                                        const isActive = s === selectedOrder.status.toLowerCase();
                                        const isPast = sIdx < currentIdx;
                                        const isNext = s === nextStatus;

                                        return (
                                            <TouchableOpacity
                                                key={s}
                                                style={[
                                                    styles.statusOption,
                                                    isActive && { backgroundColor: cfg.color + '18', borderColor: cfg.color },
                                                    isPast && { opacity: 0.4 },
                                                ]}
                                                disabled={updatingStatus || isPast || isActive}
                                                activeOpacity={0.7}
                                                onPress={() => handleStatusUpdate(selectedOrder.id, s)}
                                            >
                                                <Ionicons name={cfg.icon as any} size={18} color={isActive ? cfg.color : Colors.textSecondary} />
                                                <Text style={[
                                                    styles.statusOptionText,
                                                    isActive && { color: cfg.color, fontWeight: '700' },
                                                ]}>
                                                    {cfg.label}
                                                </Text>
                                                {isNext && (
                                                    <View style={styles.nextBadge}>
                                                        <Text style={styles.nextBadgeText}>Next</Text>
                                                    </View>
                                                )}
                                                {isActive && (
                                                    <Ionicons name="checkmark-circle" size={18} color={cfg.color} style={{ marginLeft: 'auto' }} />
                                                )}
                                            </TouchableOpacity>
                                        );
                                    })}

                                    {/* Cancel button */}
                                    <TouchableOpacity
                                        style={styles.cancelButton}
                                        activeOpacity={0.7}
                                        onPress={() => handleCancel(selectedOrder.id)}
                                        disabled={updatingStatus}
                                    >
                                        <Ionicons name="close-circle-outline" size={18} color={Colors.error} />
                                        <Text style={styles.cancelButtonText}>Cancel Order</Text>
                                    </TouchableOpacity>
                                </View>
                            )}

                            {isCancelled && (
                                <View style={styles.cancelledBanner}>
                                    <Ionicons name="close-circle" size={20} color={Colors.error} />
                                    <Text style={styles.cancelledText}>This order has been cancelled</Text>
                                </View>
                            )}

                            {isDelivered && (
                                <View style={styles.deliveredBanner}>
                                    <Ionicons name="checkmark-done-circle" size={20} color={Colors.success} />
                                    <Text style={styles.deliveredText}>This order has been delivered</Text>
                                </View>
                            )}
                        </ScrollView>
                    </ModalProps>
                );
            })()}

            <SuccessModal
                visible={successModalVisible}
                title={successModalConfig.title}
                message={successModalConfig.message}
                onClose={() => setSuccessModalVisible(false)}
            />
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

    // Modal styles
    modalOrderId: {
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

    // Status update styles
    statusActions: {
        marginTop: Spacing.lg,
        borderTopWidth: 1,
        borderTopColor: Colors.border,
        paddingTop: Spacing.md,
    },
    statusOption: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
        paddingVertical: Spacing.sm,
        paddingHorizontal: Spacing.md,
        borderRadius: BorderRadius.md,
        borderWidth: 1,
        borderColor: Colors.borderLight,
        marginBottom: Spacing.xs,
    },
    statusOptionText: {
        fontSize: FontSize.sm,
        color: Colors.textSecondary,
        fontWeight: '500',
    },
    nextBadge: {
        backgroundColor: Colors.accent,
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: BorderRadius.sm,
        marginLeft: 'auto',
    },
    nextBadgeText: {
        fontSize: 10,
        fontWeight: '700',
        color: Colors.primary,
    },
    cancelButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: Spacing.sm,
        paddingVertical: Spacing.sm,
        marginTop: Spacing.sm,
        borderRadius: BorderRadius.md,
        borderWidth: 1,
        borderColor: Colors.error + '40',
        backgroundColor: Colors.error + '08',
    },
    cancelButtonText: {
        fontSize: FontSize.sm,
        fontWeight: '600',
        color: Colors.error,
    },
    cancelledBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
        marginTop: Spacing.lg,
        padding: Spacing.md,
        borderRadius: BorderRadius.md,
        backgroundColor: Colors.error + '10',
    },
    cancelledText: {
        fontSize: FontSize.sm,
        fontWeight: '600',
        color: Colors.error,
    },
    deliveredBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
        marginTop: Spacing.lg,
        padding: Spacing.md,
        borderRadius: BorderRadius.md,
        backgroundColor: Colors.success + '10',
    },
    deliveredText: {
        fontSize: FontSize.sm,
        fontWeight: '600',
        color: Colors.success,
    },
});
