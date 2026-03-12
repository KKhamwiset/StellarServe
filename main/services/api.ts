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

    return response.json();
}
export interface User {
    full_name: string;
    email: string;
    phone: string;
    role: string;
}
// ─── Restaurant API ─────────────────────────────────────
export interface Restaurant {
    id: string;
    name: string;
    description: string | null;
    cuisine_type: string | null;
    address: string;
    phone: string | null;
    image_url: string | null;
    rating: number;
    is_open: boolean;
    opening_time: string | null;
    closing_time: string | null;
}

export async function getRestaurants(): Promise<Restaurant[]> {
    return request<Restaurant[]>(API_ENDPOINTS.restaurants);
}

export async function getRestaurant(id: string): Promise<Restaurant> {
    return request<Restaurant>(`${API_ENDPOINTS.restaurants}/${id}`);
}

// ─── Menu API ───────────────────────────────────────────
export interface MenuItem {
    id: string;
    restaurant_id: string;
    name: string;
    description: string | null;
    price: number;
    category: string | null;
    image_url: string | null;
    is_available: boolean;
}

export async function getMenu(restaurantId: string): Promise<MenuItem[]> {
    return request<MenuItem[]>(API_ENDPOINTS.menu(restaurantId));
}

// ─── Cart API ───────────────────────────────────────────
export interface CartItem {
    id: number;
    menu_item_id: string;
    quantity: number;
    name: string;
    price: number;
    subtotal: number;
    restaurant_id: string;
}

export interface Cart {
    id: number;
    user_id: number;
    restaurant_id: string | null;
    items: CartItem[];
    total_price: number;
}

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
export interface OrderItem {
    menu_item_id: string;
    quantity: number;
    special_instructions?: string;
}

export interface CreateOrderPayload {
    restaurant_id: string;
    items: OrderItem[];
    delivery_address: string;
    phone: string;
    notes?: string;
}

export interface Order {
    id: string;
    restaurant_id: string;
    restaurant_name: string;
    items: Array<{
        menu_item_id: string;
        name: string;
        quantity: number;
        price: number;
        subtotal: number;
    }>;
    total: number;
    status: string;
    delivery_address: string;
    phone: string;
    notes: string | null;
    created_at: string;
}

export interface Reviews {
    id: number;
    user_id: number;

    user: {
        id: number;
        full_name?: string;
        username: string;
    };

    order: {
        id: string;
        items: Array<{
            quantity: number;
            menu_item: {
                name: string;
            };
        }>;
    };

    restaurant_id: string;
    rating: number;
    comment: string;
}
export interface ReviewStat {
    has_reviewed: boolean
}

export interface CreateReviewPayload {
    restaurant_id: string;
    rating: number;
    order_id: string;
    comment: string;
}

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

