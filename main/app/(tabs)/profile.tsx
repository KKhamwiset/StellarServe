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
import { ConsumerProfile } from '@/components/profile/ConsumerProfile';
import { SellerProfile } from '@/components/profile/SellerProfile';
import { RiderProfile } from '@/components/profile/RiderProfile';


export default function ProfileScreen() {
    const [user, setUser] = useState<User | null>(null);
    const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [addressModalVisible, setAddressModalVisible] = useState(false);

    // Edit user name inside profile.tsx
    const [editName, setEditName] = useState('');
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

    const handleUpdateRestaurant = async (details: Partial<Restaurant>, showSuccess = true) => {
        if (!restaurant) return;
        setUpdating(true);
        try {
            const token = await AsyncStorage.getItem('userToken');
            const res = await fetch(`${API_BASE_URL}/api/restaurants/${restaurant.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(details)
            });
            if (res.ok) {
                const updatedRest = await res.json();
                setRestaurant(updatedRest);
                if (showSuccess) {
                    setSuccessMessage('Restaurant updated successfully!');
                    setSuccessModalVisible(true);
                }
            } else {
                Alert.alert('Error', 'Failed to update restaurant');
            }
        } catch (error) {
            console.error('Update restaurant error:', error);
            Alert.alert('Error', 'Something went wrong');
        } finally {
            setUpdating(false);
        }
    };

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

    const handleUpdateProfileData = async (fieldsToUpdate: Partial<User>, showSuccess = true) => {
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

                if (showSuccess) {
                    setSuccessMessage('Profile updated successfully!');
                    setSuccessModalVisible(true);
                }
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
                                onImageSelect={(url) => handleUpdateProfileData({ image_url: url }, false)}
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

                            <TouchableOpacity
                                style={styles.saveButton}
                                activeOpacity={0.7}
                                disabled={updating}
                                onPress={async () => {
                                    await handleUpdateProfileData({ full_name: editName });
                                    setModalVisible(false);
                                }}
                            >
                                <Text style={styles.saveButtonText}>
                                    {updating ? 'Saving...' : 'Save Profile'}
                                </Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </ModalProps>
                )}

                {/* Sub Components Roles */}
                {user?.role === 'consumer' && (
                    <ConsumerProfile user={user} updating={updating} onUpdateProfile={handleUpdateProfileData} />
                )}

                {user?.role === 'seller' && (
                    <SellerProfile
                        user={user}
                        restaurant={restaurant}
                        updating={updating}
                        onUpdateProfile={handleUpdateProfileData}
                        onUpdateRestaurant={handleUpdateRestaurant}
                        onToggleShop={handleToggleShop}
                    />
                )}

                {user?.role === 'rider' && (
                    <RiderProfile user={user} updating={updating} onUpdateProfile={handleUpdateProfileData} />
                )}

                {/* Shared Logout Button */}
                <View style={styles.menuSection}>
                    <TouchableOpacity style={[styles.menuItem, styles.menuItemLast]} activeOpacity={0.7} onPress={handleLogout}>
                        <View style={styles.menuLeft}>
                            <Ionicons name="log-out" size={20} color={Colors.error} />
                            <Text style={[styles.menuLabel, styles.menuLabelDanger]}>Sign Out</Text>
                        </View>
                    </TouchableOpacity>
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

