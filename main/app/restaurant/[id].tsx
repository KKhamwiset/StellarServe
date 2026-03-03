import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/theme';

const RESTAURANTS: Record<string, any> = {
    'rest-001': { name: 'Midnight Ramen House' },
    'rest-002': { name: 'Moonlight Thai Kitchen' },
    'rest-003': { name: 'Starlight Pizza' },
    'rest-004': { name: 'Restaurant' },
};

const MENU_ITEMS = [
    { id: 'm-1', name: 'Menu Name', price: 'xxx', rating: 5 },
    { id: 'm-2', name: 'Menu Name', price: 'xxx', rating: 5 },
    { id: 'm-3', name: 'Menu Name', price: 'xxx', rating: 5 },
    { id: 'm-4', name: 'Menu Name', price: 'xxx', rating: 5 },
    { id: 'm-5', name: 'Menu Name', price: 'xxx', rating: 5 },
    { id: 'm-6', name: 'Menu Name', price: 'xxx', rating: 5 },
    { id: 'm-7', name: 'Menu Name', price: 'xxx', rating: 5 },
    { id: 'm-8', name: 'Menu Name', price: 'xxx', rating: 5 },
];

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
    const restaurant = RESTAURANTS[id] || { name: 'Restaurant Name' };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Text style={styles.backText}>◀ Back</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{restaurant.name}</Text>
                <TouchableOpacity>
                    <Ionicons name="cart-outline" size={24} color={Colors.primary} />
                </TouchableOpacity>
            </View>

            {/* Menu List */}
            <ScrollView showsVerticalScrollIndicator={false}>
                {MENU_ITEMS.map((item) => (
                    <View key={item.id} style={styles.menuCard}>
                        <View style={styles.menuImage}>
                            <Ionicons name="fast-food-outline" size={28} color={Colors.textMuted} />
                        </View>
                        <View style={styles.menuInfo}>
                            <StarRating count={item.rating} />
                            <Text style={styles.menuName}>{item.name}</Text>
                            <Text style={styles.menuPrice}>Price : {item.price} Baht</Text>
                        </View>
                        <View style={styles.menuActions}>
                            <TouchableOpacity style={styles.addToCartBtn} activeOpacity={0.7}>
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
