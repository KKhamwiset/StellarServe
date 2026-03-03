/**
 * API configuration
 */

// Change this to your backend URL
export const API_BASE_URL = __DEV__
    ? 'http://localhost:8000'
    : 'https://api.stellaserve.com';

export const API_ENDPOINTS = {
    health: '/health',
    restaurants: '/api/restaurants',
    menu: (restaurantId: string) => `/api/menu/${restaurantId}`,
    orders: '/api/orders',
    auth: {
        login: '/api/auth/login',
        register: '/api/auth/register',
        me: '/api/auth/me',
    },
};
