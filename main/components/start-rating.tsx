import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/theme';


export function StarRating({ count = 5 }: { count?: number }) {
    return (
        <View style={{ flexDirection: 'row', gap: 2 }}>
            {Array.from({ length: 5 }).map((_, i) => (
                (i + 1 <= count) ? (
                    <Ionicons key={i} name="star" size={14} color={Colors.star} />
                ) : (
                    <Ionicons key={i} name="star-outline" size={14} color={Colors.textMuted} />
                )
            ))}
        </View>
    );
}