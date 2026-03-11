import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/theme';
import { getRestaurants, Restaurant } from '@/services/api';

function StarRating({ count = 5 }: { count?: number }) {
    return (
        <View style={{ flexDirection: 'row', gap: 2 }}>
            {Array.from({ length: Math.round(count) }).map((_, i) => (
                <Ionicons key={i} name="star" size={14} color={Colors.star} />
            ))}
        </View>
    );
}

export default function SearchScreen() {
    const [query, setQuery] = useState('');
    const router = useRouter();
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadRestaurants();
    }, []);

    const loadRestaurants = async () => {
        try {
            const data = await getRestaurants();
            setRestaurants(data);
        } catch (error) {
            console.error('Failed to load restaurants:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const filtered = useMemo(() => {
        if (!query.trim()) return restaurants;
        const q = query.toLowerCase();
        return restaurants.filter(
            (r) =>
                r.name.toLowerCase().includes(q) ||
                (r.address && r.address.toLowerCase().includes(q)) ||
                (r.cuisine_type && r.cuisine_type.toLowerCase().includes(q))
        );
    }, [query, restaurants]);

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Text style={styles.backText}>◀ Back</Text>
                </TouchableOpacity>
            </View>

            {/* Search Input */}
            <View style={styles.searchContainer}>
                <View style={styles.searchInput}>
                    <Ionicons name="search-outline" size={18} color={Colors.textMuted} />
                    <TextInput
                        style={styles.input}
                        placeholder="Search restaurants..."
                        placeholderTextColor={Colors.textMuted}
                        value={query}
                        onChangeText={setQuery}
                        returnKeyType="search"
                    />
                    {query.length > 0 && (
                        <TouchableOpacity onPress={() => setQuery('')}>
                            <Ionicons name="close-circle" size={20} color={Colors.textMuted} />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* Sort / Filter Row */}
            <View style={styles.filterRow}>
                <TouchableOpacity style={styles.sortButton}>
                    <Text style={styles.sortText}>Sort by</Text>
                    <Ionicons name="chevron-down" size={16} color={Colors.text} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.filterButton}>
                    <Ionicons name="options-outline" size={18} color={Colors.text} />
                    <Text style={styles.filterText}>Filter</Text>
                </TouchableOpacity>
            </View>

            {/* Results */}
            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                </View>
            ) : filtered.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Ionicons name="search" size={48} color={Colors.textMuted} />
                    <Text style={styles.emptyText}>
                        {query.trim() ? 'No restaurants match your search' : 'No restaurants available'}
                    </Text>
                </View>
            ) : (
                <ScrollView style={styles.results} showsVerticalScrollIndicator={false}>
                    {filtered.map((item) => (
                        <TouchableOpacity
                            key={item.id}
                            style={styles.resultCard}
                            activeOpacity={0.7}
                            onPress={() => router.push(`/restaurant/${item.id}`)}
                        >
                            <View style={styles.resultImage}>
                                <Ionicons name="restaurant-outline" size={24} color={Colors.textMuted} />
                            </View>
                            <View style={styles.resultInfo}>
                                <Text style={styles.resultName}>{item.name}</Text>
                                {item.cuisine_type && (
                                    <Text style={styles.cuisineTag}>{item.cuisine_type}</Text>
                                )}
                                {item.address && (
                                    <View style={styles.resultMeta}>
                                        <Ionicons name="location-outline" size={13} color={Colors.primary} />
                                        <Text style={styles.resultAddress} numberOfLines={1}>{item.address}</Text>
                                    </View>
                                )}
                                <View style={styles.resultBottom}>
                                    <StarRating count={item.rating} />
                                    <View style={[styles.statusBadge, { backgroundColor: item.is_open ? Colors.success + '20' : Colors.error + '20' }]}>
                                        <View style={[styles.statusDot, { backgroundColor: item.is_open ? Colors.success : Colors.error }]} />
                                        <Text style={[styles.statusText, { color: item.is_open ? Colors.success : Colors.error }]}>
                                            {item.is_open ? 'Open' : 'Closed'}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
                    <View style={{ height: 32 }} />
                </ScrollView>
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
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.sm,
    },
    backText: {
        fontSize: FontSize.md,
        color: Colors.text,
        fontWeight: '500',
    },
    searchContainer: {
        paddingHorizontal: Spacing.lg,
    },
    searchInput: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.surfaceLight,
        borderRadius: BorderRadius.full,
        paddingHorizontal: Spacing.md,
        height: 44,
        gap: Spacing.sm,
    },
    input: {
        flex: 1,
        fontSize: FontSize.md,
        color: Colors.text,
    },
    filterRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.md,
    },
    sortButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    sortText: {
        fontSize: FontSize.md,
        color: Colors.text,
        fontWeight: '500',
    },
    filterButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    filterText: {
        fontSize: FontSize.md,
        color: Colors.text,
        fontWeight: '500',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: Spacing.md,
        paddingHorizontal: Spacing.xl,
    },
    emptyText: {
        fontSize: FontSize.md,
        color: Colors.textMuted,
        textAlign: 'center',
    },
    results: {
        flex: 1,
        paddingHorizontal: Spacing.lg,
    },
    resultCard: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: Spacing.md,
        gap: Spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: Colors.borderLight,
    },
    resultImage: {
        width: 72,
        height: 72,
        borderRadius: BorderRadius.lg,
        backgroundColor: Colors.card,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.border,
    },
    resultInfo: {
        flex: 1,
        gap: 4,
    },
    resultName: {
        fontSize: FontSize.md,
        fontWeight: '700',
        color: Colors.text,
    },
    cuisineTag: {
        fontSize: FontSize.xs,
        color: Colors.accent,
        fontWeight: '600',
    },
    resultMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    resultAddress: {
        fontSize: FontSize.xs,
        color: Colors.textSecondary,
        flex: 1,
    },
    resultBottom: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 2,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: BorderRadius.full,
    },
    statusDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
    },
    statusText: {
        fontSize: FontSize.xs,
        fontWeight: '600',
    },
});
