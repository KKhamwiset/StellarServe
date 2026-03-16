import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/theme';
import { MenuModal } from '@/components/ui/menu-modal';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL, API_ENDPOINTS } from '@/constants/api';
import { getMenu } from '@/services/api';
import { MenuItem } from '@/types/api'

export default function MenuManagerScreen() {
    const [modalVisible, setModalVisible] = useState(false);
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [restaurantId, setRestaurantId] = useState<string | null>(null);
    const [menuState, setMenuState] = useState("Add")
    const [loading, setLoading] = useState(false);
    const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);

    useEffect(() => {
        const fetchMyRestaurant = async () => {
            try {
                const token = await AsyncStorage.getItem('userToken');
                const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.restaurants}/mine`, {
                    headers: { 'Authorization': `Bearer ${token}` },
                });
                if (res.ok) {
                    const data = await res.json();
                    setRestaurantId(data.id);
                }
            } catch (error) {
                console.error('Failed to fetch restaurant:', error);
            }
        };
        fetchMyRestaurant();
    }, []);

    const loadMenu = async () => {
        if (!restaurantId) return;
        try {
            const items = await getMenu(restaurantId);
            setMenuItems(items);
        } catch (error) {
            console.error('Failed to load menu:', error);
        }
    };
    useEffect(() => {
        loadMenu();
    }, [restaurantId]);

    const renderMenuItem = ({ item }: { item: MenuItem }) => (
        <TouchableOpacity onPress={() => {
            setModalVisible(true);
            setSelectedMenuItem(item);
            setMenuState("Edit");
        }}>
            <View style={styles.menuCard}>
                <View style={styles.menuItemImageContainer}>
                    {item.image_url ? (
                        <Image source={{ uri: item.image_url }} style={styles.menuItemImage} />
                    ) : (
                        <Ionicons name="fast-food-outline" size={24} color={Colors.textMuted} />
                    )}
                </View>
                <View style={styles.menuCardInfo}>
                    <Text style={styles.menuCardName}>{item.name}</Text>
                    {item.description ? (
                        <Text style={styles.menuCardDesc} numberOfLines={2}>{item.description}</Text>
                    ) : null}
                    <View style={styles.menuCardMeta}>
                        <Text style={styles.menuCardPrice}>${item.price.toFixed(2)}</Text>
                        {item.category ? (
                            <View style={styles.categoryBadge}>
                                <Text style={styles.categoryBadgeText}>{item.category}</Text>
                            </View>
                        ) : null}
                    </View>
                </View>
                <View style={[styles.availabilityDot, { backgroundColor: item.is_available ? Colors.success : Colors.error }]} />
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Menu Manager</Text>
                <TouchableOpacity
                    style={styles.addButton}
                    activeOpacity={0.7}
                    onPress={() => {
                        setModalVisible(true);
                        setSelectedMenuItem(null);
                        setMenuState("Add");
                    }}
                >
                    <Ionicons name="add" size={22} color={Colors.white} />
                    <Text style={styles.addButtonText}>Add Menu</Text>
                </TouchableOpacity>
            </View>

            {menuItems.length === 0 ? (
                <View style={styles.emptyState}>
                    <Ionicons name="restaurant-outline" size={64} color={Colors.textMuted} />
                    <Text style={styles.emptyTitle}>No menu items yet</Text>
                    <Text style={styles.emptyText}>
                        Start adding items to your menu so customers can order from your restaurant.
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={menuItems}
                    keyExtractor={(item) => item.id}
                    renderItem={renderMenuItem}
                    contentContainerStyle={{ padding: Spacing.lg, gap: Spacing.sm }}
                    showsVerticalScrollIndicator={false}
                />
            )}

            {modalVisible && (
                <MenuModal
                    title={`${menuState} menu`}
                    action={`${menuState}`}
                    loadMenu={loadMenu}
                    menu_data={selectedMenuItem}
                    restaurantID={restaurantId}
                    onClose={() => setModalVisible(false)}
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
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: Colors.primary,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        borderRadius: BorderRadius.full,
    },
    addButtonText: {
        color: Colors.white,
        fontSize: FontSize.sm,
        fontWeight: 'bold',
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
    // Menu item cards
    menuCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.card,
        borderRadius: BorderRadius.lg,
        padding: Spacing.md,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    menuCardInfo: {
        flex: 1,
        gap: 4,
    },
    menuCardName: {
        fontSize: FontSize.md,
        fontWeight: '700',
        color: Colors.text,
    },
    menuCardDesc: {
        fontSize: FontSize.xs,
        color: Colors.textSecondary,
    },
    menuItemImageContainer: {
        width: 60,
        height: 60,
        borderRadius: BorderRadius.md,
        backgroundColor: Colors.surface,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: Colors.border,
    },
    menuItemImage: {
        width: '100%',
        height: '100%',
    },
    menuCardMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
        marginTop: 4,
    },
    menuCardPrice: {
        fontSize: FontSize.md,
        fontWeight: '700',
        color: Colors.primary,
    },
    categoryBadge: {
        backgroundColor: Colors.surfaceLight,
        paddingHorizontal: Spacing.sm,
        paddingVertical: 2,
        borderRadius: BorderRadius.sm,
    },
    categoryBadgeText: {
        fontSize: FontSize.xs,
        color: Colors.textSecondary,
        fontWeight: '600',
    },
    availabilityDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginLeft: Spacing.sm,
    },
    // Form styles
    formGroup: {
        marginBottom: Spacing.md,
    },
    label: {
        fontSize: FontSize.sm,
        fontWeight: '600',
        color: Colors.text,
        marginBottom: Spacing.xs,
    },
    input: {
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: BorderRadius.md,
        padding: Spacing.md,
        fontSize: FontSize.md,
        color: Colors.text,
        backgroundColor: Colors.surface,
    },
    textArea: {
        minHeight: 80,
        textAlignVertical: 'top',
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: BorderRadius.md,
        backgroundColor: Colors.surface,
        overflow: 'hidden',
    },
    picker: {
        color: Colors.text,
    },
    submitButton: {
        backgroundColor: Colors.primary,
        padding: Spacing.md,
        borderRadius: BorderRadius.md,
        alignItems: 'center',
        marginTop: Spacing.sm,
    },
    submitButtonText: {
        color: Colors.white,
        fontSize: FontSize.md,
        fontWeight: 'bold',
    },
});
