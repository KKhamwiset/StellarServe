import { StyleSheet, Platform } from 'react-native';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/theme';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    headerTitle: {
        fontSize: FontSize.lg,
        fontWeight: 'bold',
        color: Colors.text,
        marginLeft: Spacing.md,
    },
    backButton: {
        padding: Spacing.xs,
        backgroundColor: Colors.surface,
        borderRadius: BorderRadius.full,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: Spacing.lg,
        paddingBottom: Spacing.xxl * 3,
    },
    section: {
        backgroundColor: Colors.card,
        borderRadius: BorderRadius.xl,
        padding: Spacing.md,
        marginBottom: Spacing.lg,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    sectionTitle: {
        fontSize: FontSize.md,
        fontWeight: 'bold',
        color: Colors.primary,
        marginBottom: Spacing.md,
    },
    inputContainer: {
        marginBottom: Spacing.md,
    },
    label: {
        fontSize: FontSize.sm,
        color: Colors.textSecondary,
        marginBottom: Spacing.xs,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.surface,
        borderRadius: BorderRadius.md,
        paddingHorizontal: Spacing.sm,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    inputIcon: {
        marginRight: Spacing.sm,
    },
    input: {
        flex: 1,
        color: Colors.text,
        fontSize: FontSize.md,
        paddingVertical: Platform.OS === 'ios' ? Spacing.md : Spacing.sm,
    },
    textArea: {
        height: 80,
        textAlignVertical: 'top',
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: Spacing.sm,
    },
    summaryLabel: {
        fontSize: FontSize.sm,
        color: Colors.textSecondary,
    },
    summaryValue: {
        fontSize: FontSize.sm,
        color: Colors.text,
        fontWeight: '500',
    },
    totalRow: {
        marginTop: Spacing.sm,
        paddingTop: Spacing.md,
        borderTopWidth: 1,
        borderTopColor: Colors.border,
    },
    totalLabel: {
        fontSize: FontSize.md,
        fontWeight: 'bold',
        color: Colors.text,
    },
    totalValue: {
        fontSize: FontSize.lg,
        fontWeight: 'bold',
        color: Colors.primary,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: Spacing.md,
        paddingBottom: Platform.OS === 'ios' ? 34 : Spacing.md,
        backgroundColor: Colors.white,
    },
    checkoutButton: {
        backgroundColor: Colors.primary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: Spacing.lg,
        height: 56,
        borderRadius: BorderRadius.full,
    },
    disabledButton: {
        opacity: 0.7,
    },
    checkoutButtonText: {
        color: Colors.white,
        fontSize: FontSize.md,
        fontWeight: 'bold',
    },
});
