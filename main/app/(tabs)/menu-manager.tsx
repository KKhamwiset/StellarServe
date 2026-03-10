import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/theme';

export default function MenuManagerScreen() {
    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Menu Manager</Text>
                <TouchableOpacity style={styles.addButton} activeOpacity={0.7}>
                    <Ionicons name="add" size={22} color={Colors.white} />
                    <Text style={styles.addButtonText}>Add Item</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.emptyState}>
                <Ionicons name="restaurant-outline" size={64} color={Colors.textMuted} />
                <Text style={styles.emptyTitle}>No menu items yet</Text>
                <Text style={styles.emptyText}>
                    Start adding items to your menu so customers can order from your restaurant.
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
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
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
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: Colors.primary,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        borderRadius: BorderRadius.full,
    },
    addButtonText: {
        color: Colors.white,
        fontSize: FontSize.sm,
        fontWeight: 'bold',
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
