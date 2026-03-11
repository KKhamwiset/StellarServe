import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, TextInput, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/theme';
import { getReviews, getRestaurant, Reviews } from '@/services/api';
import { IconSymbol } from '@/components/ui/icon-symbol';

function StarRating({ count = 5, size = 16, interactive = false, onRatingChange }: { count?: number, size?: number, interactive?: boolean, onRatingChange?: (rating: number) => void }) {
    return (
        <View style={{ flexDirection: 'row', gap: 2 }}>
            {Array.from({ length: 5 }).map((_, i) => (
                <TouchableOpacity
                    key={i}
                    activeOpacity={interactive ? 0.7 : 1}
                    onPress={() => interactive && onRatingChange && onRatingChange(i + 1)}
                    disabled={!interactive}
                >
                    <Ionicons
                        name={i < count ? "star" : "star-outline"}
                        size={size}
                        color={Colors.star}
                    />
                </TouchableOpacity>
            ))}
        </View>
    );
}

export default function RestaurantReviewsScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();

    const [reviews, setReviews] = useState<Reviews[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [restaurantName, setRestaurantName] = useState('Reviews');

    useEffect(() => {
        loadData();
    }, [id]);

    const loadData = async () => {
        try {
            const [reviewsData, restaurantData] = await Promise.all([
                getReviews(id),
                getRestaurant(id)
            ]);
            setReviews(reviewsData || []);
            if (restaurantData?.name) {
                setRestaurantName(restaurantData.name);
            }
        } catch (error) {
            console.error('Failed to load reviews or restaurant:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]} edges={['top']}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </SafeAreaView>
        );
    }

    // Calculate average rating
    const averageRating = reviews.length > 0
        ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1)
        : "0.0";

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.headerTitleContainer}>
                        <Ionicons name="star" size={24} color={Colors.star} />
                        <Text style={styles.headerTitleText}>
                            {restaurantName}
                        </Text>
                    </View>
                    <View style={{ width: 80 }} />
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: Spacing.xxl }}>

                    {/* Overall Score Banner */}
                    <View style={styles.scoreBanner}>
                        <Text style={styles.scoreText}>{averageRating}</Text>
                        <StarRating count={Math.round(Number(averageRating))} size={24} />
                        <Text style={styles.scoreSubtext}>Based on {reviews.length} reviews</Text>
                    </View>

                    {/* Divider */}
                    <View style={styles.divider} />

                    {/* Reviews List */}
                    <View style={styles.reviewsListHeader}>
                        <Text style={styles.sectionTitle}>Recent Reviews</Text>
                    </View>

                    {reviews.length > 0 ? (
                        reviews.map((review) => (
                            <View key={review.id} style={styles.reviewCard}>
                                <View style={styles.reviewHeader}>
                                    <View style={styles.reviewUser}>
                                        <View style={styles.avatarPlaceholder}>
                                            <Ionicons name="person" size={16} color={Colors.white} />
                                        </View>
                                        <Text style={styles.reviewUserName}>
                                            {review.user?.full_name || review.user?.username || `User ${review.user_id}`}
                                        </Text>
                                    </View>
                                    <StarRating count={review.rating} size={14} />
                                </View>
                                {review.comment ? (
                                    <Text style={styles.reviewComment}>{review.comment}</Text>
                                ) : (
                                    <Text style={[styles.reviewComment, { fontStyle: 'italic', color: Colors.border }]}>
                                        No comment provided.
                                    </Text>
                                )}
                            </View>
                        ))
                    ) : (
                        <View style={styles.noReviewsContainer}>
                            <Ionicons name="chatbubbles-outline" size={48} color={Colors.border} />
                            <Text style={styles.noReviewsText}>No reviews yet</Text>
                            <Text style={styles.noReviewsSubtext}>Your review will be the first!</Text>
                        </View>
                    )}
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    header: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: Spacing.xl,
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: Colors.borderLight,
        backgroundColor: Colors.surface,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        alignSelf: 'flex-start',
        gap: 4,
        width: 80,
    },
    backText: {
        fontSize: FontSize.md,
        color: Colors.text,
        fontWeight: '500',
    },
    headerTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        gap: Spacing.sm,
    },
    headerTitleText: {
        fontSize: FontSize.xl,
        fontWeight: '700',
        color: Colors.text,
    },
    scoreBanner: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: Spacing.xl,
        backgroundColor: Colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: Colors.borderLight,
        gap: Spacing.xs,
    },
    scoreText: {
        fontSize: 48,
        fontWeight: '800',
        color: Colors.text,
    },
    scoreSubtext: {
        fontSize: FontSize.sm,
        color: Colors.textMuted,
        marginTop: Spacing.xs,
    },
    divider: {
        height: 8,
        backgroundColor: Colors.background,
    },
    reviewsListHeader: {
        paddingHorizontal: Spacing.lg,
        paddingTop: Spacing.xl,
        paddingBottom: Spacing.sm,
        backgroundColor: Colors.surface,
    },
    sectionTitle: {
        fontSize: FontSize.lg,
        fontWeight: '700',
        color: Colors.text,
        marginBottom: Spacing.md,
    },
    reviewCard: {
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: Colors.borderLight,
        backgroundColor: Colors.surface,
    },
    reviewHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: Spacing.sm,
    },
    reviewUser: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    avatarPlaceholder: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: Colors.border,
        alignItems: 'center',
        justifyContent: 'center',
    },
    reviewUserName: {
        fontSize: FontSize.md,
        fontWeight: '600',
        color: Colors.text,
    },
    reviewComment: {
        fontSize: FontSize.md,
        color: Colors.textSecondary,
        lineHeight: 22,
    },
    noReviewsContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: Spacing.xxl,
        paddingHorizontal: Spacing.lg,
        gap: Spacing.sm,
        backgroundColor: Colors.surface,
    },
    noReviewsText: {
        fontSize: FontSize.lg,
        fontWeight: '700',
        color: Colors.textSecondary,
        marginTop: Spacing.sm,
    },
    noReviewsSubtext: {
        fontSize: FontSize.md,
        color: Colors.textMuted,
    },
});
