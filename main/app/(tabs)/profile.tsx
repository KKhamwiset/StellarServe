import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors } from '@/constants/theme';
import { API_BASE_URL, API_ENDPOINTS } from '@/constants/api';
import { styles } from '@/styles/profile.styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { User, Token } from '@/types/api';
import { SafeAreaView } from 'react-native-safe-area-context';


const ITEMS = [
    { icon: 'location', label: 'Delivery Address', value: 'Set your address' },
    { icon: 'card', label: 'Payment Methods', value: 'Add payment' },
    { icon: 'notifications', label: 'Notifications', value: 'Enabled' },
    { icon: 'log-out', label: 'Sign Out', value: '', danger: true },
];



export default function ProfileScreen() {
    const [user, setUser] = useState<User | null>(null);
    useEffect(() => {
        const getUser = async () => {
            const user = await AsyncStorage.getItem('user');
            if (user) {
                setUser(JSON.parse(user));
            }
        };
        getUser();
    }, []);
    const handleLogout = async () => {
        try {
            const authToken = await AsyncStorage.getItem("userToken")
            const logOut = await fetch(`${API_BASE_URL}${API_ENDPOINTS.auth.logout}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${authToken}`
                },
            });
            if (logOut.ok) {
                await AsyncStorage.removeItem('user');
                await AsyncStorage.removeItem('userToken');
                router.replace('/login');
            }
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
        <SafeAreaView style={styles.container} edges={['top']}>
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                {/* Profile Header */}
                <View style={styles.profileHeader}>
                    <View style={styles.avatar}>
                        <Ionicons name="person" size={40} color={Colors.primary} />
                    </View>
                    <View style={styles.profileInfo}>
                        <Text style={styles.profileName}>{user?.full_name}</Text>
                        <Text style={styles.profileEmail}>{user?.email}</Text>
                    </View>
                    <TouchableOpacity style={styles.editButton} activeOpacity={0.7}>
                        <Ionicons name="create" size={18} color={Colors.primary} />
                    </TouchableOpacity>
                </View>


                {/* Menu List */}
                <View style={styles.menuSection}>
                    {ITEMS.map((item, i) => (
                        <TouchableOpacity
                            key={i}
                            style={[styles.menuItem, i === ITEMS.length - 1 && styles.menuItemLast]}
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
        </SafeAreaView>
    );
}


