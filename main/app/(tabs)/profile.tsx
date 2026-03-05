import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/theme';
import { API_BASE_URL, API_ENDPOINTS } from '@/constants/api';

const MENU_ITEMS = [
    { icon: 'location', label: 'Delivery Address', value: 'Set your address' },
    { icon: 'card', label: 'Payment Methods', value: 'Add payment' },
    { icon: 'notifications', label: 'Notifications', value: 'Enabled' },
    { icon: 'moon', label: 'Dark Mode', value: 'Always on' },
    { icon: 'language', label: 'Language', value: 'English' },
    { icon: 'help-circle', label: 'Help & Support', value: '' },
    { icon: 'document-text', label: 'Terms of Service', value: '' },
    { icon: 'log-out', label: 'Sign Out', value: '', danger: true },
];

export default function ProfileScreen() {
    const handleLogout = async () => {
        try {
            await fetch(`${API_BASE_URL}${API_ENDPOINTS.auth.logout}`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({})
            });
            router.replace('/login');
        } catch (err) {
            console.error('Logout failed:', err);
        }
    };

    const handleItemPress = (item: any) => {
        if (item.label === 'Sign Out') {
            handleLogout();
        }
    };

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Profile Header */}
            <View style={styles.profileHeader}>
                <View style={styles.avatar}>
                    <Ionicons name="person" size={40} color={Colors.primary} />
                </View>
                <View style={styles.profileInfo}>
                    <Text style={styles.profileName}>Guest User</Text>
                    <Text style={styles.profileEmail}>Sign in to get started</Text>
                </View>
                <TouchableOpacity style={styles.editButton} activeOpacity={0.7}>
                    <Ionicons name="create" size={18} color={Colors.primary} />
                </TouchableOpacity>
            </View>

            {/* Stats row */}
            <View style={styles.statsRow}>
                <View style={styles.statItem}>
                    <Text style={styles.statValue}>0</Text>
                    <Text style={styles.statLabel}>Orders</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                    <Text style={styles.statValue}>0</Text>
                    <Text style={styles.statLabel}>Favorites</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                    <Text style={styles.statValue}>฿0</Text>
                    <Text style={styles.statLabel}>Spent</Text>
                </View>
            </View>

            {/* Menu List */}
            <View style={styles.menuSection}>
                {MENU_ITEMS.map((item, i) => (
                    <TouchableOpacity
                        key={i}
                        style={[styles.menuItem, i === MENU_ITEMS.length - 1 && styles.menuItemLast]}
                        activeOpacity={0.7}
                        onPress={() => handleItemPress(item)}
                    >
                        <View style={styles.menuLeft}>
                            <Ionicons
                                name={item.icon as any}
                                size={20}
                                color={(item as any).danger ? Colors.error : Colors.textSecondary}
                            />
                            <Text style={[styles.menuLabel, (item as any).danger && styles.menuLabelDanger]}>
                                {item.label}
                            </Text>
                        </View>
                        <View style={styles.menuRight}>
                            {item.value ? (
                                <Text style={styles.menuValue}>{item.value}</Text>
                            ) : null}
                            <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
                        </View>
                    </TouchableOpacity>
                ))}
            </View>

            <Text style={styles.version}>StellaServe v0.1.0</Text>
            <View style={{ height: 32 }} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    profileHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Spacing.lg,
        paddingTop: Spacing.xl,
        paddingBottom: Spacing.lg,
        gap: Spacing.md,
    },
    avatar: {
        width: 72,
        height: 72,
        borderRadius: BorderRadius.full,
        backgroundColor: Colors.surfaceLight,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: Colors.primary,
    },
    profileInfo: {
        flex: 1,
    },
    profileName: {
        fontSize: FontSize.xl,
        fontWeight: '700',
        color: Colors.text,
    },
    profileEmail: {
        fontSize: FontSize.sm,
        color: Colors.textSecondary,
        marginTop: 2,
    },
    editButton: {
        width: 40,
        height: 40,
        borderRadius: BorderRadius.full,
        backgroundColor: Colors.surfaceLight,
        justifyContent: 'center',
        alignItems: 'center',
    },
    statsRow: {
        flexDirection: 'row',
        marginHorizontal: Spacing.lg,
        backgroundColor: Colors.card,
        borderRadius: BorderRadius.lg,
        padding: Spacing.md,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statValue: {
        fontSize: FontSize.xl,
        fontWeight: '700',
        color: Colors.primary,
    },
    statLabel: {
        fontSize: FontSize.xs,
        color: Colors.textSecondary,
        marginTop: 2,
    },
    statDivider: {
        width: 1,
        backgroundColor: Colors.border,
    },
    menuSection: {
        marginTop: Spacing.lg,
        marginHorizontal: Spacing.lg,
        backgroundColor: Colors.card,
        borderRadius: BorderRadius.lg,
        borderWidth: 1,
        borderColor: Colors.border,
        overflow: 'hidden',
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.md,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    menuItemLast: {
        borderBottomWidth: 0,
    },
    menuLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.md,
    },
    menuLabel: {
        fontSize: FontSize.md,
        color: Colors.text,
    },
    menuLabelDanger: {
        color: Colors.error,
    },
    menuRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.xs,
    },
    menuValue: {
        fontSize: FontSize.sm,
        color: Colors.textMuted,
    },
    version: {
        textAlign: 'center',
        color: Colors.textMuted,
        fontSize: FontSize.xs,
        marginTop: Spacing.xl,
    },
});
