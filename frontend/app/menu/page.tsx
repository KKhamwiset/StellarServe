export default function MenuPage() {
    const menuItems = [
        { id: "item-001", name: "Tonkotsu Ramen", restaurant: "Midnight Ramen House", price: 280, category: "Ramen", available: true },
        { id: "item-002", name: "Miso Ramen", restaurant: "Midnight Ramen House", price: 260, category: "Ramen", available: true },
        { id: "item-003", name: "Gyoza (6 pcs)", restaurant: "Midnight Ramen House", price: 120, category: "Sides", available: true },
        { id: "item-004", name: "Pad Thai", restaurant: "Moonlight Thai Kitchen", price: 180, category: "Noodles", available: true },
        { id: "item-005", name: "Green Curry", restaurant: "Moonlight Thai Kitchen", price: 220, category: "Curry", available: true },
        { id: "item-006", name: "Mango Sticky Rice", restaurant: "Moonlight Thai Kitchen", price: 140, category: "Dessert", available: true },
        { id: "item-007", name: "Margherita Pizza", restaurant: "Starlight Pizza", price: 320, category: "Pizza", available: true },
        { id: "item-008", name: "Pepperoni Pizza", restaurant: "Starlight Pizza", price: 350, category: "Pizza", available: false },
    ];

    return (
        <>
            <div className="page-header">
                <h1 className="page-title">Menu</h1>
                <p className="page-subtitle">Manage menu items across all restaurants</p>
            </div>

            <div className="panel">
                <div className="panel-header">
                    <h2 className="panel-title">All Menu Items</h2>
                    <button className="btn btn-primary">+ Add Item</button>
                </div>
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Item</th>
                            <th>Restaurant</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {menuItems.map((item) => (
                            <tr key={item.id}>
                                <td style={{ fontWeight: 600 }}>{item.name}</td>
                                <td>{item.restaurant}</td>
                                <td>{item.category}</td>
                                <td>฿{item.price.toFixed(2)}</td>
                                <td>
                                    <span className={`badge ${item.available ? "badge-open" : "badge-closed"}`}>
                                        {item.available ? "Available" : "Unavailable"}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}
