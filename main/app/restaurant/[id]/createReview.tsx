import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, TextInput, KeyboardAvoidingView, Platform, Alert, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/theme';
import { createReviews } from '@/services/api';

import { StarRating } from '@/components/ui/StarRating';
import { SuccessModal } from '@/components/ui/success-modal';

export default function CreateReviewScreen() {
    const { id, order } = useLocalSearchParams<{ id: string, order: string }>();
    const router = useRouter();

    // Form state
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [successVisible, setSuccessVisible] = useState(false);

    const handleSubmitReview = async () => {
        if (rating === 0) {
            Alert.alert("Hold on!", "Please select a star rating before submitting.");
            return;
        }

        setIsSubmitting(true);
        try {
            await createReviews({
                restaurant_id: id,
                order_id: order,
                rating: rating,
                comment: comment.trim()
            });

            setSuccessVisible(true);
        } catch (error) {
            console.error("Failed to post review:", error);
            Alert.alert("Error", "Could not post your review. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="close" size={24} color={Colors.text} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Write a Review</Text>
                    <View style={{ width: 32 }} />
                </View>

                {/* Form Section */}
                <ScrollView contentContainerStyle={styles.formSection} keyboardShouldPersistTaps="handled">
                    <View style={styles.ratingInputContainer}>
                        <Text style={styles.ratingInputLabel}>Tap to rate your experience:</Text>
                        <StarRating
                            rating={rating}
                            size={40}
                            interactive={true}
                            onRatingChange={setRating}
                        />
                    </View>

                    <TextInput
                        style={styles.commentInput}
                        placeholder="Share details about your order (optional)..."
                        placeholderTextColor={Colors.textMuted}
                        value={comment}
                        onChangeText={setComment}
                        multiline
                        numberOfLines={6}
                        textAlignVertical="top"
                    />

                    <TouchableOpacity
                        style={[
                            styles.submitButton,
                            (rating === 0 || isSubmitting) && styles.submitButtonDisabled
                        ]}
                        onPress={handleSubmitReview}
                        disabled={rating === 0 || isSubmitting}
                        activeOpacity={0.8}
                    >
                        {isSubmitting ? (
                            <ActivityIndicator color={Colors.white} size="small" />
                        ) : (
                            <Text style={styles.submitButtonText}>Submit Review</Text>
                        )}
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>

            <SuccessModal
                visible={successVisible}
                title="Success"
                message="Your review has been posted!"
                onClose={() => {
                    setSuccessVisible(false);
                    router.back();
                }}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: Colors.borderLight,
        backgroundColor: Colors.surface,
    },
    backButton: {
        padding: Spacing.xs,
    },
    headerTitle: {
        fontSize: FontSize.lg,
        fontWeight: '700',
        color: Colors.text,
    },
    formSection: {
        flexGrow: 1,
        padding: Spacing.lg,
        backgroundColor: Colors.surface,
    },
    ratingInputContainer: {
        alignItems: 'center',
        paddingVertical: Spacing.xl,
        gap: Spacing.md,
    },
    ratingInputLabel: {
        fontSize: FontSize.md,
        color: Colors.textSecondary,
        fontWeight: '500',
    },
    commentInput: {
        backgroundColor: Colors.background,
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: BorderRadius.md,
        padding: Spacing.md,
        fontSize: FontSize.md,
        color: Colors.text,
        minHeight: 150,
        marginBottom: Spacing.xl,
    },
    submitButton: {
        backgroundColor: Colors.primary,
        paddingVertical: Spacing.md,
        borderRadius: BorderRadius.full,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 'auto',
    },
    submitButtonDisabled: {
        backgroundColor: Colors.border,
    },
    submitButtonText: {
        color: Colors.white,
        fontSize: FontSize.md,
        fontWeight: '700',
    },
});
