import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect, useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/theme';
import { getNotifications, markNotificationRead, markAllNotificationsRead } from '@/services/api';
import { Notification } from '@/types/api';

const TYPE_CONFIG: Record<string, { icon: string; color: string }> = {
    order_update: { icon: 'receipt-outline', color: Colors.info },
    new_order: { icon: 'bag-add-outline', color: Colors.accent },
    delivery: { icon: 'bicycle-outline', color: '#8B5CF6' },
};

function getTypeConfig(type: string) {
    return TYPE_CONFIG[type] ?? { icon: 'notifications-outline', color: Colors.textMuted };
}

function formatTimeAgo(iso: string) {
    const now = new Date();
    const date = new Date(iso);
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.floor(diffMs / 60000);

    if (diffMin < 1) return 'Just now';
    if (diffMin < 60) return `${diffMin}m ago`;

    const diffHr = Math.floor(diffMin / 60);
    if (diffHr < 24) return `${diffHr}h ago`;

    const diffDays = Math.floor(diffHr / 24);
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function NotificationsScreen() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const router = useRouter();

    const load = async () => {
        try {
            const data = await getNotifications();
            setNotifications(data);
        } catch (e) {
            console.error('Failed to load notifications:', e);
        } finally {
            setIsLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => { load(); }, []);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        load();
    }, []);

    const handleMarkRead = async (id: number) => {
        try {
            await markNotificationRead(id);
            setNotifications(prev =>
                prev.map(n => n.id === id ? { ...n, is_read: true } : n)
            );
        } catch (e) {
            console.error('Failed to mark as read:', e);
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await markAllNotificationsRead();
            setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
        } catch (e) {
            console.error('Failed to mark all as read:', e);
        }
    };

    const unreadCount = notifications.filter(n => !n.is_read).length;

    /* ─── Loading ──────────────────────────────────────── */
    if (isLoading) {
        return (
            <SafeAreaView style={[styles.container, styles.center]} edges={['top']}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </SafeAreaView>
        );
    }

    /* ─── Empty ────────────────────────────────────────── */
    if (notifications.length === 0) {
        return (
            <SafeAreaView style={[styles.container, styles.center]} edges={['top']}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButtonAbsolute}>
                    <Ionicons name="arrow-back" size={24} color={Colors.text} />
                </TouchableOpacity>
                <View style={styles.emptyIcon}>
                    <Ionicons name="notifications-off-outline" size={56} color={Colors.textMuted} />
                </View>
                <Text style={styles.emptyTitle}>No notifications</Text>
                <Text style={styles.emptySubtitle}>You're all caught up! Notifications will appear here.</Text>
            </SafeAreaView>
        );
    }

    /* ─── List ─────────────────────────────────────────── */
    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.headerSection}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm }}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color={Colors.text} />
                    </TouchableOpacity>
                    <Text style={styles.screenTitle}>Notifications</Text>
                </View>
                {unreadCount > 0 && (
                    <TouchableOpacity style={styles.markAllButton} onPress={handleMarkAllRead}>
                        <Ionicons name="checkmark-done-outline" size={18} color={Colors.info} />
                        <Text style={styles.markAllText}>Mark all read</Text>
                    </TouchableOpacity>
                )}
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 32 }}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            >
                {notifications.map((notification) => {
                    const tc = getTypeConfig(notification.type);
                    return (
                        <TouchableOpacity
                            key={notification.id}
                            style={[
                                styles.card,
                                !notification.is_read && styles.cardUnread,
                            ]}
                            onPress={() => !notification.is_read && handleMarkRead(notification.id)}
                            activeOpacity={0.7}
                        >
                            <View style={[styles.iconCircle, { backgroundColor: tc.color + '18' }]}>
                                <Ionicons name={tc.icon as any} size={22} color={tc.color} />
                            </View>

                            <View style={styles.cardContent}>
                                <View style={styles.cardTopRow}>
                                    <Text style={[
                                        styles.cardTitle,
                                        !notification.is_read && styles.cardTitleUnread,
                                    ]} numberOfLines={1}>
                                        {notification.title}
                                    </Text>
                                    <Text style={styles.timeText}>{formatTimeAgo(notification.created_at)}</Text>
                                </View>
                                <Text style={styles.cardMessage} numberOfLines={2}>
                                    {notification.message}
                                </Text>
                                {notification.order_id && (
                                    <View style={styles.orderTag}>
                                        <Ionicons name="receipt-outline" size={12} color={Colors.textMuted} />
                                        <Text style={styles.orderTagText}>#{notification.order_id}</Text>
                                    </View>
                                )}
                            </View>

                            {!notification.is_read && <View style={styles.unreadDot} />}
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </SafeAreaView>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center',
        gap: Spacing.sm,
    },
    headerSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: Spacing.lg,
        paddingTop: Spacing.md,
        paddingBottom: Spacing.sm,
    },
    screenTitle: {
        fontSize: FontSize.xl,
        fontWeight: '800',
        color: Colors.text,
    },
    backButton: {
        padding: 4,
    },
    backButtonAbsolute: {
        position: 'absolute',
        top: Spacing.md,
        left: Spacing.lg,
        padding: 4,
        zIndex: 10,
    },
    markAllButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: BorderRadius.full,
        backgroundColor: Colors.info + '12',
    },
    markAllText: {
        fontSize: FontSize.xs,
        fontWeight: '600',
        color: Colors.info,
    },

    emptyIcon: {
        marginBottom: Spacing.md,
    },
    emptyTitle: {
        fontSize: FontSize.lg,
        fontWeight: '700',
        color: Colors.text,
    },
    emptySubtitle: {
        fontSize: FontSize.sm,
        color: Colors.textMuted,
        textAlign: 'center',
        paddingHorizontal: Spacing.xl,
    },

    card: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginHorizontal: Spacing.lg,
        marginTop: Spacing.sm,
        padding: Spacing.md,
        backgroundColor: Colors.surface,
        borderRadius: BorderRadius.lg,
        borderWidth: 1,
        borderColor: Colors.borderLight,
    },
    cardUnread: {
        backgroundColor: Colors.info + '08',
        borderColor: Colors.info + '20',
    },
    iconCircle: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: Spacing.sm,
    },
    cardContent: {
        flex: 1,
    },
    cardTopRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 2,
    },
    cardTitle: {
        fontSize: FontSize.sm,
        fontWeight: '600',
        color: Colors.text,
        flex: 1,
        marginRight: 8,
    },
    cardTitleUnread: {
        fontWeight: '800',
    },
    timeText: {
        fontSize: FontSize.xs,
        color: Colors.textMuted,
    },
    cardMessage: {
        fontSize: FontSize.sm,
        color: Colors.textSecondary,
        lineHeight: 18,
    },
    orderTag: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 3,
        marginTop: 6,
        alignSelf: 'flex-start',
        paddingHorizontal: 6,
        paddingVertical: 2,
        backgroundColor: Colors.borderLight,
        borderRadius: BorderRadius.sm,
    },
    orderTagText: {
        fontSize: 10,
        color: Colors.textMuted,
        fontWeight: '600',
    },
    unreadDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: Colors.info,
        marginTop: 6,
        marginLeft: 4,
    },
});
