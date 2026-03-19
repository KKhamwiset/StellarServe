/**
 * API client for StellaServe backend
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL, API_ENDPOINTS } from '@/constants/api';

interface RequestOptions {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    body?: Record<string, unknown>;
    headers?: Record<string, string>;
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { method = 'GET', body, headers = {} } = options;

    const config: RequestInit = {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...headers,
        },
    };

    const token = await AsyncStorage.getItem('userToken');
    if (token) {
        config.headers = {
            ...config.headers,
            'Authorization': `Bearer ${token}`
        };
    }

    if (body) {
        config.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const text = await response.text();
    return text ? JSON.parse(text) : (undefined as T);
}
import {
    User, Restaurant, MenuItem, Cart, CreateReviewPayload,
    Reviews, CreateOrderPayload, Order, Favorite , Token
} from '@/types/api';



// ─── Restaurant API ─────────────────────────────────────

export async function getUser(): Promise<User> {
    return request<User>(API_ENDPOINTS.auth.me);
}


export async function getRestaurants(): Promise<Restaurant[]> {
    return request<Restaurant[]>(API_ENDPOINTS.restaurants);
}

export async function getRestaurant(id: string): Promise<Restaurant> {
    return request<Restaurant>(`${API_ENDPOINTS.restaurants}/${id}`);
}

export async function getMyRestaurant(): Promise<Restaurant> {
    return request<Restaurant>(`${API_ENDPOINTS.restaurants}/mine`);
}
export async function getRestaurantOrders(restaurantId: string): Promise<{ orders_count: number; income: number }> {
    return request<{ orders_count: number; income: number }>(`${API_ENDPOINTS.restaurants}/${restaurantId}/order`);
}
export async function getRestaurantMenu(restaurantId: string): Promise<{ items: number }> {
    return request<{ items: number }>(`${API_ENDPOINTS.restaurants}/${restaurantId}/menu`);
}
// ─── Menu API ───────────────────────────────────────────

export async function getMenu(restaurantId: string): Promise<MenuItem[]> {
    return request<MenuItem[]>(API_ENDPOINTS.menu(restaurantId));
}

// ─── Cart API ───────────────────────────────────────────

export async function getCart(): Promise<Cart> {
    return request<Cart>(API_ENDPOINTS.cart);
}

export async function addToCart(menu_item_id: string, quantity: number, restaurant_id: string): Promise<Cart> {
    return request<Cart>(`${API_ENDPOINTS.cart}/items`, {
        method: 'POST',
        body: { menu_item_id, quantity, restaurant_id },
    });
}

export async function removeFromCart(item_id: number): Promise<Cart> {
    return request<Cart>(`${API_ENDPOINTS.cart}/items/${item_id}`, {
        method: 'DELETE',
    });
}

// ─── Orders API ─────────────────────────────────────────

export async function createReviews(payload: CreateReviewPayload): Promise<Reviews> {
    return request<Reviews>(`${API_ENDPOINTS.reviews}/${payload.restaurant_id}?order=${payload.order_id}`, {
        method: 'POST',
        body: payload as unknown as Record<string, unknown>,
    });
}

export async function getReviews(restaurantId: string): Promise<Reviews[]> {
    return request<Reviews[]>(`${API_ENDPOINTS.reviews}/${restaurantId}`);
}


export async function checkUserReview(order_id: string): Promise<boolean> {
    return request<boolean>(`${API_ENDPOINTS.reviews}/check?order=${order_id}`);
}

export async function createOrder(payload: CreateOrderPayload): Promise<Order> {
    return request<Order>(API_ENDPOINTS.orders, {
        method: 'POST',
        body: payload as unknown as Record<string, unknown>,
    });
}

export async function getOrders(): Promise<Order[]> {
    return request<Order[]>(API_ENDPOINTS.orders);
}

export async function getSellerOrders(): Promise<Order[]> {
    return request<Order[]>(`${API_ENDPOINTS.orders}/seller`);
}

export async function updateOrderStatus(orderId: string, status: string): Promise<Order> {
    return request<Order>(`${API_ENDPOINTS.orders}/${orderId}/status?status=${encodeURIComponent(status)}`, {
        method: 'PUT',
    });
}

// ─── Favorite API ─────────────────────────────────────────

export async function getFavorite(restaurantId: string): Promise<Favorite> {
    return request<Favorite>(`${API_ENDPOINTS.favorites}/${restaurantId}`);
}

export async function getFavorites(): Promise<Favorite[]> {
    return request<Favorite[]>(API_ENDPOINTS.favorites);
}

export async function toggleFavorite(restaurantId: string): Promise<Favorite> {
    return request<Favorite>(`${API_ENDPOINTS.favorites}/${restaurantId}`, {
        method: 'POST',
    });
}


export async function removeFavorite(favoriteId: number | null): Promise<void> {
    if (!favoriteId) {
        return;
    }
    request<void>(`${API_ENDPOINTS.favorites}/${favoriteId}`, {
        method: 'DELETE',
    });
}