import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/theme';

interface PaymentMethod {
    id: string;
    type: 'card' | 'cash';
    details: string;
    isDefault: boolean;
}

const PAYMENTS: PaymentMethod[] = [
    { id: '1', type: 'cash', details: 'Cash on Delivery', isDefault: false },
];

export default function PaymentScreen() {
    const [methods, setMethods] = useState<PaymentMethod[]>(PAYMENTS);

    const renderItem = ({ item }: { item: PaymentMethod }) => (
        <View style={styles.card}>
            <View style={styles.cardInfo}>
                <Ionicons
                    name={item.type === 'card' ? 'card' : 'cash'}
                    size={28}
                    color={Colors.primary}
                />
                <View style={styles.cardText}>
                    <Text style={styles.cardTitle}>
                        {item.type === 'card' ? 'Credit/Debit Card' : 'Cash'}
                    </Text>
                    <Text style={styles.cardSubtitle}>{item.details}</Text>
                </View>
            </View>
            {item.isDefault && (
                <View style={styles.defaultBadge}>
                    <Text style={styles.defaultText}>Default</Text>
                </View>
            )}
        </View>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={Colors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Payment Methods</Text>
                <View style={{ width: 40 }} />
            </View>

            <FlatList
                data={methods}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.listContainer}
                ListFooterComponent={() => (
                    <TouchableOpacity style={styles.addButton} activeOpacity={0.7}>
                        <Ionicons name="add-circle-outline" size={24} color={Colors.primary} />
                        <Text style={styles.addText}>Add New Payment Method</Text>
                    </TouchableOpacity>
                )}
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
        backgroundColor: Colors.white,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    backButton: {
        padding: Spacing.xs,
    },
    headerTitle: {
        fontSize: FontSize.lg,
        fontWeight: '700',
        color: Colors.text,
    },
    listContainer: {
        padding: Spacing.lg,
        gap: Spacing.md,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: Colors.white,
        padding: Spacing.md,
        borderRadius: BorderRadius.lg,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    cardInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.md,
    },
    cardText: {
        gap: 2,
    },
    cardTitle: {
        fontSize: FontSize.md,
        fontWeight: '600',
        color: Colors.text,
    },
    cardSubtitle: {
        fontSize: FontSize.sm,
        color: Colors.textSecondary,
    },
    defaultBadge: {
        backgroundColor: Colors.primary + '15',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: BorderRadius.sm,
    },
    defaultText: {
        fontSize: FontSize.xs,
        fontWeight: '700',
        color: Colors.primary,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: Spacing.sm,
        backgroundColor: Colors.surface,
        padding: Spacing.md,
        borderRadius: BorderRadius.lg,
        borderWidth: 1,
        borderStyle: 'dashed',
        borderColor: Colors.primary,
        marginTop: Spacing.md,
    },
    addText: {
        fontSize: FontSize.md,
        fontWeight: '600',
        color: Colors.primary,
    },
});
