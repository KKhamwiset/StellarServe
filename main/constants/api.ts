/**
 * API configuration
 */

// Change this to your backend URL
export const API_BASE_URL = __DEV__
    ? 'http://192.168.100.39:8000'
    : 'https://api.stellaserve.com';

export const API_ENDPOINTS = {
    health: '/health',
    restaurants: '/api/restaurants',
    menu: (restaurantId: string) => `/api/menu/${restaurantId}`,
    cart: '/api/cart',
    orders: '/api/orders',
    reviews: '/api/reviews',
    auth: {
        login: '/api/auth/login',
        register: '/api/auth/register',
        me: '/api/auth/me',
        logout: '/api/auth/logout',
    },
    favorites: '/api/favorites',
    notifications: '/api/notifications',
};
