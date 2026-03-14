import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/theme';
import { getFavorites } from '@/services/api';
import { useState, useEffect } from 'react';
import { Favorite } from '@/types/api';
import { StarRating } from '@/components/ui/StarRating';

export default function FavoriteScreen() {

    const [favoriteData, setFavoriteData] = useState<Favorite[]>([]);

    useEffect(() => {
        const fetchFavorites = async () => {
            const favorites = await getFavorites();
            setFavoriteData(favorites);
        };
        fetchFavorites();
    }, []);

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
                <Text style={styles.title}>Favorite restaurant</Text>

                {favoriteData.map((item) => (
                    <View key={item.id} style={styles.card}>
                        <View style={styles.cardImage}>
                            <Ionicons name="restaurant-outline" size={28} color={Colors.textMuted} />
                        </View>
                        <View style={styles.cardInfo}>
                            <Text style={styles.cardName}>{item.restaurant.name}</Text>
                            <View style={styles.cardMeta}>
                                <Ionicons name="location-outline" size={14} color={Colors.primary} />
                                <Text style={styles.cardAddress}>{item.restaurant.address}</Text>
                            </View>
                            <StarRating rating={item.restaurant.rating} />
                        </View>
                        <View style={styles.cardActions}>
                            <Ionicons name="heart" size={24} color={Colors.primary} />
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
    cardActions: {
        gap: Spacing.md,
    },
});
