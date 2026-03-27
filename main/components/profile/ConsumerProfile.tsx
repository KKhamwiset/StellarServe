import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors, Spacing } from '@/constants/theme';
import { styles } from '@/components/profile/SharedStyles';
import { ModalProps } from '@/components/ui/modal';
import { User } from '@/types/api';

interface Props {
    user: User;
    updating: boolean;
    onUpdateProfile: (data: Partial<User>) => Promise<void>;
}

export function ConsumerProfile({ user, updating, onUpdateProfile }: Props) {
    const [addressModalVisible, setAddressModalVisible] = useState(false);
    const [editAddress, setEditAddress] = useState(user?.address || '');

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

                <TouchableOpacity style={[styles.menuItem, styles.menuItemLast]} onPress={() => router.push('/payment')}>
                    <View style={styles.menuLeft}>
                        <Ionicons name="card" size={20} color={Colors.textSecondary} />
                        <Text style={styles.menuLabel}>Payment Methods</Text>
                    </View>
                    <View style={styles.menuRight}>
                        <Text style={styles.menuValue}>Manage</Text>
                        <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
                    </View>
                </TouchableOpacity>
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
        </>
    );
}
