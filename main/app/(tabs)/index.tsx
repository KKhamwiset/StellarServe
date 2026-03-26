import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';
import { getRestaurants } from '@/services/api'
import { User, Restaurant } from '@/types/api'
import { StarRating } from '@/components/ui/StarRating';
import { NotificationBadge } from '@/components/ui/NotificationBadge';
import { CartBadge } from '@/components/ui/CartBadge';


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
  const isRider = role === 'rider';

  useEffect(() => {
    if (!loading && isSeller) {
      router.replace('/(tabs)/dashboard');
    }
    if (!loading && isRider) {
      router.replace('/(tabs)/rider-deliveries');
    }
  }, [loading, isSeller, isRider]);


  if (loading || isSeller || isRider) {
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
            <Text style={styles.locationText}>{user?.address}</Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 16, alignItems: 'center' }}>
            <NotificationBadge size={24} color={Colors.primary} />
            <CartBadge size={24} color={Colors.primary} />
          </View>
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
            <TouchableOpacity onPress={() => router.push('/(tabs)/search')}>
              <Text style={styles.viewAll}>View all</Text>
            </TouchableOpacity>
          </View>
          {featured?.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.restaurantCard, !item.is_open && { opacity: 0.6 }]}
              activeOpacity={0.7}
              disabled={!item.is_open}
              onPress={() => router.push(`/restaurant/${item.id}`)}
            >
              <View style={styles.restaurantImage}>
                {item.image_url ? (
                  <Image source={{ uri: item.image_url }} style={styles.fullImage} />
                ) : (
                  <Ionicons name="restaurant-outline" size={28} color={Colors.textMuted} />
                )}
                {!item.is_open && (
                  <View style={styles.closedOverlay}>
                    <Text style={styles.closedText}>Closed</Text>
                  </View>
                )}
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
                <StarRating rating={item.rating} />
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
    overflow: 'hidden',
  },
  closedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closedText: {
    color: Colors.white,
    fontSize: FontSize.lg,
    fontWeight: '800',
    letterSpacing: 1,
  },
  fullImage: {
    width: '100%',
    height: '100%',
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
