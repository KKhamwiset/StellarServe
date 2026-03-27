import { StyleSheet } from 'react-native';
import { Colors, Spacing, BorderRadius, FontSize } from '@/constants/theme';
import { styles as defaultStyles } from '@/styles/profile.styles';

export const styles = StyleSheet.create({
    ...defaultStyles as any,
    inputContainer: {
        marginBottom: Spacing.md,
    },
    inputLabel: {
        fontSize: FontSize.sm,
        color: Colors.textSecondary,
        marginBottom: 4,
        fontWeight: '600',
    },
    input: {
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: BorderRadius.md,
        padding: Spacing.md,
        fontSize: FontSize.md,
        color: Colors.text,
        backgroundColor: Colors.surface,
    },
    saveButton: {
        backgroundColor: Colors.primary,
        paddingVertical: Spacing.md,
        borderRadius: BorderRadius.md,
        alignItems: 'center',
        marginTop: Spacing.sm,
    },
    saveButtonText: {
        color: Colors.white,
        fontWeight: 'bold',
        fontSize: FontSize.md,
    },
    menuItemSwitch: {
        flexDirection: 'row',
        alignItems: 'center',
    }
});
