import { View, Text, ScrollView, TouchableOpacity, Image, TextInput, Switch, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors, Spacing, BorderRadius, FontSize } from '@/constants/theme';
import { API_BASE_URL, API_ENDPOINTS } from '@/constants/api';
import { styles as defaultStyles } from '@/styles/profile.styles';
import { StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { User, Restaurant } from '@/types/api';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ModalProps } from '@/components/ui/modal';
import { ImagePicker } from '@/components/ui/image-picker';
import { getMyRestaurant } from '@/services/api';
import { SuccessModal } from '@/components/ui/success-modal';

const styles = StyleSheet.create({
    ...defaultStyles,
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

export default function ProfileScreen() {
    const [user, setUser] = useState<User | null>(null);
    const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [addressModalVisible, setAddressModalVisible] = useState(false);

    // Edit state
    const [editName, setEditName] = useState('');
    const [editAddress, setEditAddress] = useState('');
    const [editVehicle, setEditVehicle] = useState('');
    const [updating, setUpdating] = useState(false);
    const [successModalVisible, setSuccessModalVisible] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        const loadProfileData = async () => {
            const userStr = await AsyncStorage.getItem('user');
            if (userStr) {
                const u = JSON.parse(userStr);
                setUser(u);
                setEditName(u.full_name || '');
                setEditAddress(u.address || '');
                setEditVehicle(u.vehicle_type || '');

                if (u.role === 'seller') {
                    try {
                        const rest = await getMyRestaurant();
                        setRestaurant(rest);
                    } catch (e) {
                        console.error("Seller doesn't have a restaurant yet or api failed", e);
                    }
                }
            }
        };
        loadProfileData();
    }, []);

    const handleLogout = async () => {
        try {
            const authToken = await AsyncStorage.getItem("userToken");
            const logOut = await fetch(`${API_BASE_URL}${API_ENDPOINTS.auth.logout}`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${authToken}` },
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

    const handleUpdateProfileData = async (fieldsToUpdate: Partial<User>) => {
        if (!user) return;
        setUpdating(true);
        try {
            const token = await AsyncStorage.getItem('userToken');
            const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.auth.me}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(fieldsToUpdate)
            });
            if (res.ok) {
                const updatedUser = await res.json();
                setUser(updatedUser);
                await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
                setModalVisible(false);
                setAddressModalVisible(false);
                setSuccessMessage('Profile updated successfully!');
                setSuccessModalVisible(true);
            } else {
                Alert.alert('Error', 'Failed to update profile');
            }
        } catch (error) {
            console.error('Update profile error:', error);
            Alert.alert('Error', 'Something went wrong');
        } finally {
            setUpdating(false);
        }
    };

    const handleToggleShop = async (val: boolean) => {
        if (!restaurant) return;
        try {
            const token = await AsyncStorage.getItem('userToken');
            const res = await fetch(`${API_BASE_URL}/api/restaurants/${restaurant.id}/status?is_open=${val}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            if (res.ok) {
                setRestaurant(await res.json());
                setSuccessMessage('Shop status updated successfully!');
                setSuccessModalVisible(true);
            } else {
                Alert.alert('Error', 'Failed to update shop status');
            }
        } catch (e) {
            console.error(e);
            Alert.alert('Error', 'Failed to update shop status');
        }
    };

    const getMenuItems = () => {
        const role = user?.role || 'consumer';
        const items: Array<{
            id: string;
            icon: string;
            label: string;
            value: string;
            action: () => void;
            isToggle?: boolean;
            toggleValue?: boolean;
            danger?: boolean;
        }> = [];
        if (role === 'consumer' || role === 'seller') {
            items.push(
                {
                    id: 'address', icon: 'location', label: 'Address',
                    value: user?.address || 'Set your address', action: () => setAddressModalVisible(true)
                }
            )
        }
        if (role === 'consumer') {
            items.push({ id: 'payment', icon: 'card', label: 'Payment Methods', value: 'Manage', action: () => router.push('/payment') });
        } else if (role === 'seller' && restaurant) {
            items.push({
                id: 'shop_toggle',
                icon: 'storefront',
                label: 'Shop is Open',
                value: restaurant.is_open ? 'Yes' : 'No',
                action: () => handleToggleShop(!restaurant.is_open),
                isToggle: true,
                toggleValue: restaurant.is_open
            });
        } else if (role === 'rider') {
            items.push({ id: 'vehicle', icon: 'bicycle', label: 'Vehicle Type', value: user?.vehicle_type || 'Set vehicle', action: () => setModalVisible(true) });
        }

        items.push({ id: 'logout', icon: 'log-out', label: 'Sign Out', value: '', danger: true, action: handleLogout });

        return items;
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
                {/* Profile Header */}
                <View style={styles.profileHeader}>
                    <View style={styles.avatar}>
                        {user?.image_url ? (
                            <Image
                                source={{ uri: user.image_url }}
                                style={styles.avatarImage}
                                resizeMode="cover"
                            />
                        ) : (
                            <Ionicons name="person" size={40} color={Colors.primary} />
                        )}
                    </View>
                    <View style={styles.profileInfo}>
                        <Text style={styles.profileName}>{user?.full_name}</Text>
                        <Text style={styles.profileEmail}>{user?.email}</Text>
                    </View>
                    <TouchableOpacity style={styles.editButton} activeOpacity={0.7}
                        onPress={() => setModalVisible(true)}
                    >
                        <Ionicons name="create" size={18} color={Colors.primary} />
                    </TouchableOpacity>
                </View>

                {modalVisible && (
                    <ModalProps
                        onClose={() => setModalVisible(false)}
                        title="Edit Profile"
                    >
                        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: Spacing.xl }}>
                            <ImagePicker
                                image={user?.image_url || null}
                                onImageSelect={(url) => handleUpdateProfileData({ image_url: url })}
                            />

                            <View style={styles.inputContainer}>
                                <Text style={styles.inputLabel}>Full Name</Text>
                                <TextInput
                                    style={styles.input}
                                    value={editName}
                                    onChangeText={setEditName}
                                    placeholder="Enter your name"
                                />
                            </View>

                            {user?.role === 'rider' && (
                                <View style={styles.inputContainer}>
                                    <Text style={styles.inputLabel}>Vehicle Type</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={editVehicle}
                                        onChangeText={setEditVehicle}
                                        placeholder="e.g. Motorcycle, Bicycle"
                                    />
                                </View>
                            )}

                            <TouchableOpacity
                                style={styles.saveButton}
                                activeOpacity={0.7}
                                disabled={updating}
                                onPress={() => handleUpdateProfileData({
                                    full_name: editName,
                                    ...(user?.role === 'rider' ? { vehicle_type: editVehicle } : {})
                                })}
                            >
                                <Text style={styles.saveButtonText}>
                                    {updating ? 'Saving...' : 'Save Profile'}
                                </Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </ModalProps>
                )}

                {addressModalVisible && (
                    <ModalProps
                        onClose={() => setAddressModalVisible(false)}
                        title="Delivery Address"
                    >
                        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: Spacing.xl }}>
                            <View style={styles.inputContainer}>
                                <Text style={styles.inputLabel}>Street Address</Text>
                                <TextInput
                                    style={styles.input}
                                    value={editAddress}
                                    onChangeText={setEditAddress}
                                    placeholder="Enter your full address"
                                    multiline
                                    numberOfLines={3}
                                />
                            </View>

                            <TouchableOpacity
                                style={styles.saveButton}
                                activeOpacity={0.7}
                                disabled={updating}
                                onPress={() => handleUpdateProfileData({
                                    address: editAddress,
                                })}
                            >
                                <Text style={styles.saveButtonText}>
                                    {updating ? 'Saving...' : 'Save Address'}
                                </Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </ModalProps>
                )}

                {/* Menu List */}
                <View style={styles.menuSection}>
                    {getMenuItems().map((item, i, arr) => (
                        <TouchableOpacity
                            key={item.id}
                            style={[styles.menuItem, i === arr.length - 1 && styles.menuItemLast]}
                            activeOpacity={item.isToggle ? 1 : 0.7}
                            onPress={item.action}
                        >
                            <View style={styles.menuLeft}>
                                <Ionicons
                                    name={item.icon as any}
                                    size={20}
                                    color={item.danger ? Colors.error : Colors.textSecondary}
                                />
                                <Text style={[styles.menuLabel, item.danger && styles.menuLabelDanger]}>
                                    {item.label}
                                </Text>
                            </View>
                            <View style={styles.menuRight}>
                                {item.isToggle ? (
                                    <Switch
                                        value={item.toggleValue}
                                        onValueChange={item.action}
                                        trackColor={{ false: Colors.border, true: Colors.success }}
                                    />
                                ) : (
                                    <>
                                        {item.value ? <Text style={styles.menuValue}>{item.value}</Text> : null}
                                        <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
                                    </>
                                )}
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>

                <Text style={styles.version}>StellaServe v0.1.0</Text>
                <View style={{ height: 32 }} />
            </ScrollView>

            <SuccessModal
                visible={successModalVisible}
                message={successMessage}
                onClose={() => setSuccessModalVisible(false)}
            />
        </SafeAreaView>
    );
}


