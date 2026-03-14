import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/theme';

interface BottomOrderBarProps {
    onProceed: () => void;
    totalItems: number;
}

export const BottomOrderBar: React.FC<BottomOrderBarProps> = ({
    onProceed,
    totalItems,
}) => {
    if (totalItems === 0) return null;

    return (
        <View style={styles.bottomBar}>
            <TouchableOpacity style={styles.proceedButton} activeOpacity={0.7} onPress={onProceed}>
                <Text style={styles.proceedText}>Proceed to order ({totalItems} items)</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.md,
        paddingBottom: Spacing.xl,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
    },
    proceedButton: {
        backgroundColor: Colors.primary,
        borderRadius: BorderRadius.full,
        paddingVertical: Spacing.md,
        alignItems: 'center',
    },
    proceedText: {
        fontSize: FontSize.lg,
        fontWeight: '700',
        color: Colors.accent,
    },
});
