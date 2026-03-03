export default function OrdersPage() {
    return (
        <>
            <div className="page-header">
                <h1 className="page-title">Orders</h1>
                <p className="page-subtitle">Manage and track all delivery orders</p>
            </div>

            <div className="panel">
                <div className="panel-header">
                    <h2 className="panel-title">All Orders</h2>
                    <button className="btn btn-primary">+ New Order</button>
                </div>
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Customer</th>
                            <th>Restaurant</th>
                            <th>Items</th>
                            <th>Total</th>
                            <th>Status</th>
                            <th>Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>#ORD-0128</td>
                            <td>Somchai K.</td>
                            <td>Midnight Ramen House</td>
                            <td>2x Tonkotsu, 1x Gyoza</td>
                            <td>฿680.00</td>
                            <td><span className="badge badge-preparing">Preparing</span></td>
                            <td>2 min ago</td>
                        </tr>
                        <tr>
                            <td>#ORD-0127</td>
                            <td>Narong P.</td>
                            <td>Moonlight Thai Kitchen</td>
                            <td>1x Pad Thai, 1x Green Curry</td>
                            <td>฿400.00</td>
                            <td><span className="badge badge-delivering">Delivering</span></td>
                            <td>15 min ago</td>
                        </tr>
                        <tr>
                            <td>#ORD-0126</td>
                            <td>Siriporn M.</td>
                            <td>Starlight Pizza</td>
                            <td>1x Margherita, 1x Pepperoni</td>
                            <td>฿670.00</td>
                            <td><span className="badge badge-delivered">Delivered</span></td>
                            <td>45 min ago</td>
                        </tr>
                        <tr>
                            <td>#ORD-0125</td>
                            <td>Ananya W.</td>
                            <td>Midnight Ramen House</td>
                            <td>1x Miso Ramen</td>
                            <td>฿260.00</td>
                            <td><span className="badge badge-delivered">Delivered</span></td>
                            <td>1 hour ago</td>
                        </tr>
                        <tr>
                            <td>#ORD-0124</td>
                            <td>Kittisak R.</td>
                            <td>Moonlight Thai Kitchen</td>
                            <td>2x Pad Thai, 1x Mango Rice</td>
                            <td>฿500.00</td>
                            <td><span className="badge badge-cancelled">Cancelled</span></td>
                            <td>2 hours ago</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    );
}
