import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
    Image,
    ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { API_BASE_URL, API_ENDPOINTS } from '@/constants/api';
import { styles, roleSelectorStyles } from '@/styles/register.styles';

export default function RegisterScreen() {
    const [fullName, setFullName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [role, setRole] = useState<'consumer' | 'seller' | 'rider'>('consumer');
    const [restaurantName, setRestaurantName] = useState('');
    const [vehicleType, setVehicleType] = useState<'motorcycle' | 'bicycle' | 'car'>('motorcycle');

    const handleRegister = async () => {
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setError(null);
        setIsLoading(true);

        const payload = {
            full_name: fullName,
            username: username,
            email: email,
            phone: phone,
            password: password,
            role: role,
            ...(role === 'seller' && { restaurant_name: restaurantName }),
            ...(role === 'rider' && { vehicle_type: vehicleType }),
        }

        try {
            const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.auth.register}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ detail: `Server Error (${response.status})` }));
                setError(errorData.detail || "Registration failed");
                return;
            }

            const data = await response.json();
            router.replace('/login');
        } catch (err) {
            setError(`Cannot connect to server. Please check your network. Error: ${err}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color={Colors.text} />
                    </TouchableOpacity>

                    <View style={styles.header}>
                        <View style={styles.logoContainer}>
                            <Image
                                source={require('@/assets/images/logo.png')}
                                style={styles.logo}
                                resizeMode="contain"
                            />
                            <View style={styles.logoTextRow}>
                                <Text style={styles.logoTitle}>Stellar</Text>
                                <Text style={styles.logoSubtitle}>Serve</Text>
                            </View>
                        </View>
                        <Text style={styles.welcomeText}>Create Account</Text>
                        <Text style={styles.subText}>Join our night-time dining community</Text>
                    </View>

                    <View style={styles.form}>
                        {/* Role Selector */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>I want to join as</Text>
                            <View style={roleSelectorStyles.container}>
                                <TouchableOpacity
                                    style={[
                                        roleSelectorStyles.option,
                                        role === 'consumer' && roleSelectorStyles.optionActive,
                                    ]}
                                    onPress={() => setRole('consumer')}
                                    activeOpacity={0.7}
                                >
                                    <Ionicons
                                        name="person-outline"
                                        size={20}
                                        color={role === 'consumer' ? Colors.white : Colors.textMuted}
                                    />
                                    <Text style={[
                                        roleSelectorStyles.optionText,
                                        role === 'consumer' && roleSelectorStyles.optionTextActive,
                                    ]}>Consumer</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[
                                        roleSelectorStyles.option,
                                        role === 'seller' && roleSelectorStyles.optionActive,
                                    ]}
                                    onPress={() => setRole('seller')}
                                    activeOpacity={0.7}
                                >
                                    <Ionicons
                                        name="storefront-outline"
                                        size={20}
                                        color={role === 'seller' ? Colors.white : Colors.textMuted}
                                    />
                                    <Text style={[
                                        roleSelectorStyles.optionText,
                                        role === 'seller' && roleSelectorStyles.optionTextActive,
                                    ]}>Seller</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[
                                        roleSelectorStyles.option,
                                        role === 'rider' && roleSelectorStyles.optionActive,
                                    ]}
                                    onPress={() => setRole('rider')}
                                    activeOpacity={0.7}
                                >
                                    <Ionicons
                                        name="bicycle-outline"
                                        size={20}
                                        color={role === 'rider' ? Colors.white : Colors.textMuted}
                                    />
                                    <Text style={[
                                        roleSelectorStyles.optionText,
                                        role === 'rider' && roleSelectorStyles.optionTextActive,
                                    ]}>Rider</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Full Name</Text>
                            <View style={styles.inputWrapper}>
                                <Ionicons name="person-outline" size={20} color={Colors.textMuted} style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="John Doe"
                                    placeholderTextColor={Colors.textMuted}
                                    value={fullName}
                                    onChangeText={setFullName}
                                />
                            </View>
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Username</Text>
                            <View style={styles.inputWrapper}>
                                <Ionicons name="at-outline" size={20} color={Colors.textMuted} style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="johndoe123"
                                    placeholderTextColor={Colors.textMuted}
                                    value={username}
                                    onChangeText={setUsername}
                                    autoCapitalize="none"
                                />
                            </View>
                        </View>

                        {role === 'seller' && (
                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Restaurant Name</Text>
                                <View style={styles.inputWrapper}>
                                    <Ionicons name="restaurant-outline" size={20} color={Colors.textMuted} style={styles.inputIcon} />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="My Restaurant"
                                        placeholderTextColor={Colors.textMuted}
                                        value={restaurantName}
                                        onChangeText={setRestaurantName}
                                    />
                                </View>
                            </View>
                        )}

                        {role === 'rider' && (
                            <View style={styles.inputContainer}>
                                <Text style={styles.label}>Vehicle Type</Text>
                                <View style={roleSelectorStyles.container}>
                                    <TouchableOpacity
                                        style={[
                                            roleSelectorStyles.option,
                                            vehicleType === 'motorcycle' && roleSelectorStyles.optionActive,
                                        ]}
                                        onPress={() => setVehicleType('motorcycle')}
                                        activeOpacity={0.7}
                                    >
                                        <Ionicons
                                            name="speedometer-outline"
                                            size={18}
                                            color={vehicleType === 'motorcycle' ? Colors.white : Colors.textMuted}
                                        />
                                        <Text style={[
                                            roleSelectorStyles.optionText,
                                            vehicleType === 'motorcycle' && roleSelectorStyles.optionTextActive,
                                        ]}>Motorcycle</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[
                                            roleSelectorStyles.option,
                                            vehicleType === 'bicycle' && roleSelectorStyles.optionActive,
                                        ]}
                                        onPress={() => setVehicleType('bicycle')}
                                        activeOpacity={0.7}
                                    >
                                        <Ionicons
                                            name="bicycle-outline"
                                            size={18}
                                            color={vehicleType === 'bicycle' ? Colors.white : Colors.textMuted}
                                        />
                                        <Text style={[
                                            roleSelectorStyles.optionText,
                                            vehicleType === 'bicycle' && roleSelectorStyles.optionTextActive,
                                        ]}>Bicycle</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[
                                            roleSelectorStyles.option,
                                            vehicleType === 'car' && roleSelectorStyles.optionActive,
                                        ]}
                                        onPress={() => setVehicleType('car')}
                                        activeOpacity={0.7}
                                    >
                                        <Ionicons
                                            name="car-outline"
                                            size={18}
                                            color={vehicleType === 'car' ? Colors.white : Colors.textMuted}
                                        />
                                        <Text style={[
                                            roleSelectorStyles.optionText,
                                            vehicleType === 'car' && roleSelectorStyles.optionTextActive,
                                        ]}>Car</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Email Address</Text>
                            <View style={styles.inputWrapper}>
                                <Ionicons name="mail-outline" size={20} color={Colors.textMuted} style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="name@example.com"
                                    placeholderTextColor={Colors.textMuted}
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                            </View>
                        </View>


                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Phone Number</Text>
                            <View style={styles.inputWrapper}>
                                <Ionicons name="call-outline" size={20} color={Colors.textMuted} style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="+66 81 234 5678"
                                    placeholderTextColor={Colors.textMuted}
                                    value={phone}
                                    onChangeText={setPhone}
                                    keyboardType="phone-pad"
                                />
                            </View>
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Password</Text>
                            <View style={styles.inputWrapper}>
                                <Ionicons name="lock-closed-outline" size={20} color={Colors.textMuted} style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Create a password"
                                    placeholderTextColor={Colors.textMuted}
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry={!showPassword}
                                />
                                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                    <Ionicons
                                        name={showPassword ? "eye-off-outline" : "eye-outline"}
                                        size={20}
                                        color={Colors.textMuted}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Confirm Password</Text>
                            <View style={styles.inputWrapper}>
                                <Ionicons name="lock-closed-outline" size={20} color={Colors.textMuted} style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Confirm your password"
                                    placeholderTextColor={Colors.textMuted}
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    secureTextEntry={!showPassword}
                                />
                            </View>
                        </View>

                    </View>

                    {error && (
                        <View style={styles.errorContainer}>
                            <Ionicons name="alert-circle-outline" size={16} color={Colors.error} />
                            <Text style={styles.errorText}>{error}</Text>
                        </View>
                    )}

                    <TouchableOpacity
                        style={[styles.registerButton, isLoading && styles.disabledButton]}
                        onPress={handleRegister}
                        disabled={isLoading}
                    >
                        <Text style={styles.registerButtonText}>
                            {isLoading ? "Creating Account..." : "Create Account"}
                        </Text>
                    </TouchableOpacity>

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>Already have an account? </Text>
                        <TouchableOpacity onPress={() => router.push('/login')}>
                            <Text style={styles.loginLink}>Sign In</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}

