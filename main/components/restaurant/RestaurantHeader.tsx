import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize } from '@/constants/theme';

interface RestaurantHeaderProps {
    title: string;
    totalCartItems: number;
    isFavorite: boolean;
    onBack: () => void;
    onCart: () => void;
    onToggleFavorite: () => void;
}

export const RestaurantHeader: React.FC<RestaurantHeaderProps> = ({
    title,
    totalCartItems,
    isFavorite,
    onBack,
    onCart,
    onToggleFavorite,
}) => {
    return (
        <View style={styles.header}>
            <TouchableOpacity onPress={onBack}>
                <Text style={styles.backText}>◀ Back</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle} numberOfLines={1}>{title}</Text>
            <View style={styles.rightActions}>
                <TouchableOpacity onPress={onToggleFavorite} style={styles.iconButton}>
                    <Ionicons
                        name={isFavorite ? "heart" : "heart-outline"}
                        size={24}
                        color={isFavorite ? Colors.error : Colors.primary}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={onCart}>
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
        </View>
    );
};

const styles = StyleSheet.create({
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
        flex: 1,
        textAlign: 'center',
        marginLeft: Spacing.md,
    },
    rightActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
    },
    iconButton: {
        padding: 4,
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
});
