import { StyleSheet } from 'react-native';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/theme';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    inner: {
        flex: 1,
        padding: Spacing.xl,
        justifyContent: 'center',
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
    header: {
        alignItems: 'center',
        marginBottom: Spacing.xxl,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: Spacing.md,
    },
    logo: {
        width: 64,
        height: 64,
        marginBottom: Spacing.sm,
    },
    logoTextRow: {
        flexDirection: 'row',
    },
    logoTitle: {
        fontSize: FontSize.xl,
        fontWeight: 'bold',
        color: Colors.yellow,
    },
    logoSubtitle: {
        fontSize: FontSize.xl,
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
        marginTop: Spacing.lg,
    },
    inputContainer: {
        marginBottom: Spacing.lg,
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
    forgotPassword: {
        alignSelf: 'flex-end',
        marginTop: Spacing.sm,
    },
    forgotPasswordText: {
        color: Colors.accent,
        fontSize: FontSize.sm,
        fontWeight: '600',
    },
    loginButton: {
        backgroundColor: Colors.primary,
        borderRadius: BorderRadius.md,
        height: 56,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: Spacing.xl,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    loginButtonText: {
        color: Colors.white,
        fontSize: FontSize.md,
        fontWeight: 'bold',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: Spacing.xxl,
    },
    footerText: {
        color: Colors.textSecondary,
        fontSize: FontSize.md,
    },
    registerLink: {
        color: Colors.accent,
        fontSize: FontSize.md,
        fontWeight: 'bold',
    },
});
