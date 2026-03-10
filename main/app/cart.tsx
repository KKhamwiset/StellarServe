import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    LayoutAnimation,
    UIManager,
    Image,
    Platform,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/theme';
import { getCart, addToCart, removeFromCart, createOrder, Cart } from '@/services/api';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function CartScreen() {
    const [cart, setCart] = useState<Cart | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

    const toggleGroup = useCallback((restaurantId: string) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpandedGroups(prev => {
            const next = new Set(prev);
            if (next.has(restaurantId)) {
                next.delete(restaurantId);
            } else {
                next.add(restaurantId);
            }
            return next;
        });
    }, []);

    useEffect(() => {
        loadCart();
    }, []);

    const loadCart = async () => {
        try {
            const data = await getCart();
            setCart(data);
        } catch (error) {
            console.error('Failed to load cart:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const updateQuantity = async (id: number, currentQty: number, delta: number) => {
        const item = cart?.items.find(i => i.id === id);
        if (!item) return;

        try {
            if (currentQty + delta <= 0) {
                const newData = await removeFromCart(id);
                setCart(newData);
            } else {
                const newData = await addToCart(item.menu_item_id, delta, item.restaurant_id);
                setCart(newData);
            }
        } catch (error) {
            console.error('Failed to update quantity:', error);
        }
    };

    const handleCheckout = (restaurantId: string) => {
        router.push({
            pathname: '/checkout',
            params: { restaurantId }
        });
    };

    const cartItems = cart?.items || [];

    const groupedItems = cartItems.reduce((acc, item) => {
        if (!acc[item.restaurant_id]) {
            acc[item.restaurant_id] = [];
        }
        acc[item.restaurant_id].push(item);
        return acc;
    }, {} as Record<string, typeof cartItems>);

    // Auto-expand all groups on first load
    useEffect(() => {
        const ids = Object.keys(groupedItems);
        if (ids.length > 0 && expandedGroups.size === 0) {
            setExpandedGroups(new Set(ids));
        }
    }, [cartItems.length]);

    if (isLoading) {
        return (
            <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]} edges={['top']}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Your Cart</Text>
                <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
                    <Ionicons name="close" size={24} color={Colors.text} />
                </TouchableOpacity>
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {cartItems.length === 0 ? (
                    <View style={styles.emptyCart}>
                        <Ionicons name="cart-outline" size={64} color={Colors.textMuted} />
                        <Text style={styles.emptyCartText}>Your cart is empty</Text>
                        <TouchableOpacity style={styles.browseButton} onPress={() => router.replace('/(tabs)')}>
                            <Text style={styles.browseButtonText}>Browse Restaurants</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <>
                        <View style={styles.itemList}>
                            {Object.entries(groupedItems).map(([restaurantId, items]) => {
                                const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                                const deliveryFee = 50;
                                const total = subtotal + deliveryFee;
                                const isExpanded = expandedGroups.has(restaurantId);
                                const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

                                return (
                                    <View key={restaurantId} style={styles.restaurantGroup}>
                                        <TouchableOpacity
                                            style={styles.groupHeaderRow}
                                            onPress={() => toggleGroup(restaurantId)}
                                            activeOpacity={0.7}
                                        >
                                            <View style={styles.groupHeaderLeft}>
                                                <Ionicons name="restaurant-outline" size={18} color={Colors.primary} />
                                                <Text style={styles.groupHeader}>Order from {restaurantId}</Text>
                                            </View>
                                            <View style={styles.groupHeaderRight}>
                                                <View style={styles.itemCountBadge}>
                                                    <Text style={styles.itemCountText}>{itemCount}</Text>
                                                </View>
                                                <Ionicons
                                                    name={isExpanded ? 'chevron-up' : 'chevron-down'}
                                                    size={20}
                                                    color={Colors.textMuted}
                                                />
                                            </View>
                                        </TouchableOpacity>

                                        {isExpanded && (
                                            <>
                                                {items.map((item) => (
                                                    <View key={item.id} style={styles.cartItem}>
                                                        <Image source={{ uri: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=200&auto=format&fit=crop' }} style={styles.itemImage} />
                                                        <View style={styles.itemDetails}>
                                                            <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                                                            <Text style={styles.itemPrice}>฿{item.price}</Text>
                                                        </View>
                                                        <View style={styles.quantityControl}>
                                                            <TouchableOpacity
                                                                style={styles.quantityButton}
                                                                onPress={() => updateQuantity(item.id, item.quantity, -1)}
                                                            >
                                                                <Ionicons name="remove" size={16} color={Colors.primary} />
                                                            </TouchableOpacity>
                                                            <Text style={styles.quantityText}>{item.quantity}</Text>
                                                            <TouchableOpacity
                                                                style={styles.quantityButton}
                                                                onPress={() => updateQuantity(item.id, item.quantity, 1)}
                                                            >
                                                                <Ionicons name="add" size={16} color={Colors.primary} />
                                                            </TouchableOpacity>
                                                        </View>
                                                    </View>
                                                ))}

                                                <View style={styles.summarySection}>
                                                    <View style={styles.summaryRow}>
                                                        <Text style={styles.summaryLabel}>Subtotal</Text>
                                                        <Text style={styles.summaryValue}>฿{subtotal}</Text>
                                                    </View>
                                                    <View style={styles.summaryRow}>
                                                        <Text style={styles.summaryLabel}>Delivery Fee</Text>
                                                        <Text style={styles.summaryValue}>฿{deliveryFee}</Text>
                                                    </View>
                                                    <View style={[styles.summaryRow, styles.totalRow]}>
                                                        <Text style={styles.totalLabel}>Total</Text>
                                                        <Text style={styles.totalValue}>฿{total}</Text>
                                                    </View>
                                                    <TouchableOpacity style={[styles.checkoutButton, { marginTop: Spacing.md }]} activeOpacity={0.8} onPress={() => handleCheckout(restaurantId)}>
                                                        <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
                                                        <View style={styles.checkoutPriceTag}>
                                                            <Text style={styles.checkoutPriceText}>฿{total}</Text>
                                                        </View>
                                                    </TouchableOpacity>
                                                </View>
                                            </>
                                        )}

                                        {!isExpanded && (
                                            <View style={styles.collapsedSummary}>
                                                <Text style={styles.collapsedSummaryText}>฿{total}</Text>
                                                <TouchableOpacity style={styles.collapsedCheckoutBtn} activeOpacity={0.8} onPress={() => handleCheckout(restaurantId)}>
                                                    <Text style={styles.collapsedCheckoutText}>Checkout</Text>
                                                </TouchableOpacity>
                                            </View>
                                        )}
                                    </View>
                                );
                            })}
                        </View>
                    </>
                )}
            </ScrollView>
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
        justifyContent: 'center',
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    headerTitle: {
        fontSize: FontSize.lg,
        fontWeight: 'bold',
        color: Colors.text,
    },
    closeButton: {
        position: 'absolute',
        right: Spacing.md,
        padding: Spacing.xs,
        backgroundColor: Colors.surface,
        borderRadius: BorderRadius.full,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: Spacing.xxl * 2,
    },
    emptyCart: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 100,
        paddingHorizontal: Spacing.xl,
    },
    emptyCartText: {
        fontSize: FontSize.lg,
        color: Colors.textMuted,
        marginTop: Spacing.md,
        marginBottom: Spacing.xl,
    },
    browseButton: {
        backgroundColor: Colors.primary,
        paddingHorizontal: Spacing.xl,
        paddingVertical: Spacing.md,
        borderRadius: BorderRadius.full,
    },
    browseButtonText: {
        color: Colors.white,
        fontWeight: 'bold',
        fontSize: FontSize.md,
    },
    itemList: {
        padding: Spacing.md,
    },
    restaurantGroup: {
        marginBottom: Spacing.xl,
        backgroundColor: Colors.surface,
        borderRadius: BorderRadius.xl,
        padding: Spacing.md,
        overflow: 'hidden',
    },
    groupHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: Spacing.xs,
        paddingHorizontal: Spacing.xs,
        marginBottom: Spacing.sm,
    },
    groupHeaderLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
        flex: 1,
    },
    groupHeaderRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
    },
    groupHeader: {
        fontSize: FontSize.md,
        fontWeight: 'bold',
        color: Colors.primary,
    },
    itemCountBadge: {
        backgroundColor: Colors.primary,
        borderRadius: 10,
        minWidth: 22,
        height: 22,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 6,
    },
    itemCountText: {
        fontSize: 11,
        fontWeight: 'bold',
        color: Colors.white,
    },
    collapsedSummary: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: Spacing.sm,
        borderTopWidth: 1,
        borderTopColor: Colors.border,
    },
    collapsedSummaryText: {
        fontSize: FontSize.md,
        fontWeight: 'bold',
        color: Colors.primary,
    },
    collapsedCheckoutBtn: {
        backgroundColor: Colors.primary,
        paddingHorizontal: Spacing.md,
        paddingVertical: 6,
        borderRadius: BorderRadius.full,
    },
    collapsedCheckoutText: {
        color: Colors.white,
        fontSize: FontSize.sm,
        fontWeight: 'bold',
    },
    cartItem: {
        flexDirection: 'row',
        backgroundColor: Colors.card,
        borderRadius: BorderRadius.lg,
        padding: Spacing.sm,
        marginBottom: Spacing.sm,
        borderWidth: 1,
        borderColor: Colors.border,
        alignItems: 'center',
    },
    itemImage: {
        width: 70,
        height: 70,
        borderRadius: BorderRadius.md,
        backgroundColor: Colors.surface,
    },
    itemDetails: {
        flex: 1,
        marginLeft: Spacing.md,
        justifyContent: 'center',
    },
    itemName: {
        fontSize: FontSize.md,
        fontWeight: 'bold',
        color: Colors.text,
    },
    itemRestaurant: {
        fontSize: FontSize.xs,
        color: Colors.textSecondary,
        marginTop: 2,
    },
    itemOptions: {
        fontSize: FontSize.xs,
        color: Colors.textMuted,
        marginTop: 2,
    },
    itemPrice: {
        fontSize: FontSize.md,
        fontWeight: 'bold',
        color: Colors.accent,
        marginTop: 4,
    },
    quantityControl: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.surface,
        borderRadius: BorderRadius.full,
        paddingHorizontal: 8,
        paddingVertical: 4,
        marginLeft: Spacing.sm,
    },
    quantityButton: {
        width: 24,
        height: 24,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.card,
        borderRadius: BorderRadius.full,
    },
    quantityText: {
        fontSize: FontSize.md,
        fontWeight: 'bold',
        color: Colors.text,
        marginHorizontal: 10,
    },
    summarySection: {
        padding: Spacing.lg,
        backgroundColor: Colors.surface,
        marginTop: Spacing.md,
    },
    summaryTitle: {
        fontSize: FontSize.md,
        fontWeight: 'bold',
        color: Colors.text,
        marginBottom: Spacing.md,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: Spacing.sm,
    },
    summaryLabel: {
        fontSize: FontSize.sm,
        color: Colors.textSecondary,
    },
    summaryValue: {
        fontSize: FontSize.sm,
        color: Colors.text,
        fontWeight: '500',
    },
    totalRow: {
        marginTop: Spacing.sm,
        paddingTop: Spacing.md,
        borderTopWidth: 1,
        borderTopColor: Colors.border,
    },
    totalLabel: {
        fontSize: FontSize.md,
        fontWeight: 'bold',
        color: Colors.text,
    },
    totalValue: {
        fontSize: FontSize.lg,
        fontWeight: 'bold',
        color: Colors.primary,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: Spacing.md,
        paddingBottom: Platform.OS === 'ios' ? 34 : Spacing.md,
        backgroundColor: Colors.card,
        borderTopWidth: 1,
        borderTopColor: Colors.border,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 10,
    },
    checkoutButton: {
        backgroundColor: Colors.primary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.lg,
        height: 56,
        borderRadius: BorderRadius.full,
    },
    checkoutButtonText: {
        color: Colors.white,
        fontSize: FontSize.md,
        fontWeight: 'bold',
    },
    checkoutPriceTag: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: Spacing.sm,
        paddingVertical: 4,
        borderRadius: BorderRadius.sm,
    },
    checkoutPriceText: {
        color: Colors.white,
        fontSize: FontSize.sm,
        fontWeight: 'bold',
    },
});
