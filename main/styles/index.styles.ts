import { StyleSheet } from 'react-native';
import { Colors } from '@/constants/theme';

export const styles = StyleSheet.create({
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
