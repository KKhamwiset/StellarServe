import React from 'react';
import { View, TouchableOpacity, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';

interface StarRatingProps {
    rating?: number;
    maxRating?: number;
    size?: number;
    color?: string;
    interactive?: boolean;
    onRatingChange?: (rating: number) => void;
    containerStyle?: ViewStyle;
    gap?: number;
}

export const StarRating: React.FC<StarRatingProps> = ({
    rating = 0,
    maxRating = 5,
    size = 16,
    color = Colors.star,
    interactive = false,
    onRatingChange,
    containerStyle,
    gap = 2,
}) => {
    return (
        <View style={[{ flexDirection: 'row', gap }, containerStyle]}>
            {Array.from({ length: maxRating }).map((_, i) => (
                <TouchableOpacity
                    key={i}
                    activeOpacity={interactive ? 0.7 : 1}
                    onPress={() => interactive && onRatingChange && onRatingChange(i + 1)}
                    disabled={!interactive}
                >
                    <Ionicons
                        name={i < rating ? "star" : "star-outline"}
                        size={size}
                        color={color}
                    />
                </TouchableOpacity>
            ))}
        </View>
    );
};
