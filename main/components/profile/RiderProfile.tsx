import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, Switch, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing } from '@/constants/theme';
import { styles } from '@/components/profile/SharedStyles';
import { ModalProps } from '@/components/ui/modal';
import { User } from '@/types/api';

interface Props {
    user: User;
    updating: boolean;
    onUpdateProfile: (data: Partial<User>) => Promise<void>;
}

export function RiderProfile({ user, updating, onUpdateProfile }: Props) {
    const [vehicleModalVisible, setVehicleModalVisible] = useState(false);
    const [editVehicle, setEditVehicle] = useState(user?.vehicle_type || '');
    const [isOnline, setIsOnline] = useState(true);

    return (
        <>
            <View style={styles.menuSection}>
                <TouchableOpacity style={styles.menuItem} onPress={() => setVehicleModalVisible(true)}>
                    <View style={styles.menuLeft}>
                        <Ionicons name="bicycle" size={20} color={Colors.textSecondary} />
                        <Text style={styles.menuLabel}>Vehicle Type</Text>
                    </View>
                    <View style={styles.menuRight}>
                        <Text style={styles.menuValue}>{user?.vehicle_type || 'Set vehicle'}</Text>
                        <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.menuItem} onPress={() => {
                        setIsOnline(!isOnline);
                        Alert.alert('Status changed', 'Working status toggled');
                    }} activeOpacity={1}>
                    <View style={styles.menuLeft}>
                        <Ionicons name="power" size={20} color={Colors.textSecondary} />
                        <Text style={styles.menuLabel}>Delivery Status</Text>
                    </View>
                    <View style={styles.menuRight}>
                        <Switch
                            value={isOnline}
                            onValueChange={(val) => {
                                setIsOnline(val);
                                Alert.alert('Status changed', 'Working status toggled');
                            }}
                            trackColor={{ false: Colors.border, true: Colors.success }}
                        />
                    </View>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.menuItem, styles.menuItemLast]} onPress={() => Alert.alert('Earnings', 'Earnings dashboard coming soon!')}>
                    <View style={styles.menuLeft}>
                        <Ionicons name="wallet-outline" size={20} color={Colors.textSecondary} />
                        <Text style={styles.menuLabel}>Earnings & History</Text>
                    </View>
                    <View style={styles.menuRight}>
                        <Text style={styles.menuValue}>฿0.00</Text>
                        <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
                    </View>
                </TouchableOpacity>
            </View>

            {vehicleModalVisible && (
                <ModalProps onClose={() => setVehicleModalVisible(false)} title="Vehicle Settings">
                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: Spacing.xl }}>
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Vehicle Type</Text>
                            <TextInput
                                style={styles.input}
                                value={editVehicle}
                                onChangeText={setEditVehicle}
                                placeholder="e.g. Motorcycle, Bicycle"
                            />
                        </View>
                        <TouchableOpacity
                            style={styles.saveButton}
                            activeOpacity={0.7}
                            disabled={updating}
                            onPress={async () => {
                                await onUpdateProfile({ vehicle_type: editVehicle });
                                setVehicleModalVisible(false);
                            }}
                        >
                            <Text style={styles.saveButtonText}>
                                {updating ? 'Saving...' : 'Save Vehicle Type'}
                            </Text>
                        </TouchableOpacity>
                    </ScrollView>
                </ModalProps>
            )}
        </>
    );
}
