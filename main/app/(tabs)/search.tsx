import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/theme';

const MOCK_RESULTS = [
    { id: 'rest-001', name: 'Restaurant', address: '13 th Street, 46 W 12th St, NY', time: '3 min', distance: '1.1 km', rating: 5 },
    { id: 'rest-002', name: 'Restaurant', address: '13 th Street, 46 W 12th St, NY', time: '3 min', distance: '1.1 km', rating: 5 },
    { id: 'rest-003', name: 'Restaurant', address: '13 th Street, 46 W 12th St, NY', time: '3 min', distance: '1.1 km', rating: 5 },
    { id: 'rest-004', name: 'Restaurant', address: '13 th Street, 46 W 12th St, NY', time: '3 min', distance: '1.1 km', rating: 5 },
    { id: 'rest-005', name: 'Restaurant', address: '13 th Street, 46 W 12th St, NY', time: '3 min', distance: '1.1 km', rating: 5 },
];

function StarRating({ count = 5 }: { count?: number }) {
    return (
        <View style={{ flexDirection: 'row', gap: 2 }}>
            {Array.from({ length: count }).map((_, i) => (
                <Ionicons key={i} name="star" size={14} color={Colors.star} />
            ))}
        </View>
    );
}

export default function SearchScreen() {
    const [query, setQuery] = useState('');
    const router = useRouter();

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
                        placeholder="Search"
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
            <ScrollView style={styles.results} showsVerticalScrollIndicator={false}>
                {MOCK_RESULTS.map((item, index) => (
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
                            <View style={styles.resultMeta}>
                                <Ionicons name="location-outline" size={13} color={Colors.primary} />
                                <Text style={styles.resultAddress}>{item.address}</Text>
                            </View>
                            <View style={styles.resultMeta}>
                                <Ionicons name="time-outline" size={13} color={Colors.textMuted} />
                                <Text style={styles.resultTime}>{item.time} · {item.distance}</Text>
                            </View>
                            <StarRating count={item.rating} />
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
        gap: 3,
    },
    resultName: {
        fontSize: FontSize.md,
        fontWeight: '700',
        color: Colors.text,
    },
    resultMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    resultAddress: {
        fontSize: FontSize.xs,
        color: Colors.textSecondary,
    },
    resultTime: {
        fontSize: FontSize.xs,
        color: Colors.textMuted,
    },
});
