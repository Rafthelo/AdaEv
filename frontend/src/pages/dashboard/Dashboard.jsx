import { useState, useEffect } from 'react';
import PageWrapper from '../../components/layout/PageWrapper';
import { getDashboardStats } from '../../api/endpoints/dashboard.api';

const StatCard = ({ title, value, subtitle, color }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
    <h3 className="text-sm font-medium text-gray-500">{title}</h3>
    <p className={`text-3xl font-bold mt-2 ${color || 'text-gray-800'}`}>{value}</p>
    {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
  </div>
);

const Dashboard = () => {
  const [stats,   setStats]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await getDashboardStats();
        setStats(data.data);
      } catch {
        setError('Error al cargar estadísticas');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <PageWrapper title="Dashboard">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        </div>
      </PageWrapper>
    );
  }

  if (error) {
    return (
      <PageWrapper title="Dashboard">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper title="Dashboard">
      {/* Stats de hoy */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        <StatCard
          title="Ventas hoy"
          value={stats.today.total_sales}
          subtitle="Transacciones completadas"
          color="text-blue-600"
        />
        <StatCard
          title="Ingresos hoy"
          value={`Bs. ${stats.today.total_revenue.toFixed(2)}`}
          subtitle={`Promedio: Bs. ${stats.today.avg_sale.toFixed(2)}`}
          color="text-green-600"
        />
        <StatCard
          title="Total ingresos"
          value={`Bs. ${stats.all_time.total_revenue.toFixed(2)}`}
          subtitle={`${stats.all_time.total_sales} ventas totales`}
          color="text-green-700"
        />
        <StatCard
          title="Cajas abiertas"
          value={stats.system.open_sessions}
          subtitle="Sesiones activas"
          color="text-orange-600"
        />
        <StatCard
          title="Eventos activos"
          value={stats.system.active_events}
          subtitle={`${stats.system.active_users} usuarios activos`}
          color="text-purple-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Últimas ventas */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-800">Últimas ventas</h3>
          </div>
          <div className="divide-y divide-gray-50">
            {stats.recent_sales.length === 0 ? (
              <p className="px-6 py-4 text-gray-400 text-sm">Sin ventas registradas</p>
            ) : (
              stats.recent_sales.map((sale) => (
                <div key={sale.id} className="px-6 py-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-800">Venta #{sale.id}</p>
                    <p className="text-xs text-gray-500">
                      {sale.cashier_username} — {sale.event_name || 'Sin evento'}
                    </p>
                  </div>
                  <span className="text-sm font-bold text-green-600">
                    Bs. {parseFloat(sale.total).toFixed(2)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Stock bajo */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-800">Alertas de stock bajo</h3>
          </div>
          <div className="divide-y divide-gray-50">
            {stats.low_stock.length === 0 ? (
              <p className="px-6 py-4 text-gray-400 text-sm">Sin alertas de stock</p>
            ) : (
              stats.low_stock.map((item) => (
                <div key={item.id} className="px-6 py-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{item.product_name}</p>
                    <p className="text-xs text-gray-500">{item.event_name || 'General'}</p>
                  </div>
                  <span className="text-sm font-bold text-red-600">
                    {item.quantity} / {item.min_stock}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Dashboard;