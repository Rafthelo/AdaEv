import Spinner from './Spinner';

const Table = ({ columns, data, loading = false, emptyMessage = 'Sin registros' }) => {
  // Excluimos la columna de acciones del cuerpo de la tarjeta para mostrarla aparte, al final
  const actionsCol = columns.find((c) => c.key === 'actions');
  const dataCols   = columns.filter((c) => c.key !== 'actions');

  if (loading) {
    return (
      <div className="py-12 text-center">
        <Spinner />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="py-12 text-center text-gray-400 dark:text-gray-500 text-sm">
        {emptyMessage}
      </div>
    );
  }

  return (
    <>
      {/* Vista de tabla — pantallas medianas y grandes */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide"
                  style={{ width: col.width }}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr
                key={row.id || i}
                className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3 text-gray-700 dark:text-gray-300">
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Vista de tarjetas — móvil */}
      <div className="md:hidden divide-y divide-gray-100 dark:divide-gray-800">
        {data.map((row, i) => (
          <div key={row.id || i} className="p-4 space-y-2">
            {dataCols.map((col) => {
              const value = col.render ? col.render(row) : row[col.key];
              if (value === '—' || value === null || value === undefined) return null;
              return (
                <div key={col.key} className="flex justify-between items-start gap-3 text-sm">
                  <span className="text-gray-400 dark:text-gray-500 text-xs uppercase tracking-wide shrink-0 pt-0.5">{col.label}</span>
                  <span className="text-gray-800 dark:text-gray-200 text-right">{value}</span>
                </div>
              );
            })}
            {actionsCol && (
              <div className="flex justify-end gap-2 pt-2">
                {actionsCol.render(row)}
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default Table;