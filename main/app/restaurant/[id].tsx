import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert, Image } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/theme';
import { getMenu, getCart, addToCart, removeFromCart, MenuItem, getRestaurant, Restaurant, Cart } from '@/services/api';

function StarRating({ count = 5 }: { count?: number }) {
    return (
        <View style={{ flexDirection: 'row', gap: 1 }}>
            {Array.from({ length: count }).map((_, i) => (
                <Ionicons key={i} name="star" size={12} color={Colors.star} />
            ))}
        </View>
    );
}

export default function RestaurantDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();

    const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [cart, setCart] = useState<Cart | null>(null);
    const [busyItems, setBusyItems] = useState<Set<string>>(new Set());

    useEffect(() => {
        loadData();
    }, [id]);

    const loadData = async () => {
        try {
            const [restData, menuData, cartData] = await Promise.all([
                getRestaurant(id),
                getMenu(id),
                getCart().catch(() => null),
            ]);
            setRestaurant(restData);
            setMenuItems(menuData);
            setCart(cartData);
        } catch (error) {
            console.error('Failed to load restaurant data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const getItemQuantity = (menuItemId: string): number => {
        if (!cart) return 0;
        const cartItem = cart.items.find(i => i.menu_item_id === menuItemId && i.restaurant_id === id);
        return cartItem ? cartItem.quantity : 0;
    };

    const getCartItemId = (menuItemId: string): number | null => {
        if (!cart) return null;
        const cartItem = cart.items.find(i => i.menu_item_id === menuItemId && i.restaurant_id === id);
        return cartItem ? cartItem.id : null;
    };

    const handleIncrement = async (menuItemId: string) => {
        if (busyItems.has(menuItemId)) return;
        setBusyItems(prev => new Set(prev).add(menuItemId));
        try {
            const updatedCart = await addToCart(menuItemId, 1, id);
            setCart(updatedCart);
        } catch (error) {
            console.error('Failed to add to cart:', error);
            Alert.alert("Error", "Could not update cart");
        } finally {
            setBusyItems(prev => { const n = new Set(prev); n.delete(menuItemId); return n; });
        }
    };

    const handleDecrement = async (menuItemId: string) => {
        const cartItemId = getCartItemId(menuItemId);
        if (!cartItemId || busyItems.has(menuItemId)) return;
        setBusyItems(prev => new Set(prev).add(menuItemId));
        try {
            const currentQty = getItemQuantity(menuItemId);
            if (currentQty <= 1) {
                const updatedCart = await removeFromCart(cartItemId);
                setCart(updatedCart);
            } else {
                const updatedCart = await addToCart(menuItemId, -1, id);
                setCart(updatedCart);
            }
        } catch (error) {
            console.error('Failed to update cart:', error);
            Alert.alert("Error", "Could not update cart");
        } finally {
            setBusyItems(prev => { const n = new Set(prev); n.delete(menuItemId); return n; });
        }
    };

    if (isLoading) {
        return (
            <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]} edges={['top']}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </SafeAreaView>
        );
    }

    const totalCartItems = cart?.items.filter(i => i.restaurant_id === id).reduce((s, i) => s + i.quantity, 0) || 0;

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Text style={styles.backText}>◀ Back</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{restaurant?.name || 'Restaurant'}</Text>
                <TouchableOpacity onPress={() => router.push("/cart")}>
                    <View>
                        <Ionicons name="cart-outline" size={24} color={Colors.primary} />
                        {totalCartItems > 0 && (
                            <View style={styles.cartBadge}>
                                <Text style={styles.cartBadgeText}>{totalCartItems}</Text>
                            </View>
                        )}
                    </View>
                </TouchableOpacity>
            </View>

            {/* Menu List */}
            <ScrollView showsVerticalScrollIndicator={false}>
                {menuItems.map((item) => {
                    const qty = getItemQuantity(item.id);
                    const isBusy = busyItems.has(item.id);

                    return (
                        <View key={item.id} style={styles.menuCard}>
                            <View style={styles.menuImage}>
                                {item.image_url ? (
                                    <Image source={{ uri: item.image_url }} style={{ width: '100%', height: '100%', borderRadius: BorderRadius.lg }} />
                                ) : (
                                    <Ionicons name="fast-food-outline" size={28} color={Colors.textMuted} />
                                )}
                            </View>
                            <View style={styles.menuInfo}>
                                <StarRating count={5} />
                                <Text style={styles.menuName}>{item.name}</Text>
                                <Text style={styles.menuPrice}>Price : {item.price} Baht</Text>
                            </View>
                            <View style={styles.menuActions}>
                                {qty === 0 ? (
                                    <TouchableOpacity
                                        style={[styles.addToCartBtn, isBusy && { opacity: 0.5 }]}
                                        activeOpacity={0.7}
                                        onPress={() => handleIncrement(item.id)}
                                        disabled={isBusy}
                                    >
                                        <Text style={styles.addToCartText}>Add to cart</Text>
                                    </TouchableOpacity>
                                ) : (
                                    <View style={styles.stepperContainer}>
                                        <TouchableOpacity
                                            style={styles.stepperButton}
                                            onPress={() => handleDecrement(item.id)}
                                            disabled={isBusy}
                                        >
                                            <Ionicons name="remove" size={16} color={Colors.primary} />
                                        </TouchableOpacity>
                                        <Text style={styles.stepperText}>{qty}</Text>
                                        <TouchableOpacity
                                            style={styles.stepperButton}
                                            onPress={() => handleIncrement(item.id)}
                                            disabled={isBusy}
                                        >
                                            <Ionicons name="add" size={16} color={Colors.primary} />
                                        </TouchableOpacity>
                                    </View>
                                )}
                            </View>
                        </View>
                    );
                })}
                <View style={{ height: 100 }} />
            </ScrollView>

            {/* Proceed to Order Button */}
            <View style={styles.bottomBar}>
                <TouchableOpacity style={styles.proceedButton} activeOpacity={0.7} onPress={() => router.push("/cart")}>
                    <Text style={styles.proceedText}>Proceed to order</Text>
                </TouchableOpacity>
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
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.md,
    },
    backText: {
        fontSize: FontSize.md,
        color: Colors.text,
        fontWeight: '500',
    },
    headerTitle: {
        fontSize: FontSize.lg,
        fontWeight: '700',
        color: Colors.text,
    },
    cartBadge: {
        position: 'absolute',
        top: -6,
        right: -8,
        backgroundColor: Colors.accent,
        borderRadius: 10,
        width: 18,
        height: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cartBadgeText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: Colors.primary,
    },
    menuCard: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: Colors.borderLight,
    },
    menuImage: {
        width: 72,
        height: 72,
        borderRadius: BorderRadius.lg,
        backgroundColor: Colors.card,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.border,
    },
    menuInfo: {
        flex: 1,
        paddingHorizontal: Spacing.md,
        gap: 2,
    },
    menuName: {
        fontSize: FontSize.md,
        fontWeight: '700',
        color: Colors.text,
    },
    menuPrice: {
        fontSize: FontSize.sm,
        color: Colors.textSecondary,
    },
    menuActions: {
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    addToCartBtn: {
        borderWidth: 1.5,
        borderColor: Colors.primary,
        borderRadius: BorderRadius.full,
        paddingHorizontal: Spacing.md,
        paddingVertical: 5,
    },
    addToCartText: {
        fontSize: FontSize.xs,
        fontWeight: '600',
        color: Colors.primary,
    },
    stepperContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.surface,
        borderRadius: BorderRadius.full,
        borderWidth: 1.5,
        borderColor: Colors.primary,
        paddingHorizontal: 4,
        paddingVertical: 2,
    },
    stepperButton: {
        width: 28,
        height: 28,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.card,
        borderRadius: BorderRadius.full,
    },
    stepperText: {
        fontSize: FontSize.md,
        fontWeight: 'bold',
        color: Colors.text,
        marginHorizontal: 12,
        minWidth: 16,
        textAlign: 'center',
    },
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.md,
        paddingBottom: Spacing.xl,
        backgroundColor: Colors.background,
    },
    proceedButton: {
        backgroundColor: Colors.primary,
        borderRadius: BorderRadius.full,
        paddingVertical: Spacing.md,
        alignItems: 'center',
    },
    proceedText: {
        fontSize: FontSize.lg,
        fontWeight: '700',
        color: Colors.accent,
    },
});
