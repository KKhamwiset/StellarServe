import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/theme';

// Mock featured restaurants for the home screen
const FEATURED = [
  {
    id: 'rest-001',
    name: 'Midnight Ramen House',
    cuisine: 'Japanese',
    rating: 4.7,
    time: '25-35 min',
    isOpen: true,
  },
  {
    id: 'rest-002',
    name: 'Moonlight Thai Kitchen',
    cuisine: 'Thai',
    rating: 4.5,
    time: '20-30 min',
    isOpen: true,
  },
  {
    id: 'rest-003',
    name: 'Starlight Pizza',
    cuisine: 'Italian',
    rating: 4.3,
    time: '30-40 min',
    isOpen: false,
  },
];

const CATEGORIES = [
  { icon: 'flame', label: 'Popular' },
  { icon: 'restaurant', label: 'Dinner' },
  { icon: 'cafe', label: 'Drinks' },
  { icon: 'ice-cream', label: 'Dessert' },
  { icon: 'pizza', label: 'Fast Food' },
  { icon: 'leaf', label: 'Healthy' },
];

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero Banner */}
      <View style={styles.hero}>
        <Text style={styles.heroEmoji}>🌙</Text>
        <Text style={styles.heroTitle}>Good Evening!</Text>
        <Text style={styles.heroSubtitle}>What would you like to eat tonight?</Text>
      </View>

      {/* Search Bar Preview */}
      <TouchableOpacity
        style={styles.searchBar}
        onPress={() => router.push('/(tabs)/search')}
        activeOpacity={0.7}
      >
        <Ionicons name="search" size={20} color={Colors.textMuted} />
        <Text style={styles.searchText}>Search restaurants or dishes...</Text>
      </TouchableOpacity>

      {/* Categories */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Categories</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesRow}>
          {CATEGORIES.map((cat, i) => (
            <TouchableOpacity key={i} style={styles.categoryChip} activeOpacity={0.7}>
              <View style={styles.categoryIcon}>
                <Ionicons name={cat.icon as any} size={22} color={Colors.primary} />
              </View>
              <Text style={styles.categoryLabel}>{cat.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Featured Restaurants */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Open Now 🔥</Text>
        <FlatList
          data={FEATURED}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.restaurantCard, !item.isOpen && styles.restaurantClosed]}
              activeOpacity={0.7}
              onPress={() => router.push(`/restaurant/${item.id}`)}
            >
              <View style={styles.restaurantImagePlaceholder}>
                <Ionicons name="restaurant" size={32} color={Colors.primary} />
              </View>
              <View style={styles.restaurantInfo}>
                <Text style={styles.restaurantName}>{item.name}</Text>
                <Text style={styles.restaurantCuisine}>{item.cuisine}</Text>
                <View style={styles.restaurantMeta}>
                  <View style={styles.ratingBadge}>
                    <Ionicons name="star" size={12} color={Colors.star} />
                    <Text style={styles.ratingText}>{item.rating}</Text>
                  </View>
                  <Text style={styles.deliveryTime}>{item.time}</Text>
                  {!item.isOpen && (
                    <View style={styles.closedBadge}>
                      <Text style={styles.closedText}>Closed</Text>
                    </View>
                  )}
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color={Colors.textMuted} />
            </TouchableOpacity>
          )}
        />
      </View>

      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  hero: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.md,
  },
  heroEmoji: {
    fontSize: 40,
    marginBottom: Spacing.sm,
  },
  heroTitle: {
    fontSize: FontSize.hero,
    fontWeight: '700',
    color: Colors.text,
  },
  heroSubtitle: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  searchBar: {
    marginHorizontal: Spacing.lg,
    marginVertical: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: 14,
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchText: {
    color: Colors.textMuted,
    fontSize: FontSize.md,
  },
  section: {
    marginTop: Spacing.lg,
    paddingHorizontal: Spacing.lg,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  categoriesRow: {
    marginHorizontal: -Spacing.xs,
  },
  categoryChip: {
    alignItems: 'center',
    marginHorizontal: Spacing.xs,
    width: 72,
  },
  categoryIcon: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  categoryLabel: {
    color: Colors.textSecondary,
    fontSize: FontSize.xs,
    marginTop: Spacing.xs,
    textAlign: 'center',
  },
  restaurantCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.md,
  },
  restaurantClosed: {
    opacity: 0.5,
  },
  restaurantImagePlaceholder: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  restaurantInfo: {
    flex: 1,
  },
  restaurantName: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: Colors.text,
  },
  restaurantCuisine: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  restaurantMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: Colors.surfaceLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  ratingText: {
    fontSize: FontSize.xs,
    color: Colors.star,
    fontWeight: '600',
  },
  deliveryTime: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  closedBadge: {
    backgroundColor: Colors.error + '22',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  closedText: {
    fontSize: FontSize.xs,
    color: Colors.error,
    fontWeight: '600',
  },
});
