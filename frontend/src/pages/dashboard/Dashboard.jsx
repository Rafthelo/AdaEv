import { useState, useEffect } from 'react';
import PageWrapper from '../../components/layout/PageWrapper';
import Badge       from '../../components/common/Badge';
import Spinner     from '../../components/common/Spinner';
import { getActiveEvents, getDashboardStats } from '../../api/endpoints/dashboard.api';

const SELLER_TYPE_COLORS = {
  independent: 'blue',
  waiter:      'yellow',
  bartender:   'purple',
};

const StatCard = ({ icon, title, value, subtitle, color = 'text-gray-800 dark:text-gray-100' }) => (
  <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5">
    <div className="flex items-center gap-3 mb-2">
      <span className="text-2xl">{icon}</span>
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
    </div>
    <p className={`text-3xl font-bold ${color}`}>{value}</p>
    {subtitle && <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{subtitle}</p>}
  </div>
);

const Dashboard = () => {
  const [activeEvents,  setActiveEvents]  = useState([]);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [stats,         setStats]         = useState(null);
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState('');

  // Cargar eventos activos
  useEffect(() => {
    getActiveEvents()
      .then(({ data }) => {
        const events = data.data || [];
        setActiveEvents(events);
        if (events.length === 1) {
          setSelectedEvent(String(events[0].id));
        } else {
          setSelectedEvent('');
        }
      })
      .catch(() => setError('Error al cargar eventos activos'));
  }, []);

  // Cargar stats cuando cambia el evento seleccionado
  useEffect(() => {
    let cancelled = false;
    const fetchStats = async () => {
      setLoading(true);
      setError('');
      try {
        const { data } = await getDashboardStats(selectedEvent || null);
        if (!cancelled) setStats(data.data);
      } catch {
        if (!cancelled) setError('Error al cargar estadísticas');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchStats();

    // Auto-actualización cada 30 segundos
    const interval = setInterval(fetchStats, 30000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [selectedEvent]);

  return (
    <PageWrapper title="Dashboard">
      {/* Selector de evento */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 px-6 py-4 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Evento:</span>
          {activeEvents.length === 0 ? (
            <span className="text-sm text-gray-400 dark:text-gray-500">No hay eventos activos</span>
          ) : (
            <select
              value={selectedEvent}
              onChange={(e) => setSelectedEvent(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos los eventos</option>
              {activeEvents.map((ev) => (
                <option key={ev.id} value={ev.id}>{ev.name}</option>
              ))}
            </select>
          )}
        </div>
        <p className="text-xs text-gray-400 dark:text-gray-500">Se actualiza cada 30 segundos</p>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg mb-6 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Spinner size="lg" />
        </div>
      ) : stats && (
        <div className="space-y-6">
          {/* Fila 1 — Números clave */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              icon="💰" title="Total ventas"
              value={`Bs. ${stats.summary.total_revenue.toFixed(2)}`}
              subtitle={`${stats.summary.total_sales} transacciones`}
              color="text-green-600 dark:text-green-400"
            />
            <StatCard
              icon="🎫" title="Objetos en custodia"
              value={stats.summary.custody_active}
              subtitle="Pendientes de devolución"
              color="text-blue-600 dark:text-blue-400"
            />
            <StatCard
              icon="⚠️" title="Alertas de stock"
              value={stats.summary.low_stock}
              subtitle="Productos bajo mínimo"
              color={stats.summary.low_stock > 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-400 dark:text-gray-500'}
            />
            <StatCard
              icon="👥" title="Vendedores activos"
              value={stats.summary.active_sellers}
              subtitle="Asignados al evento"
              color="text-purple-600 dark:text-purple-400"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Últimas ventas */}
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                <h3 className="font-semibold text-gray-800 dark:text-gray-100">Últimas ventas</h3>
              </div>
              <div className="divide-y divide-gray-50 dark:divide-gray-800">
                {stats.recent_sales.length === 0 ? (
                  <p className="px-6 py-4 text-sm text-gray-400 dark:text-gray-500">Sin ventas registradas</p>
                ) : stats.recent_sales.map((sale) => (
                  <div key={sale.id} className="px-6 py-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-100">#{sale.id} — {sale.seller_username || '—'}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">{sale.product_codes || '—'} · {new Date(sale.created_at).toLocaleTimeString('es-BO')}</p>
                    </div>
                    <span className="text-sm font-bold text-green-600 dark:text-green-400">
                      Bs. {parseFloat(sale.total).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Rendimiento por vendedor */}
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                <h3 className="font-semibold text-gray-800 dark:text-gray-100">Rendimiento por vendedor</h3>
              </div>
              <div className="divide-y divide-gray-50 dark:divide-gray-800">
                {stats.seller_performance.length === 0 ? (
                  <p className="px-6 py-4 text-sm text-gray-400 dark:text-gray-500">Sin vendedores asignados</p>
                ) : stats.seller_performance.map((seller, i) => (
                  <div key={i} className="px-6 py-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{seller.username}</p>
                      <Badge label={seller.seller_type_label} color={SELLER_TYPE_COLORS[seller.seller_type] || 'gray'} />
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-green-600 dark:text-green-400">Bs. {seller.total_revenue.toFixed(2)}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">{seller.total_sales} ventas</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Stock bajo */}
          {stats.low_stock_items.length > 0 && (
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-red-200 dark:border-red-800">
              <div className="px-6 py-4 border-b border-red-100 dark:border-red-800">
                <h3 className="font-semibold text-red-700 dark:text-red-400">⚠️ Productos con stock bajo</h3>
              </div>
              <div className="divide-y divide-red-50 dark:divide-red-900/30">
                {stats.low_stock_items.map((item, i) => (
                  <div key={i} className="px-6 py-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{item.product_name}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">{item.sku}</p>
                    </div>
                    <span className="text-sm font-bold text-red-600 dark:text-red-400">
                      {item.quantity} / {item.min_stock} mín.
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </PageWrapper>
  );
};

export default Dashboard;