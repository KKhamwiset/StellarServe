import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/theme';

interface StatCardProps {
    icon: keyof typeof Ionicons.glyphMap;
    value: string | number | undefined;
    label: string;
    iconColor?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
    icon,
    value,
    label,
    iconColor = Colors.primary,
}) => {
    return (
        <View style={styles.statCard}>
            <Ionicons name={icon} size={28} color={iconColor} />
            <Text style={styles.statValue}>{value ?? '-'}</Text>
            <Text style={styles.statLabel}>{label}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
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
});
