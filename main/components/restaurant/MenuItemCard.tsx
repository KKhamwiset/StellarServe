import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/theme';
import { MenuItem } from '@/types/api';

interface MenuItemCardProps {
    item: MenuItem;
    quantity: number;
    isBusy: boolean;
    onIncrement: (id: string) => void;
    onDecrement: (id: string) => void;
}

export const MenuItemCard: React.FC<MenuItemCardProps> = ({
    item,
    quantity,
    isBusy,
    onIncrement,
    onDecrement,
}) => {
    return (
        <View style={styles.menuCard}>
            <View style={styles.menuImage}>
                {item.image_url ? (
                    <Image source={{ uri: item.image_url }} style={styles.image} />
                ) : (
                    <Ionicons name="fast-food-outline" size={28} color={Colors.textMuted} />
                )}
            </View>
            <View style={styles.menuInfo}>
                <Text style={styles.menuName}>{item.name}</Text>
                {item.description && (
                    <Text style={styles.menuDescription} numberOfLines={1}>{item.description}</Text>
                )}
                <View style={styles.priceRow}>
                    <Text style={styles.menuPriceSymbol}>฿</Text>
                    <Text style={styles.menuPrice}>{item.price.toFixed(2)}</Text>
                </View>
            </View>
            <View style={styles.menuActions}>
                {quantity === 0 ? (
                    <TouchableOpacity
                        style={[styles.addToCartBtn, isBusy && { opacity: 0.5 }]}
                        activeOpacity={0.7}
                        onPress={() => onIncrement(item.id)}
                        disabled={isBusy}
                    >
                        <Text style={styles.addToCartText}>Add to cart</Text>
                    </TouchableOpacity>
                ) : (
                    <View style={styles.stepperContainer}>
                        <TouchableOpacity
                            style={styles.stepperButton}
                            onPress={() => onDecrement(item.id)}
                            disabled={isBusy}
                        >
                            <Ionicons name="remove" size={16} color={Colors.primary} />
                        </TouchableOpacity>
                        <Text style={styles.stepperText}>{quantity}</Text>
                        <TouchableOpacity
                            style={styles.stepperButton}
                            onPress={() => onIncrement(item.id)}
                            disabled={isBusy}
                        >
                            <Ionicons name="add" size={16} color={Colors.primary} />
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
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
    image: {
        width: '100%',
        height: '100%',
        borderRadius: BorderRadius.lg,
    },
    menuInfo: {
        flex: 1,
        paddingHorizontal: Spacing.md,
        gap: 3,
    },
    menuName: {
        fontSize: FontSize.md,
        fontWeight: '700',
        color: Colors.text,
    },
    menuDescription: {
        fontSize: FontSize.xs,
        color: Colors.textMuted,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 2,
        marginTop: 2,
    },
    menuPriceSymbol: {
        fontSize: FontSize.sm,
        fontWeight: '800',
        color: Colors.accent,
    },
    menuPrice: {
        fontSize: FontSize.lg,
        fontWeight: '800',
        color: Colors.accent,
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
});
