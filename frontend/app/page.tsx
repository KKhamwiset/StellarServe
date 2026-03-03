export default function DashboardPage() {
  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Overview of your night-time delivery operations</p>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Orders</div>
          <div className="stat-value">128</div>
          <div className="stat-change positive">↑ 12% from yesterday</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Revenue</div>
          <div className="stat-value">฿24,580</div>
          <div className="stat-change positive">↑ 8% from yesterday</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Active Restaurants</div>
          <div className="stat-value">5</div>
          <div className="stat-change positive">2 open now</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Avg. Delivery Time</div>
          <div className="stat-value">28m</div>
          <div className="stat-change negative">↑ 3min slower</div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="panel">
        <div className="panel-header">
          <h2 className="panel-title">Recent Orders</h2>
          <button className="btn btn-secondary">View All</button>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Restaurant</th>
              <th>Total</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>#ORD-0128</td>
              <td>Somchai K.</td>
              <td>Midnight Ramen House</td>
              <td>฿680.00</td>
              <td><span className="badge badge-preparing">Preparing</span></td>
            </tr>
            <tr>
              <td>#ORD-0127</td>
              <td>Narong P.</td>
              <td>Moonlight Thai Kitchen</td>
              <td>฿400.00</td>
              <td><span className="badge badge-delivering">Delivering</span></td>
            </tr>
            <tr>
              <td>#ORD-0126</td>
              <td>Siriporn M.</td>
              <td>Starlight Pizza</td>
              <td>฿670.00</td>
              <td><span className="badge badge-delivered">Delivered</span></td>
            </tr>
            <tr>
              <td>#ORD-0125</td>
              <td>Ananya W.</td>
              <td>Midnight Ramen House</td>
              <td>฿260.00</td>
              <td><span className="badge badge-delivered">Delivered</span></td>
            </tr>
            <tr>
              <td>#ORD-0124</td>
              <td>Kittisak R.</td>
              <td>Moonlight Thai Kitchen</td>
              <td>฿540.00</td>
              <td><span className="badge badge-cancelled">Cancelled</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
