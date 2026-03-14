import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert, Image } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/theme';

import { Cart, MenuItem, Restaurant, Reviews } from '@/types/api';

import {
    getMenu, getCart, addToCart, removeFromCart,
    getRestaurant, getReviews, toggleFavorite as setFavorite, getFavorite, removeFavorite
} from '@/services/api';

import { StarRating } from '@/components/ui/StarRating';

import { RestaurantHeader } from '@/components/restaurant/RestaurantHeader';
import { RestaurantBanner } from '@/components/restaurant/RestaurantBanner';
import { MenuItemCard } from '@/components/restaurant/MenuItemCard';
import { BottomOrderBar } from '@/components/restaurant/BottomOrderBar';
import { API_BASE_URL, API_ENDPOINTS } from '@/constants/api';

export default function RestaurantDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();

    const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [cart, setCart] = useState<Cart | null>(null);
    const [busyItems, setBusyItems] = useState<Set<string>>(new Set());
    const [reviews, setReviews] = useState<Reviews[] | null>(null);
    const [isFavorite, setIsFavorite] = useState(false);
    const [favoriteId, setFavoriteId] = useState<number | null>(null);

    useEffect(() => {
        loadData();
    }, [id]);

    const loadData = async () => {
        try {
            const [restData, menuData, cartData, reviewsData, favoriteData] = await Promise.all([
                getRestaurant(id),
                getMenu(id),
                getCart().catch(() => null),
                getReviews(id),
                getFavorite(id).catch(() => null)
            ]);
            setRestaurant(restData);
            setMenuItems(menuData);
            setCart(cartData);
            setReviews(reviewsData);
            setIsFavorite(!!favoriteData);
            setFavoriteId(favoriteData?.id || null);
        } catch (error) {
            console.error('Failed to load restaurant data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleToggleFavorite = async () => {
        if (isFavorite) {
            await removeFavorite(favoriteId);
            setIsFavorite(false);
            setFavoriteId(null);
        } else {
            const newFavorite = await setFavorite(id);
            setIsFavorite(true);
            setFavoriteId(newFavorite.id);
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
            <RestaurantHeader
                title={restaurant?.name || 'Restaurant'}
                totalCartItems={totalCartItems}
                isFavorite={isFavorite}
                onBack={() => router.back()}
                onCart={() => router.push("/cart")}
                onToggleFavorite={handleToggleFavorite}
            />

            <ScrollView showsVerticalScrollIndicator={false}>
                {restaurant && (
                    <RestaurantBanner
                        restaurant={restaurant}
                        reviews={reviews}
                        onViewReviews={() => router.push(`/restaurant/${id}/reviews`)}
                    />
                )}

                <View style={styles.menuSectionHeader}>
                    <Text style={styles.menuSectionTitle}>Menu</Text>
                    <Text style={styles.menuSectionCount}>{menuItems.length} items</Text>
                </View>

                {menuItems.map((item) => (
                    <MenuItemCard
                        key={item.id}
                        item={item}
                        quantity={getItemQuantity(item.id)}
                        isBusy={busyItems.has(item.id)}
                        onIncrement={handleIncrement}
                        onDecrement={handleDecrement}
                    />
                ))}

                <View style={{ height: 100 }} />
            </ScrollView>

            <BottomOrderBar
                onProceed={() => router.push("/cart")}
                totalItems={totalCartItems}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    menuSectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: Spacing.lg,
        paddingTop: Spacing.lg,
        paddingBottom: Spacing.sm,
    },
    menuSectionTitle: {
        fontSize: FontSize.xl,
        fontWeight: '800',
        color: Colors.text,
    },
    menuSectionCount: {
        fontSize: FontSize.sm,
        color: Colors.textMuted,
    },
});

