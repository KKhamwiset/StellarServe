/**
 * API client for the StellaServe backend
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

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

async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: { "Content-Type": "application/json" },
        ...options,
    });
    if (!res.ok) throw new Error(`API Error: ${res.status}`);
    return res.json();
}

export const api = {
    getRestaurants: () => apiFetch<Restaurant[]>("/api/restaurants"),
    getRestaurant: (id: string) => apiFetch<Restaurant>(`/api/restaurants/${id}`),
    getMenu: (restaurantId: string) => apiFetch<MenuItem[]>(`/api/menu/${restaurantId}`),
    getOrders: () => apiFetch<Order[]>("/api/orders"),
    getOrder: (id: string) => apiFetch<Order>(`/api/orders/${id}`),
};
