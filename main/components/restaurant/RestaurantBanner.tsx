import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/theme';
import { Restaurant, Reviews } from '@/types/api';
import { StarRating } from '@/components/ui/StarRating';

interface RestaurantBannerProps {
    restaurant: Restaurant;
    reviews: Reviews[] | null;
    onViewReviews: () => void;
}

export const RestaurantBanner: React.FC<RestaurantBannerProps> = ({
    restaurant,
    reviews,
    onViewReviews,
}) => {
    return (
        <View style={styles.banner}>
            <Text style={styles.bannerName}>{restaurant.name}</Text>
            {restaurant.cuisine_type && (
                <Text style={styles.bannerCuisine}>{restaurant.cuisine_type}</Text>
            )}
            {restaurant.address && (
                <View style={styles.bannerRow}>
                    <Ionicons name="location-outline" size={14} color={Colors.textSecondary} />
                    <Text style={styles.bannerDetail}>{restaurant.address}</Text>
                </View>
            )}
            <View style={[styles.bannerRow, { justifyContent: 'space-between', marginTop: Spacing.sm }]}>
                <View style={styles.bannerRow}>
                    <View style={[styles.bannerStatusBadge, { backgroundColor: restaurant.is_open ? Colors.success + '20' : Colors.error + '20', marginLeft: 0 }]}>
                        <View style={[styles.bannerStatusDot, { backgroundColor: restaurant.is_open ? Colors.success : Colors.error }]} />
                        <Text style={[styles.bannerStatusText, { color: restaurant.is_open ? Colors.success : Colors.error }]}>
                            {restaurant.is_open ? 'Open' : 'Closed'}
                        </Text>
                    </View>
                </View>

                <TouchableOpacity
                    style={styles.reviewsButton}
                    activeOpacity={0.8}
                    onPress={onViewReviews}
                >
                    <View style={styles.reviewsButtonLeft}>
                        <Text style={styles.reviewsRatingText}>{restaurant.rating.toFixed(1)}</Text>
                        <StarRating rating={1} maxRating={1} size={12} />
                    </View>
                    <View style={styles.reviewsButtonRight}>
                        <Text style={styles.reviewsCountText}>
                            {reviews ? reviews.length : 0} reviews
                        </Text>
                        <Ionicons name="chevron-forward" size={14} color={Colors.accent} />
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    banner: {
        backgroundColor: Colors.primary,
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.lg,
        gap: 6,
    },
    bannerName: {
        fontSize: FontSize.xxl,
        fontWeight: '800',
        color: Colors.white,
    },
    bannerCuisine: {
        fontSize: FontSize.sm,
        fontWeight: '600',
        color: Colors.accentLight,
    },
    bannerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    bannerDetail: {
        fontSize: FontSize.sm,
        color: Colors.textMuted,
    },
    bannerStatusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: BorderRadius.full,
        marginLeft: Spacing.sm,
    },
    bannerStatusDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
    },
    bannerStatusText: {
        fontSize: FontSize.xs,
        fontWeight: '600',
    },
    reviewsButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.white,
        borderRadius: BorderRadius.full,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    reviewsButtonLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        borderRightWidth: 1,
        borderRightColor: Colors.borderLight,
        paddingRight: Spacing.sm,
        marginRight: Spacing.sm,
    },
    reviewsRatingText: {
        fontSize: FontSize.md,
        fontWeight: '800',
        color: Colors.text,
    },
    reviewsButtonRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
    },
    reviewsCountText: {
        fontSize: FontSize.sm,
        fontWeight: '600',
        color: Colors.primary,
    },
});
