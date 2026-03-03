export default function SettingsPage() {
    return (
        <>
            <div className="page-header">
                <h1 className="page-title">Settings</h1>
                <p className="page-subtitle">Configure your StellaServe dashboard</p>
            </div>

            <div className="panel">
                <div className="panel-header">
                    <h2 className="panel-title">General</h2>
                </div>
                <table className="data-table">
                    <tbody>
                        <tr>
                            <td style={{ fontWeight: 600, width: "30%" }}>App Name</td>
                            <td>StellaServe</td>
                        </tr>
                        <tr>
                            <td style={{ fontWeight: 600 }}>Environment</td>
                            <td><span className="badge badge-confirmed">Development</span></td>
                        </tr>
                        <tr>
                            <td style={{ fontWeight: 600 }}>API URL</td>
                            <td style={{ color: "var(--text-muted)" }}>http://localhost:8000</td>
                        </tr>
                        <tr>
                            <td style={{ fontWeight: 600 }}>Time Zone</td>
                            <td>Asia/Bangkok (UTC+7)</td>
                        </tr>
                        <tr>
                            <td style={{ fontWeight: 600 }}>Currency</td>
                            <td>THB (฿)</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="panel">
                <div className="panel-header">
                    <h2 className="panel-title">Notifications</h2>
                </div>
                <table className="data-table">
                    <tbody>
                        <tr>
                            <td style={{ fontWeight: 600, width: "30%" }}>New Order Alerts</td>
                            <td><span className="badge badge-open">Enabled</span></td>
                        </tr>
                        <tr>
                            <td style={{ fontWeight: 600 }}>Order Status Updates</td>
                            <td><span className="badge badge-open">Enabled</span></td>
                        </tr>
                        <tr>
                            <td style={{ fontWeight: 600 }}>Daily Report Email</td>
                            <td><span className="badge badge-closed">Disabled</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="panel">
                <div className="panel-header">
                    <h2 className="panel-title">Danger Zone</h2>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                        <div style={{ fontWeight: 600 }}>Reset All Data</div>
                        <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>
                            This will permanently delete all orders, menus, and restaurant data.
                        </div>
                    </div>
                    <button
                        className="btn"
                        style={{ background: "rgba(248,113,113,0.15)", color: "var(--error)" }}
                    >
                        Reset Data
                    </button>
                </div>
            </div>
        </>
    );
}
