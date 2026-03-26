import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/theme';
import { getFavorites } from '@/services/api';
import { useState, useEffect } from 'react';
import { Favorite } from '@/types/api';
import { StarRating } from '@/components/ui/StarRating';
import { useRouter } from 'expo-router';

export default function FavoriteScreen() {
    const router = useRouter();
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
                    <TouchableOpacity
                        key={item.id}
                        style={[styles.card, !item.restaurant.is_open && { opacity: 0.6 }]}
                        activeOpacity={0.7}
                        disabled={!item.restaurant.is_open}
                        onPress={() => router.push(`/restaurant/${item.restaurant.id}`)}
                    >
                        <View style={styles.cardImage}>
                            {item.restaurant.image_url ? (
                                <Image source={{ uri: item.restaurant.image_url }} style={styles.fullImage} />
                            ) : (
                                <Ionicons name="restaurant-outline" size={28} color={Colors.textMuted} />
                            )}
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
                            <Ionicons name="heart" size={24} color={'#FD3A3A'} />
                        </View>
                    </TouchableOpacity>
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
        overflow: 'hidden',
    },
    fullImage: {
        width: '100%',
        height: '100%',
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
