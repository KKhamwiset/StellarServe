import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/theme';

// Mock data (will be fetched from API later)
const RESTAURANTS: Record<string, any> = {
    'rest-001': {
        name: 'Midnight Ramen House',
        cuisine: 'Japanese',
        rating: 4.7,
        address: '123 Night Market St',
        hours: '18:00 – 04:00',
        description: 'Authentic Japanese ramen served fresh through the night',
    },
    'rest-002': {
        name: 'Moonlight Thai Kitchen',
        cuisine: 'Thai',
        rating: 4.5,
        address: '456 Soi Midnight',
        hours: '20:00 – 05:00',
        description: 'Late-night Thai street food favorites',
    },
    'rest-003': {
        name: 'Starlight Pizza',
        cuisine: 'Italian',
        rating: 4.3,
        address: '789 Luna Ave',
        hours: '19:00 – 02:00',
        description: 'Wood-fired pizzas under the stars',
    },
};

const MENUS: Record<string, any[]> = {
    'rest-001': [
        { id: 'item-001', name: 'Tonkotsu Ramen', desc: 'Rich pork bone broth with chashu, egg, and nori', price: 280, cat: 'Ramen' },
        { id: 'item-002', name: 'Miso Ramen', desc: 'Fermented soybean broth with corn and butter', price: 260, cat: 'Ramen' },
        { id: 'item-003', name: 'Gyoza (6 pcs)', desc: 'Pan-fried pork dumplings', price: 120, cat: 'Sides' },
    ],
    'rest-002': [
        { id: 'item-004', name: 'Pad Thai', desc: 'Classic stir-fried rice noodles with shrimp', price: 180, cat: 'Noodles' },
        { id: 'item-005', name: 'Green Curry', desc: 'Spicy green curry with chicken and Thai basil', price: 220, cat: 'Curry' },
        { id: 'item-006', name: 'Mango Sticky Rice', desc: 'Sweet coconut sticky rice with fresh mango', price: 140, cat: 'Dessert' },
    ],
    'rest-003': [
        { id: 'item-007', name: 'Margherita Pizza', desc: 'San Marzano tomatoes, mozzarella, fresh basil', price: 320, cat: 'Pizza' },
        { id: 'item-008', name: 'Pepperoni Pizza', desc: 'Classic pepperoni with mozzarella', price: 350, cat: 'Pizza' },
    ],
};

export default function RestaurantDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const restaurant = RESTAURANTS[id] || { name: 'Unknown', cuisine: '', rating: 0, address: '', hours: '', description: '' };
    const menuItems = MENUS[id] || [];

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Restaurant Header */}
            <View style={styles.heroSection}>
                <View style={styles.heroImagePlaceholder}>
                    <Ionicons name="restaurant" size={48} color={Colors.primary} />
                </View>
                <Text style={styles.restaurantName}>{restaurant.name}</Text>
                <Text style={styles.restaurantCuisine}>{restaurant.cuisine}</Text>
                <Text style={styles.restaurantDesc}>{restaurant.description}</Text>

                <View style={styles.infoRow}>
                    <View style={styles.infoBadge}>
                        <Ionicons name="star" size={14} color={Colors.star} />
                        <Text style={styles.infoText}>{restaurant.rating}</Text>
                    </View>
                    <View style={styles.infoBadge}>
                        <Ionicons name="time" size={14} color={Colors.textSecondary} />
                        <Text style={styles.infoText}>{restaurant.hours}</Text>
                    </View>
                    <View style={styles.infoBadge}>
                        <Ionicons name="location" size={14} color={Colors.textSecondary} />
                        <Text style={styles.infoText}>{restaurant.address}</Text>
                    </View>
                </View>
            </View>

            {/* Menu Section */}
            <View style={styles.menuSection}>
                <Text style={styles.menuTitle}>Menu</Text>
                {menuItems.map((item: any) => (
                    <TouchableOpacity key={item.id} style={styles.menuCard} activeOpacity={0.7}>
                        <View style={styles.menuInfo}>
                            <Text style={styles.menuItemName}>{item.name}</Text>
                            <Text style={styles.menuItemDesc}>{item.desc}</Text>
                            <Text style={styles.menuItemPrice}>฿{item.price.toFixed(2)}</Text>
                        </View>
                        <TouchableOpacity style={styles.addButton} activeOpacity={0.7}>
                            <Ionicons name="add" size={22} color={Colors.background} />
                        </TouchableOpacity>
                    </TouchableOpacity>
                ))}
            </View>

            <View style={{ height: 100 }} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    heroSection: {
        alignItems: 'center',
        paddingTop: Spacing.xl,
        paddingHorizontal: Spacing.lg,
        paddingBottom: Spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    heroImagePlaceholder: {
        width: 96,
        height: 96,
        borderRadius: BorderRadius.xl,
        backgroundColor: Colors.surfaceLight,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: Spacing.md,
        borderWidth: 2,
        borderColor: Colors.primary + '44',
    },
    restaurantName: {
        fontSize: FontSize.xxl,
        fontWeight: '700',
        color: Colors.text,
        textAlign: 'center',
    },
    restaurantCuisine: {
        fontSize: FontSize.md,
        color: Colors.primary,
        fontWeight: '600',
        marginTop: Spacing.xs,
    },
    restaurantDesc: {
        fontSize: FontSize.sm,
        color: Colors.textSecondary,
        textAlign: 'center',
        marginTop: Spacing.sm,
        maxWidth: 300,
    },
    infoRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: Spacing.sm,
        marginTop: Spacing.md,
    },
    infoBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: Colors.surfaceLight,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: BorderRadius.full,
    },
    infoText: {
        fontSize: FontSize.xs,
        color: Colors.textSecondary,
    },
    menuSection: {
        paddingHorizontal: Spacing.lg,
        paddingTop: Spacing.lg,
    },
    menuTitle: {
        fontSize: FontSize.xl,
        fontWeight: '700',
        color: Colors.text,
        marginBottom: Spacing.md,
    },
    menuCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.card,
        borderRadius: BorderRadius.lg,
        padding: Spacing.md,
        marginBottom: Spacing.sm,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    menuInfo: {
        flex: 1,
    },
    menuItemName: {
        fontSize: FontSize.md,
        fontWeight: '600',
        color: Colors.text,
    },
    menuItemDesc: {
        fontSize: FontSize.sm,
        color: Colors.textMuted,
        marginTop: 2,
    },
    menuItemPrice: {
        fontSize: FontSize.md,
        fontWeight: '700',
        color: Colors.primary,
        marginTop: Spacing.xs,
    },
    addButton: {
        width: 40,
        height: 40,
        borderRadius: BorderRadius.full,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: Spacing.sm,
    },
});
