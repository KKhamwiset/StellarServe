export default function RestaurantsPage() {
    const restaurants = [
        {
            id: "rest-001",
            name: "Midnight Ramen House",
            cuisine: "Japanese",
            rating: 4.7,
            hours: "18:00 – 04:00",
            address: "123 Night Market St",
            isOpen: true,
            totalOrders: 87,
        },
        {
            id: "rest-002",
            name: "Moonlight Thai Kitchen",
            cuisine: "Thai",
            rating: 4.5,
            hours: "20:00 – 05:00",
            address: "456 Soi Midnight",
            isOpen: true,
            totalOrders: 63,
        },
        {
            id: "rest-003",
            name: "Starlight Pizza",
            cuisine: "Italian",
            rating: 4.3,
            hours: "19:00 – 02:00",
            address: "789 Luna Ave",
            isOpen: false,
            totalOrders: 42,
        },
    ];

    return (
        <>
            <div className="page-header">
                <h1 className="page-title">Restaurants</h1>
                <p className="page-subtitle">Manage partner restaurants</p>
            </div>

            <div className="stats-grid">
                {restaurants.map((r) => (
                    <div className="stat-card" key={r.id} style={{ cursor: "pointer" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                            <div>
                                <div className="stat-label">{r.cuisine}</div>
                                <div className="stat-value" style={{ fontSize: 22, marginTop: 8 }}>
                                    {r.name}
                                </div>
                            </div>
                            <span className={`badge ${r.isOpen ? "badge-open" : "badge-closed"}`}>
                                {r.isOpen ? "Open" : "Closed"}
                            </span>
                        </div>
                        <div style={{ marginTop: 16, display: "flex", gap: 16, fontSize: 13, color: "var(--text-secondary)" }}>
                            <span>⭐ {r.rating}</span>
                            <span>🕐 {r.hours}</span>
                            <span>📦 {r.totalOrders} orders</span>
                        </div>
                        <div style={{ marginTop: 8, fontSize: 13, color: "var(--text-muted)" }}>
                            📍 {r.address}
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ marginTop: 8 }}>
                <button className="btn btn-primary">+ Add Restaurant</button>
            </div>
        </>
    );
}
