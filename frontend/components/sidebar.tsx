"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
    { href: "/", label: "Dashboard", icon: "📊" },
    { href: "/orders", label: "Orders", icon: "📋" },
    { href: "/menu", label: "Menu", icon: "🍜" },
    { href: "/restaurants", label: "Restaurants", icon: "🏪" },
    { href: "/settings", label: "Settings", icon: "⚙️" },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="sidebar">
            <div className="sidebar-brand">
                <span className="sidebar-brand-emoji">🌙</span>
                <div>
                    <div className="sidebar-brand-name">StellaServe</div>
                    <div className="sidebar-brand-tag">Dashboard</div>
                </div>
            </div>

            <div className="sidebar-section-label">Management</div>
            <nav className="sidebar-nav">
                {NAV_ITEMS.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`sidebar-link ${pathname === item.href ? "active" : ""}`}
                    >
                        <span className="sidebar-icon">{item.icon}</span>
                        {item.label}
                    </Link>
                ))}
            </nav>

            <div className="sidebar-footer">
                <div className="sidebar-footer-text">StellaServe v0.1.0</div>
            </div>
        </aside>
    );
}
