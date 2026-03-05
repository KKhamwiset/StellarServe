import { useEffect } from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import { router } from 'expo-router';
import { Colors } from '@/constants/theme';

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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
        alignItems: 'center',
        justifyContent: 'center',
    },
    sub_container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo: {
        width: 86,
        height: 86,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.yellow,
    },
    subtitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.purple,
    },
});
