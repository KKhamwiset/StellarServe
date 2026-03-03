import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/theme';

const CUISINES = ['All', 'Japanese', 'Thai', 'Italian', 'Chinese', 'Indian', 'Korean', 'Mexican'];

export default function SearchScreen() {
    const [query, setQuery] = useState('');
    const [activeCuisine, setActiveCuisine] = useState('All');
    const router = useRouter();

    return (
        <View style={styles.container}>
            {/* Search Input */}
            <View style={styles.searchContainer}>
                <View style={styles.searchInput}>
                    <Ionicons name="search" size={20} color={Colors.textMuted} />
                    <TextInput
                        style={styles.input}
                        placeholder="Search restaurants, dishes..."
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

            {/* Cuisine Filters */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersRow}>
                {CUISINES.map((cuisine) => (
                    <TouchableOpacity
                        key={cuisine}
                        style={[styles.filterChip, activeCuisine === cuisine && styles.filterChipActive]}
                        onPress={() => setActiveCuisine(cuisine)}
                    >
                        <Text
                            style={[styles.filterText, activeCuisine === cuisine && styles.filterTextActive]}
                        >
                            {cuisine}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Results Area */}
            <ScrollView style={styles.results} showsVerticalScrollIndicator={false}>
                <View style={styles.emptyState}>
                    <Ionicons name="search-outline" size={64} color={Colors.textMuted} />
                    <Text style={styles.emptyTitle}>Discover restaurants</Text>
                    <Text style={styles.emptySubtitle}>
                        Search by name, cuisine, or dish to find your midnight cravings
                    </Text>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    searchContainer: {
        paddingHorizontal: Spacing.lg,
        paddingTop: Spacing.md,
    },
    searchInput: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.surfaceLight,
        borderRadius: BorderRadius.lg,
        paddingHorizontal: Spacing.md,
        height: 48,
        gap: Spacing.sm,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    input: {
        flex: 1,
        fontSize: FontSize.md,
        color: Colors.text,
    },
    filtersRow: {
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.md,
        maxHeight: 52,
    },
    filterChip: {
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        borderRadius: BorderRadius.full,
        backgroundColor: Colors.surfaceLight,
        marginRight: Spacing.sm,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    filterChipActive: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary,
    },
    filterText: {
        fontSize: FontSize.sm,
        color: Colors.textSecondary,
        fontWeight: '500',
    },
    filterTextActive: {
        color: Colors.background,
        fontWeight: '700',
    },
    results: {
        flex: 1,
        paddingHorizontal: Spacing.lg,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 80,
        gap: Spacing.sm,
    },
    emptyTitle: {
        fontSize: FontSize.xl,
        fontWeight: '600',
        color: Colors.text,
        marginTop: Spacing.md,
    },
    emptySubtitle: {
        fontSize: FontSize.md,
        color: Colors.textMuted,
        textAlign: 'center',
        maxWidth: 260,
    },
});
