/**
 * API Types for StellaServe
 */

export interface User {
    full_name: string | null;
    email: string;
    phone: string | null;
    role: string;
    address: string | null;
    image_url: string | null;
    vehicle_type: string | null;
    is_available: boolean;
}
export interface Token {
    access_token: string;
    token_type: string;
}

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

export interface CartItem {
    id: number;
    menu_item_id: string;
    quantity: number;
    name: string;
    price: number;
    subtotal: number;
    restaurant_id: string;
    image_url: string | null;
    restaurant: Restaurant;
}

export interface Cart {
    id: number;
    user_id: number;
    restaurant_id: string | null;
    items: CartItem[];
    total_price: number;
}

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
    delivery_fee: number;
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
    delivery_fee: number;
    status: string;
    delivery_address: string;
    phone: string;
    notes: string | null;
    rider_id: number | null;
    rider_name: string | null;
    rider_phone: string | null;
    customer_name: string | null;
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
    has_reviewed: boolean;
}

export interface CreateReviewPayload {
    restaurant_id: string;
    rating: number;
    order_id: string;
    comment: string;
}

export interface Favorite {
    id: number;
    user_id: number;
    restaurant_id: string;
    restaurant: Restaurant;
    user: User;
}

export interface Notification {
    id: number;
    user_id: number;
    title: string;
    message: string;
    type: string;
    order_id: string | null;
    is_read: boolean;
    created_at: string;
}

export interface NotificationCount {
    unread_count: number;
}
