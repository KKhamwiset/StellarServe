import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ExpoImagePicker from 'expo-image-picker';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/theme';

interface ImagePickerProps {
    image: string | null;
    onImageSelect: (url: string) => void;
    aspect?: [number, number];
}

export function ImagePicker({ image, onImageSelect, aspect = [4, 3] }: ImagePickerProps) {
    const [uploading, setUploading] = useState(false);

    const pickImage = async () => {
        const result = await ExpoImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect,
            quality: 1,
            base64: true
        });

        if (!result.canceled) {
            return result.assets[0];
        }
    };

    const uploadToImgBB = async (base64: string) => {
        const API_KEY = process.env.EXPO_PUBLIC_IMG_API;
        const formData = new FormData();
        formData.append("image", base64);

        const res = await fetch(
            `https://api.imgbb.com/1/upload?key=${API_KEY}`,
            {
                method: "POST",
                body: formData,
            }
        );

        const data = await res.json();
        return data.data.url;
    };

    const handleImage = async () => {
        try {
            const pickedImage = await pickImage();
            if (!pickedImage || !pickedImage.base64) return;

            setUploading(true);
            const url = await uploadToImgBB(pickedImage.base64);
            onImageSelect(url);
        } catch (error) {
            console.error("Image upload failed:", error);
            alert("Failed to upload image");
        } finally {
            setUploading(false);
        }
    };

    return (
        <TouchableOpacity
            style={styles.imagePicker}
            onPress={handleImage}
            disabled={uploading}
        >
            {uploading ? (
                <View style={styles.imagePlaceholder}>
                    <ActivityIndicator color={Colors.primary} size="large" />
                    <Text style={styles.imagePlaceholderText}>Uploading...</Text>
                </View>
            ) : image ? (
                <View style={styles.imagePreviewContainer}>
                    <Image source={{ uri: image }} style={styles.imagePreview} />
                    <View style={styles.imageOverlay}>
                        <Ionicons name="camera" size={20} color={Colors.white} />
                    </View>
                </View>
            ) : (
                <View style={styles.imagePlaceholder}>
                    <Ionicons name="add" size={24} color={Colors.textMuted} />
                    <Text style={styles.imagePlaceholderText}>Add Photo</Text>
                </View>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    imagePicker: {
        height: 160,
        backgroundColor: Colors.surface,
        borderRadius: BorderRadius.md,
        borderWidth: 1,
        borderColor: Colors.border,
        borderStyle: 'dashed',
        overflow: 'hidden',
    },
    imagePlaceholder: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imagePlaceholderText: {
        fontSize: FontSize.xs,
        color: Colors.textMuted,
        marginTop: Spacing.xs,
    },
    imagePreviewContainer: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    imagePreview: {
        width: '100%',
        height: '100%',
    },
    imageOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        opacity: 0,
    },
});
