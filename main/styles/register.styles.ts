import { StyleSheet, Platform } from 'react-native';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/theme';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FEE2E2',
        padding: 10,
        borderRadius: 8,
        marginBottom: 10,
    },
    errorText: {
        color: Colors.error,
        marginLeft: 8,
        fontSize: 14,
    },
    disabledButton: {
        opacity: 0.7,
    },
    scrollContent: {
        padding: Spacing.xl,
        paddingTop: Platform.OS === 'ios' ? 60 : 40,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.surface,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: Spacing.lg,
    },
    header: {
        alignItems: 'center',
        marginBottom: Spacing.xl,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: Spacing.md,
    },
    logo: {
        width: 48,
        height: 48,
        marginBottom: Spacing.sm,
    },
    logoTextRow: {
        flexDirection: 'row',
    },
    logoTitle: {
        fontSize: FontSize.lg,
        fontWeight: 'bold',
        color: Colors.yellow,
    },
    logoSubtitle: {
        fontSize: FontSize.lg,
        fontWeight: 'bold',
        color: Colors.purple,
    },
    welcomeText: {
        fontSize: FontSize.xxl,
        fontWeight: 'bold',
        color: Colors.text,
        marginTop: Spacing.sm,
    },
    subText: {
        fontSize: FontSize.md,
        color: Colors.textSecondary,
        marginTop: Spacing.xs,
    },
    form: {
        marginTop: Spacing.md,
    },
    inputContainer: {
        marginBottom: Spacing.md,
    },
    label: {
        fontSize: FontSize.sm,
        fontWeight: '600',
        color: Colors.text,
        marginBottom: Spacing.sm,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.surface,
        borderRadius: BorderRadius.md,
        paddingHorizontal: Spacing.md,
        height: 56,
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
    },
    registerButton: {
        backgroundColor: Colors.primary,
        borderRadius: BorderRadius.md,
        height: 56,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: Spacing.lg,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    registerButtonText: {
        color: Colors.white,
        fontSize: FontSize.md,
        fontWeight: 'bold',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: Spacing.xl,
        marginBottom: Spacing.xl,
    },
    footerText: {
        color: Colors.textSecondary,
        fontSize: FontSize.md,
    },
    loginLink: {
        color: Colors.accent,
        fontSize: FontSize.md,
        fontWeight: 'bold',
    },
});
