import { useEffect } from 'react';
import { View, Text, Image } from 'react-native';
import { router } from 'expo-router';
import { styles } from '@/styles/index.styles';

export default function LandingScreen() {


    useEffect(() => {
        const timer = setTimeout(() => {
            router.replace('/login');
        }, 2500);

        return () => clearTimeout(timer);
    }, []);


    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <Image
                    source={require('@/assets/images/logo.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />
            </View>
            <View style={styles.sub_container}>
                <Text style={styles.title}>Stellar</Text>
                <Text style={styles.subtitle}>Serve</Text>
            </View>
        </View>
    );
}


