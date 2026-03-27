import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing } from '@/constants/theme';
import { styles } from '@/components/profile/SharedStyles';
import { ModalProps } from '@/components/ui/modal';
import { User, Restaurant } from '@/types/api';
import { ImagePicker } from '@/components/ui/image-picker';

interface Props {
    user: User;
    restaurant: Restaurant | null;
    updating: boolean;
    onUpdateProfile: (data: Partial<User>) => Promise<void>;
    onUpdateRestaurant: (data: Partial<Restaurant>, showSuccess?: boolean) => Promise<void>;
    onToggleShop: (isOpen: boolean) => void;
}

export function SellerProfile({ user, restaurant, updating, onUpdateProfile, onUpdateRestaurant, onToggleShop }: Props) {
    const [addressModalVisible, setAddressModalVisible] = useState(false);
    const [editAddress, setEditAddress] = useState(user?.address || '');

    const [restaurantModalVisible, setRestaurantModalVisible] = useState(false);
    const [editRestaurantName, setEditRestaurantName] = useState(restaurant?.name || '');
    const [editRestaurantDescription, setEditRestaurantDescription] = useState(restaurant?.description || '');
    const [editRestaurantImageUrl, setEditRestaurantImageUrl] = useState<string | null>(restaurant?.image_url || null);

    useEffect(() => {
        if (restaurant) {
            setEditRestaurantName(restaurant.name || '');
            setEditRestaurantDescription(restaurant.description || '');
            setEditRestaurantImageUrl(restaurant.image_url || null);
        }
    }, [restaurant]);

    return (
        <>
            <View style={styles.menuSection}>
                <TouchableOpacity style={styles.menuItem} onPress={() => setAddressModalVisible(true)}>
                    <View style={styles.menuLeft}>
                        <Ionicons name="location" size={20} color={Colors.textSecondary} />
                        <Text style={styles.menuLabel}>Address</Text>
                    </View>
                    <View style={styles.menuRight}>
                        <Text style={styles.menuValue}>{user?.address || 'Set your address'}</Text>
                        <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
                    </View>
                </TouchableOpacity>

                {restaurant && (
                    <>
                        <TouchableOpacity style={styles.menuItem} activeOpacity={1}>
                            <View style={styles.menuLeft}>
                                <Ionicons name="storefront" size={20} color={Colors.textSecondary} />
                                <Text style={styles.menuLabel}>Shop is Open</Text>
                            </View>
                            <View style={styles.menuRight}>
                                <Switch
                                    value={restaurant.is_open}
                                    onValueChange={(val) => onToggleShop(val)}
                                    trackColor={{ false: Colors.border, true: Colors.success }}
                                />
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.menuItem, styles.menuItemLast]} onPress={() => setRestaurantModalVisible(true)}>
                            <View style={styles.menuLeft}>
                                <Ionicons name="restaurant-outline" size={20} color={Colors.textSecondary} />
                                <Text style={styles.menuLabel}>Restaurant Settings</Text>
                            </View>
                            <View style={styles.menuRight}>
                                <Text style={styles.menuValue}>Manage</Text>
                                <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
                            </View>
                        </TouchableOpacity>
                    </>
                )}
            </View>

            {addressModalVisible && (
                <ModalProps onClose={() => setAddressModalVisible(false)} title="Delivery Address">
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
                            onPress={async () => {
                                await onUpdateProfile({ address: editAddress });
                                setAddressModalVisible(false);
                            }}
                        >
                            <Text style={styles.saveButtonText}>
                                {updating ? 'Saving...' : 'Save Address'}
                            </Text>
                        </TouchableOpacity>
                    </ScrollView>
                </ModalProps>
            )}

            {restaurantModalVisible && (
                <ModalProps
                    onClose={() => setRestaurantModalVisible(false)}
                    title="Restaurant Settings"
                >
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: Spacing.xl }}>
                        <ImagePicker
                            image={editRestaurantImageUrl}
                            onImageSelect={(url) => {
                                onUpdateRestaurant({ image_url: url }, false);
                                setEditRestaurantImageUrl(url);
                            }}
                        />
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Restaurant Name</Text>
                            <TextInput
                                style={styles.input}
                                value={editRestaurantName}
                                onChangeText={setEditRestaurantName}
                                placeholder="Enter restaurant name"
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Description</Text>
                            <TextInput
                                style={styles.input}
                                value={editRestaurantDescription}
                                onChangeText={setEditRestaurantDescription}
                                placeholder="Brief description about your restaurant"
                                multiline
                                numberOfLines={4}
                            />
                        </View>
                        <TouchableOpacity
                            style={styles.saveButton}
                            activeOpacity={0.7}
                            disabled={updating}
                            onPress={async () => {
                                await onUpdateRestaurant({
                                    name: editRestaurantName,
                                    description: editRestaurantDescription,
                                    image_url: editRestaurantImageUrl
                                });
                                setRestaurantModalVisible(false);
                            }}
                        >
                            <Text style={styles.saveButtonText}>
                                {updating ? 'Saving...' : 'Save Restaurant Details'}
                            </Text>
                        </TouchableOpacity>
                    </ScrollView>
                </ModalProps>
            )}
        </>
    );
}
