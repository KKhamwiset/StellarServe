import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert, Image } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/theme';
import { getMenu, addToCart, MenuItem, getRestaurant, Restaurant } from '@/services/api';

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
    const [isAdding, setIsAdding] = useState(false);

    useEffect(() => {
        loadData();
    }, [id]);

    const loadData = async () => {
        try {
            const [restData, menuData] = await Promise.all([
                getRestaurant(id),
                getMenu(id)
            ]);
            setRestaurant(restData);
            setMenuItems(menuData);
        } catch (error) {
            console.error('Failed to load restaurant data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddToCart = async (menuItemId: string, restaurant_id: string) => {
        if (isAdding) return;
        console.log("Addding item id : " + menuItemId + " rest_id : " + restaurant_id)
        setIsAdding(true);
        try {
            await addToCart(menuItemId, 1, restaurant_id);
            Alert.alert("Success", "Added to cart!");
        } catch (error) {
            console.error('Failed to add to cart:', error);
            Alert.alert("Error", "Could not add to cart");
        } finally {
            setIsAdding(false);
        }
    };

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
                <TouchableOpacity onPress={() => router.back()}>
                    <Text style={styles.backText}>◀ Back</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{restaurant?.name || 'Restaurant'}</Text>
                <TouchableOpacity>
                    <Ionicons
                        name="cart-outline" size={24} color={Colors.primary}
                        onPress={() => { router.push("/cart") }} />
                </TouchableOpacity>
            </View>

            {/* Menu List */}
            <ScrollView showsVerticalScrollIndicator={false}>
                {menuItems.map((item) => (
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
                            <TouchableOpacity style={styles.addToCartBtn} activeOpacity={0.7} onPress={() => handleAddToCart(item.id, id)}>
                                <Text style={styles.addToCartText}>Add to cart</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.orderNowBtn} activeOpacity={0.7}>
                                <Text style={styles.orderNowText}>Order now</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ))}
                <View style={{ height: 100 }} />
            </ScrollView>

            {/* Proceed to Order Button */}
            <View style={styles.bottomBar}>
                <TouchableOpacity style={styles.proceedButton} activeOpacity={0.7}>
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
        gap: Spacing.xs,
        alignItems: 'flex-end',
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
    orderNowBtn: {
        backgroundColor: Colors.accent,
        borderRadius: BorderRadius.full,
        paddingHorizontal: Spacing.md,
        paddingVertical: 5,
    },
    orderNowText: {
        fontSize: FontSize.xs,
        fontWeight: '600',
        color: Colors.primary,
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
