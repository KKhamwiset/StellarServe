import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Image,
    SafeAreaView,
    Platform,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/theme';

// --- MOCK DATA ---
const MOCK_CART_ITEMS = [
    {
        id: '1',
        name: 'Stellar Burger',
        restaurant: 'Stellar Grill',
        price: 280,
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=200&auto=format&fit=crop',
        options: 'Medium Rare, No Onions'
    },
    {
        id: '2',
        name: 'Truffle Fries',
        restaurant: 'Stellar Grill',
        price: 150,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1534080564583-6be75777b70a?q=80&w=200&auto=format&fit=crop',
        options: 'Extra Truffle Mayo'
    },
    {
        id: '3',
        name: 'Midnight Shake',
        restaurant: 'Sweet Dreams',
        price: 120,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1572490122747-3968b75bb8fc?q=80&w=200&auto=format&fit=crop',
        options: 'Chocolate'
    }
];

export default function CartScreen() {
    const [cartItems, setCartItems] = useState(MOCK_CART_ITEMS);

    const updateQuantity = (id: string, delta: number) => {
        setCartItems(prev =>
            prev.map(item => {
                if (item.id === id) {
                    const newQuantity = Math.max(0, item.quantity + delta);
                    return { ...item, quantity: newQuantity };
                }
                return item;
            }).filter(item => item.quantity > 0)
        );
    };

    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = subtotal > 0 ? 50 : 0;
    const total = subtotal + deliveryFee;

    return (
        <SafeAreaView style={styles.container}>
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
                            {cartItems.map((item) => (
                                <View key={item.id} style={styles.cartItem}>
                                    <Image source={{ uri: item.image }} style={styles.itemImage} />
                                    <View style={styles.itemDetails}>
                                        <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                                        <Text style={styles.itemRestaurant} numberOfLines={1}>{item.restaurant}</Text>
                                        {item.options && (
                                            <Text style={styles.itemOptions} numberOfLines={1}>{item.options}</Text>
                                        )}
                                        <Text style={styles.itemPrice}>฿{item.price}</Text>
                                    </View>
                                    <View style={styles.quantityControl}>
                                        <TouchableOpacity
                                            style={styles.quantityButton}
                                            onPress={() => updateQuantity(item.id, -1)}
                                        >
                                            <Ionicons name="remove" size={16} color={Colors.primary} />
                                        </TouchableOpacity>
                                        <Text style={styles.quantityText}>{item.quantity}</Text>
                                        <TouchableOpacity
                                            style={styles.quantityButton}
                                            onPress={() => updateQuantity(item.id, 1)}
                                        >
                                            <Ionicons name="add" size={16} color={Colors.primary} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ))}
                        </View>

                        <View style={styles.summarySection}>
                            <Text style={styles.summaryTitle}>Order Summary</Text>
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
                        </View>
                    </>
                )}
            </ScrollView>

            {/* Sticky Checkout Footer */}
            {cartItems.length > 0 && (
                <View style={styles.footer}>
                    <TouchableOpacity style={styles.checkoutButton} activeOpacity={0.8}>
                        <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
                        <View style={styles.checkoutPriceTag}>
                            <Text style={styles.checkoutPriceText}>฿{total}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
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
