import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, ScrollView } from 'react-native';
import { useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/theme';
import { MenuItem } from '@/types/api';
import { useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL, API_ENDPOINTS } from '@/constants/api';
import { SuccessModal } from './success-modal';

interface MenuModalProps {
    title: string;
    action: string;
    restaurantID: string | null;
    menu_data: MenuItem[] | MenuItem | null;
    loadMenu: () => void;
    onClose: () => void;
}

export function MenuModal(
    { title, action, restaurantID, menu_data, loadMenu, onClose }: MenuModalProps) {

    const [menu, setMenu] = useState(menu_data);
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [loading, setLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const isEdit = action === "Edit";
    const selectedItem = isEdit ? (menu_data as MenuItem) : null;

    useEffect(() => {
        if (isEdit && selectedItem) {
            setName(selectedItem.name);
            setPrice(selectedItem.price.toString());
            setDescription(selectedItem.description || '');
            setCategory(selectedItem.category || '');
        }
    }, [isEdit, selectedItem]);

    const resetItem = () => {
        setName('');
        setPrice('');
        setDescription('');
        setCategory('');
    }

    const handleAddItem = async () => {
        setLoading(true);
        try {
            const data = {
                name,
                price: parseFloat(price),
                description,
                category,
                is_available: true,
                restaurant_id: restaurantID
            }
            const token = await AsyncStorage.getItem('userToken');
            const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.menu(restaurantID!)}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            });

            if (res.ok) {
                setSuccessMsg("Menu item added successfully");
                setShowSuccess(true);
                resetItem();
                loadMenu();
            } else {
                const err = await res.json();
                alert(err.detail || "Failed to add item");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const handleEditItem = async () => {
        if (!selectedItem) return;
        setLoading(true);
        try {
            const data = {
                name,
                price: parseFloat(price),
                description,
                category,
                is_available: true,
                restaurant_id: restaurantID
            }
            const token = await AsyncStorage.getItem('userToken');
            const res = await fetch(`${API_BASE_URL}${API_ENDPOINTS.menu(restaurantID!)}/${selectedItem.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(data),
            });

            if (res.ok) {
                setSuccessMsg("Menu item updated successfully");
                setShowSuccess(true);
                loadMenu();

            } else {
                const err = await res.json();
                alert(err.detail || "Failed to update item");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    const handleAction = () => {
        if (isEdit) {
            handleEditItem();
        }
        else {
            handleAddItem();
        }
    };
    return (
        <Modal visible={true} transparent={true} animationType="fade">
            <TouchableOpacity
                style={modalStyle.overlay}
                activeOpacity={1}
                onPress={onClose}
            >
                <TouchableOpacity activeOpacity={1} style={modalStyle.card}>
                    {/* Header */}
                    <View style={modalStyle.header}>
                        <Text style={modalStyle.title}>{title}</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={24} color={Colors.text} />
                        </TouchableOpacity>
                    </View>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Name *</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Enter item name"
                                placeholderTextColor={Colors.textMuted}
                                value={name}
                                onChangeText={setName}
                            />
                        </View>

                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Price *</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="0.00"
                                placeholderTextColor={Colors.textMuted}
                                keyboardType="numeric"
                                value={price}
                                onChangeText={setPrice}
                            />
                        </View>

                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Description</Text>
                            <TextInput
                                style={[styles.input, styles.textArea]}
                                placeholder="What is this food?"
                                placeholderTextColor={Colors.textMuted}
                                multiline
                                numberOfLines={3}
                                value={description}
                                onChangeText={setDescription}
                            />
                        </View>

                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Category</Text>
                            <View style={styles.pickerContainer}>
                                <Picker
                                    selectedValue={category}
                                    onValueChange={(value) => setCategory(value)}
                                    style={styles.picker}
                                >
                                    <Picker.Item label="Select category" value="" />
                                    <Picker.Item label="Main" value="Main" />
                                    <Picker.Item label="Drinks" value="Drinks" />
                                    <Picker.Item label="Dessert" value="Dessert" />
                                    <Picker.Item label="Snack" value="Snack" />
                                </Picker>
                            </View>
                        </View>

                        <TouchableOpacity
                            style={[styles.submitButton, loading && { opacity: 0.6 }]}
                            activeOpacity={0.7}
                            onPress={handleAction}
                            disabled={loading}
                        >
                            <Text style={styles.submitButtonText}>
                                {loading ? 'Saving...' : (isEdit ? 'Update Item' : 'Add Item')}
                            </Text>
                        </TouchableOpacity>
                    </ScrollView>
                </TouchableOpacity>
            </TouchableOpacity>

            <SuccessModal
                visible={showSuccess}
                title="Success"
                message={successMsg}
                onClose={() => {
                    setShowSuccess(false);
                    onClose();
                }}
            />
        </Modal>
    );
}

const modalStyle = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    card: {
        backgroundColor: Colors.background,
        borderRadius: BorderRadius.xl,
        padding: Spacing.lg,
        width: '100%',
        maxHeight: '85%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.lg,
    },
    title: {
        fontSize: FontSize.xl,
        fontWeight: 'bold',
        color: Colors.text,
    },
});

const styles = StyleSheet.create({
    formGroup: {
        marginBottom: Spacing.md,
    },
    label: {
        fontSize: FontSize.sm,
        fontWeight: '600',
        color: Colors.text,
        marginBottom: Spacing.xs,
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
    textArea: {
        minHeight: 80,
        textAlignVertical: 'top',
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: BorderRadius.md,
        backgroundColor: Colors.surface,
        overflow: 'hidden',
    },
    picker: {
        color: Colors.text,
    },
    submitButton: {
        backgroundColor: Colors.primary,
        padding: Spacing.md,
        borderRadius: BorderRadius.md,
        alignItems: 'center',
        marginTop: Spacing.sm,
    },
    submitButtonText: {
        color: Colors.white,
        fontSize: FontSize.md,
        fontWeight: 'bold',
    },
});
