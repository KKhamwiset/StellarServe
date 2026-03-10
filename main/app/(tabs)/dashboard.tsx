import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/theme';

export default function DashboardScreen() {
    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Dashboard</Text>
            </View>

            <View style={styles.content}>
                <View style={styles.statsGrid}>
                    <View style={styles.statCard}>
                        <Ionicons name="receipt-outline" size={28} color={Colors.primary} />
                        <Text style={styles.statValue}>0</Text>
                        <Text style={styles.statLabel}>Orders Today</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Ionicons name="cash-outline" size={28} color={Colors.accent} />
                        <Text style={styles.statValue}>฿0</Text>
                        <Text style={styles.statLabel}>Revenue</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Ionicons name="fast-food-outline" size={28} color={Colors.primary} />
                        <Text style={styles.statValue}>0</Text>
                        <Text style={styles.statLabel}>Menu Items</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Ionicons name="star-outline" size={28} color={Colors.star} />
                        <Text style={styles.statValue}>0.0</Text>
                        <Text style={styles.statLabel}>Rating</Text>
                    </View>
                </View>

                <View style={styles.infoCard}>
                    <Ionicons name="information-circle-outline" size={24} color={Colors.primary} />
                    <Text style={styles.infoText}>
                        Welcome to your seller dashboard! Manage your restaurant, menu items, and orders from here.
                    </Text>
                </View>
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
    content: {
        flex: 1,
        padding: Spacing.lg,
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.md,
        marginBottom: Spacing.xl,
    },
    statCard: {
        width: '47%',
        backgroundColor: Colors.surface,
        borderRadius: BorderRadius.xl,
        padding: Spacing.lg,
        alignItems: 'center',
        gap: Spacing.xs,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    statValue: {
        fontSize: FontSize.xxl,
        fontWeight: 'bold',
        color: Colors.text,
    },
    statLabel: {
        fontSize: FontSize.sm,
        color: Colors.textSecondary,
    },
    infoCard: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.md,
        backgroundColor: Colors.surface,
        borderRadius: BorderRadius.lg,
        padding: Spacing.lg,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    infoText: {
        flex: 1,
        fontSize: FontSize.sm,
        color: Colors.textSecondary,
        lineHeight: 20,
    },
});
