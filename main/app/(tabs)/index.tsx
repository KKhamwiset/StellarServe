import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';
import { User, Restaurant, getRestaurants } from '@/services/api'
import { StarRating } from '@/components/start-rating';

const QUICK_CATEGORIES = [
  { icon: 'cafe-outline' as const, label: 'Drink' },
  { icon: 'fast-food-outline' as const, label: 'Food' },
  { icon: 'ice-cream-outline' as const, label: 'Cake' },
  { icon: 'gift-outline' as const, label: 'Snack' },
];

const CATEGORY_TAGS = [
  { label: 'Burgers', bg: Colors.primary, text: Colors.accent },
  { label: 'Pizza', bg: Colors.accent, text: Colors.primary },
  { label: 'BBQ', bg: Colors.primary, text: Colors.accent },
  { label: 'Fruit', bg: Colors.accent, text: Colors.primary },
  { label: 'Sushi', bg: Colors.primary, text: Colors.accent },
  { label: 'Noodle', bg: Colors.accent, text: Colors.primary },
];


export default function HomeScreen() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [featured, setFeatured] = useState<Restaurant[] | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) {
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error('Failed to load user:', error);
      }

      try {
        const restaurants = await getRestaurants();
        setFeatured(restaurants);
      } catch (error) {
        console.error('Failed to load restaurants:', error);
      }

      setLoading(false);
    };
    init();
  }, []);

  const role = user?.role;
  const isSeller = role === 'seller';


  useEffect(() => {
    if (!loading && isSeller) {
      router.replace('/(tabs)/dashboard');
    }
  }, [loading, isSeller]);


  if (loading || isSeller) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: Colors.textMuted }}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Consumer view
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <TouchableOpacity
          style={styles.searchBar}
          onPress={() => router.push('/(tabs)/search')}
          activeOpacity={0.7}
        >
          <Ionicons name="search-outline" size={18} color={Colors.textMuted} />
          <Text style={styles.searchText}>Search</Text>
        </TouchableOpacity>

        {/* Location Row */}
        <View style={styles.locationRow}>
          <View style={styles.locationLeft}>
            <Ionicons name="location" size={20} color={Colors.primary} />
            <Text style={styles.locationText}>9 West 46 Th Street, New York City</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/cart')}>
            <Ionicons name="cart-outline" size={24} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Special Offers Banner */}
        <View style={styles.bannerContainer}>
          <View style={styles.banner}>
            <View style={styles.bannerBody} />
            <View style={styles.bannerLabel}>
              <Text style={styles.bannerLabelText}>Special Offers</Text>
            </View>
          </View>
          <View style={styles.bannerDots}>
            <View style={[styles.dot, styles.dotActive]} />
            <View style={styles.dot} />
            <View style={styles.dot} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>
        </View>

        {/* Quick Category Icons */}
        <View style={styles.quickCategories}>
          {QUICK_CATEGORIES.map((cat, i) => (
            <TouchableOpacity key={i} style={styles.quickCatItem} activeOpacity={0.7}>
              <View style={[styles.quickCatIcon, i === 1 && styles.quickCatIconActive]}>
                <Ionicons name={cat.icon} size={24} color={i === 1 ? Colors.white : Colors.primary} />
              </View>
              <Text style={styles.quickCatLabel}>{cat.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Category Tags */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Category</Text>
            <TouchableOpacity>
              <Text style={styles.viewAll}>View all</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.categoryGrid}>
            {CATEGORY_TAGS.map((tag, i) => (
              <TouchableOpacity
                key={i}
                style={[styles.categoryTag, { backgroundColor: tag.bg }]}
                activeOpacity={0.7}
              >
                <Text style={[styles.categoryTagText, { color: tag.text }]}>{tag.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Near Me */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Near Me</Text>
            <TouchableOpacity>
              <Text style={styles.viewAll}>View all</Text>
            </TouchableOpacity>
          </View>
          {featured?.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.restaurantCard}
              activeOpacity={0.7}
              onPress={() => router.push(`/restaurant/${item.id}`)}
            >
              <View style={styles.restaurantImage}>
                <Ionicons name="restaurant-outline" size={28} color={Colors.textMuted} />
              </View>
              <View style={styles.restaurantInfo}>
                <Text style={styles.restaurantName}>{item.name}</Text>
                <View style={styles.restaurantMeta}>
                  <Ionicons name="location-outline" size={13} color={Colors.primary} />
                  <Text style={styles.restaurantAddress}>{item.address}</Text>
                </View>
                <View style={styles.restaurantMeta}>
                  <Ionicons name="time-outline" size={13} color={Colors.textMuted} />
                  <Text style={styles.restaurantTime}>{item.opening_time} - {item.closing_time}</Text>
                </View>
                <StarRating count={item.rating} />
              </View>
            </TouchableOpacity>
          ))}
        </View>

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
  searchBar: {
    marginHorizontal: Spacing.lg,
    marginTop: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceLight,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
    gap: Spacing.sm,
  },
  searchText: {
    color: Colors.textMuted,
    fontSize: FontSize.md,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  locationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    flex: 1,
  },
  locationText: {
    fontSize: FontSize.sm,
    color: Colors.text,
  },
  bannerContainer: {
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.sm,
  },
  banner: {
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    backgroundColor: Colors.card,
  },
  bannerBody: {
    height: 140,
    backgroundColor: Colors.card,
  },
  bannerLabel: {
    backgroundColor: Colors.textMuted,
    paddingVertical: 10,
    alignItems: 'center',
  },
  bannerLabelText: {
    color: Colors.white,
    fontSize: FontSize.lg,
    fontWeight: '700',
  },
  bannerDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginTop: Spacing.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.border,
  },
  dotActive: {
    backgroundColor: Colors.primary,
  },
  quickCategories: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
  },
  quickCatItem: {
    alignItems: 'center',
    gap: Spacing.xs,
  },
  quickCatIcon: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  quickCatIconActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  quickCatLabel: {
    fontSize: FontSize.xs,
    color: Colors.text,
    fontWeight: '500',
  },
  section: {
    marginTop: Spacing.lg,
    paddingHorizontal: Spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.text,
  },
  viewAll: {
    fontSize: FontSize.sm,
    color: Colors.textMuted,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  categoryTag: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    minWidth: 100,
    alignItems: 'center',
  },
  categoryTagText: {
    fontSize: FontSize.lg,
    fontWeight: '700',
  },
  restaurantCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    gap: Spacing.md,
  },
  restaurantImage: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  restaurantInfo: {
    flex: 1,
    gap: 3,
  },
  restaurantName: {
    fontSize: FontSize.md,
    fontWeight: '700',
    color: Colors.text,
  },
  restaurantMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  restaurantAddress: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },
  restaurantTime: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
});
