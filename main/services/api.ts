/**
 * API client for StellaServe backend
 */

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

    if (body) {
        config.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
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

export async function createOrder(payload: CreateOrderPayload): Promise<Order> {
    return request<Order>(API_ENDPOINTS.orders, {
        method: 'POST',
        body: payload as unknown as Record<string, unknown>,
    });
}

export async function getOrders(): Promise<Order[]> {
    return request<Order[]>(API_ENDPOINTS.orders);
}
