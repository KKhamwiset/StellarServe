import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize } from '@/constants/theme';

export default function SellerOrdersScreen() {
    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Orders</Text>
            </View>

            <View style={styles.emptyState}>
                <Ionicons name="receipt-outline" size={64} color={Colors.textMuted} />
                <Text style={styles.emptyTitle}>No orders yet</Text>
                <Text style={styles.emptyText}>
                    When customers place orders from your restaurant, they will appear here.
                </Text>
            </View>
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
        paddingVertical: Spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    headerTitle: {
        fontSize: FontSize.xl,
        fontWeight: 'bold',
        color: Colors.text,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: Spacing.xl,
        gap: Spacing.sm,
    },
    emptyTitle: {
        fontSize: FontSize.lg,
        fontWeight: 'bold',
        color: Colors.textMuted,
    },
    emptyText: {
        fontSize: FontSize.sm,
        color: Colors.textSecondary,
        textAlign: 'center',
        lineHeight: 20,
    },
});
