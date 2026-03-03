import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/theme';

const FAVORITES = [
    { id: 'fav-1', name: 'Restaurant', address: '13 th Street, 46 W 12th St, NY', rating: 5 },
    { id: 'fav-2', name: 'Restaurant', address: '13 th Street, 46 W 12th St, NY', rating: 5 },
    { id: 'fav-3', name: 'Restaurant', address: '13 th Street, 46 W 12th St, NY', rating: 5 },
    { id: 'fav-4', name: 'Restaurant', address: '13 th Street, 46 W 12th St, NY', rating: 5 },
    { id: 'fav-5', name: 'Restaurant', address: '13 th Street, 46 W 12th St, NY', rating: 5 },
];

function StarRating({ count = 5 }: { count?: number }) {
    return (
        <View style={{ flexDirection: 'row', gap: 2 }}>
            {Array.from({ length: count }).map((_, i) => (
                <Ionicons key={i} name="star" size={16} color={Colors.star} />
            ))}
        </View>
    );
}

export default function FavoriteScreen() {
    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
                <Text style={styles.title}>Favorite restaurant</Text>

                {FAVORITES.map((item) => (
                    <View key={item.id} style={styles.card}>
                        <View style={styles.cardImage}>
                            <Ionicons name="restaurant-outline" size={28} color={Colors.textMuted} />
                        </View>
                        <View style={styles.cardInfo}>
                            <Text style={styles.cardName}>{item.name}</Text>
                            <View style={styles.cardMeta}>
                                <Ionicons name="location-outline" size={14} color={Colors.primary} />
                                <Text style={styles.cardAddress}>{item.address}</Text>
                            </View>
                            <StarRating count={item.rating} />
                        </View>
                    </View>
                ))}

                <View style={{ height: 32 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    content: {
        paddingHorizontal: Spacing.lg,
        paddingTop: Spacing.xl,
    },
    title: {
        fontSize: FontSize.xl,
        fontWeight: '700',
        color: Colors.text,
        textAlign: 'center',
        marginBottom: Spacing.lg,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: Spacing.md,
        gap: Spacing.md,
    },
    cardImage: {
        width: 72,
        height: 72,
        borderRadius: BorderRadius.xl,
        backgroundColor: Colors.card,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.border,
    },
    cardInfo: {
        flex: 1,
        gap: 4,
    },
    cardName: {
        fontSize: FontSize.md,
        fontWeight: '700',
        color: Colors.text,
    },
    cardMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    cardAddress: {
        fontSize: FontSize.xs,
        color: Colors.textSecondary,
    },
});
