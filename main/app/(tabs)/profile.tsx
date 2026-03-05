import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors } from '@/constants/theme';
import { API_BASE_URL, API_ENDPOINTS } from '@/constants/api';
import { styles } from '@/styles/profile.styles';

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


