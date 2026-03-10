import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
    ScrollView,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';
import { getCart, createOrder, Cart } from '@/services/api';
import { styles } from '@/styles/checkout.styles';

export default function CheckoutScreen() {
    const { restaurantId } = useLocalSearchParams<{ restaurantId: string }>();
    const [cart, setCart] = useState<Cart | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [notes, setNotes] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const data = await getCart();
            setCart(data);
        } catch (error) {
            console.error('Failed to load cart:', error);
            Alert.alert('Error', 'Failed to load checkout details.');
            router.back();
        } finally {
            setIsLoading(false);
        }
    };

    const handlePlaceOrder = async () => {
        if (!address.trim() || !phone.trim()) {
            Alert.alert('Missing Fields', 'Please enter your delivery address and phone number.');
            return;
        }

        if (!cart || !restaurantId) return;

        const itemsToCheckout = cart.items.filter(i => i.restaurant_id === restaurantId);
        if (itemsToCheckout.length === 0) return;

        setIsSubmitting(true);
        try {
            await createOrder({
                restaurant_id: restaurantId,
                items: itemsToCheckout.map(item => ({
                    menu_item_id: item.menu_item_id,
                    quantity: item.quantity
                })),
                delivery_address: address,
                phone: phone,
                notes: notes || undefined
            });
            Alert.alert('Success', 'Your order has been placed!', [
                { text: 'OK', onPress: () => router.replace('/(tabs)') }
            ]);
        } catch (error) {
            console.error('Checkout failed:', error);
            Alert.alert('Error', 'Failed to place order. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]} edges={['top']}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </SafeAreaView>
        );
    }

    const itemsToCheckout = cart?.items.filter(i => i.restaurant_id === restaurantId) || [];
    const subtotal = itemsToCheckout.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = 50;
    const total = subtotal + deliveryFee;

    if (itemsToCheckout.length === 0) {
        return (
            <SafeAreaView style={styles.container} edges={['top']}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color={Colors.text} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Checkout</Text>
                </View>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ color: Colors.textMuted }}>No items from this restaurant to checkout.</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={{ flex: 1 }}>
                        <View style={styles.header}>
                            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                                <Ionicons name="arrow-back" size={24} color={Colors.text} />
                            </TouchableOpacity>
                            <Text style={styles.headerTitle}>Checkout</Text>
                        </View>

                        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Delivery Details</Text>

                                <View style={styles.inputContainer}>
                                    <Text style={styles.label}>Delivery Address *</Text>
                                    <View style={styles.inputWrapper}>
                                        <Ionicons name="location-outline" size={20} color={Colors.textMuted} style={styles.inputIcon} />
                                        <TextInput
                                            style={styles.input}
                                            placeholder="123 Night St, Floor 4, Room B"
                                            placeholderTextColor={Colors.textMuted}
                                            value={address}
                                            onChangeText={setAddress}
                                        />
                                    </View>
                                </View>

                                <View style={styles.inputContainer}>
                                    <Text style={styles.label}>Phone Number *</Text>
                                    <View style={styles.inputWrapper}>
                                        <Ionicons name="call-outline" size={20} color={Colors.textMuted} style={styles.inputIcon} />
                                        <TextInput
                                            style={styles.input}
                                            placeholder="e.g. 0812345678"
                                            placeholderTextColor={Colors.textMuted}
                                            value={phone}
                                            onChangeText={setPhone}
                                            keyboardType="phone-pad"
                                        />
                                    </View>
                                </View>

                                <View style={styles.inputContainer}>
                                    <Text style={styles.label}>Special Instructions (Optional)</Text>
                                    <View style={[styles.inputWrapper, { alignItems: 'flex-start', paddingTop: 8 }]}>
                                        <Ionicons name="document-text-outline" size={20} color={Colors.textMuted} style={[styles.inputIcon, { marginTop: 4 }]} />
                                        <TextInput
                                            style={[styles.input, styles.textArea]}
                                            placeholder="Leave at front desk, extra spicy, etc."
                                            placeholderTextColor={Colors.textMuted}
                                            value={notes}
                                            onChangeText={setNotes}
                                            multiline
                                            numberOfLines={3}
                                        />
                                    </View>
                                </View>
                            </View>

                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Order Summary</Text>
                                {itemsToCheckout.map(item => (
                                    <View key={item.id} style={styles.summaryRow}>
                                        <Text style={styles.summaryLabel}>{item.quantity}x {item.name}</Text>
                                        <Text style={styles.summaryValue}>฿{item.price * item.quantity}</Text>
                                    </View>
                                ))}

                                <View style={styles.totalRow}>
                                    <View style={styles.summaryRow}>
                                        <Text style={styles.summaryLabel}>Subtotal</Text>
                                        <Text style={styles.summaryValue}>฿{subtotal}</Text>
                                    </View>
                                    <View style={styles.summaryRow}>
                                        <Text style={styles.summaryLabel}>Delivery Fee</Text>
                                        <Text style={styles.summaryValue}>฿{deliveryFee}</Text>
                                    </View>
                                    <View style={[styles.summaryRow, { marginTop: 8 }]}>
                                        <Text style={styles.totalLabel}>Total</Text>
                                        <Text style={styles.totalValue}>฿{total}</Text>
                                    </View>
                                </View>
                            </View>

                        </ScrollView>

                        <View style={styles.footer}>
                            <TouchableOpacity
                                style={[styles.checkoutButton, isSubmitting && styles.disabledButton]}
                                onPress={handlePlaceOrder}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <ActivityIndicator color={Colors.white} />
                                ) : (
                                    <Text style={styles.checkoutButtonText}>Place Order (฿{total})</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
