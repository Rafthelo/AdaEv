import { useState, useEffect, useRef } from 'react';
import PageWrapper    from '../../components/layout/PageWrapper';
import Table          from '../../components/common/Table';
import Button         from '../../components/common/Button';
import Modal          from '../../components/common/Modal';
import Input          from '../../components/common/Input';
import Badge          from '../../components/common/Badge';
import Alert          from '../../components/common/Alert';
import usePermissions from '../../hooks/usePermissions';
import { getEvents } from '../../api/endpoints/events.api';
import {
  getTopics, createTopic, setTopicAvailable, deleteTopic,
  getEnrollments, createEnrollment, bulkImport, searchByRu,
  updateEnrollment, deliverCertificates, deleteEnrollment,
} from '../../api/endpoints/seminar.api';

const downloadTemplate = () => {
  const csv = 'ru_code,full_name,career,amount_paid\n12345,Juan Perez,Ing. Electronica,0\n12346,Maria Lopez,Ing. Sistemas,50\n';
  const blob = new Blob([csv], { type: 'text/csv' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'formato_inscripciones.csv';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const Seminar = () => {
  const { can } = usePermissions();

  const [events,        setEvents]        = useState([]);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [topics,        setTopics]        = useState([]);
  const [loading,       setLoading]       = useState(false);
  const [alert,         setAlert]         = useState({ type: '', message: '' });
  const [refreshKey,    setRefreshKey]    = useState(0);

  // Modal nuevo tema
  const [topicModal, setTopicModal] = useState(false);
  const [topicName,  setTopicName]  = useState('');
  const [saving,      setSaving]     = useState(false);

  // Vista de detalle de tema
  const [activeTopic,  setActiveTopic]  = useState(null);
  const [enrollments,  setEnrollments]  = useState([]);
  const [loadingEnroll, setLoadingEnroll] = useState(false);
  const [selectedIds,  setSelectedIds]  = useState([]);

  // Modal inscripción individual
  const [enrollModal, setEnrollModal] = useState(false);
  const [enrollForm,  setEnrollForm]  = useState({ ru_code: '', full_name: '', career: '', amount_paid: '' });
  const [editingEnrollment, setEditingEnrollment] = useState(null);

  // Carga masiva
  const [importModal, setImportModal] = useState(false);
  const [importFile,  setImportFile]  = useState(null);
  const fileRef = useRef();

  // Buscador RU
  const [searchModal, setSearchModal] = useState(false);
  const [ruSearch,    setRuSearch]    = useState('');
  const [ruResults,   setRuResults]   = useState([]);
  const [searching,   setSearching]   = useState(false);

  useEffect(() => {
    getEvents({ limit: 100, status: 'active' }).then(({ data }) => setEvents(data.data || [])).catch(() => {});
  }, []);

useEffect(() => {
  if (!selectedEvent) {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTopics([]);
    return;
  }
  setLoading(true);
  getTopics(selectedEvent)
    .then(({ data }) => setTopics(data.data || []))
    .catch(() => setAlert({ type: 'error', message: 'Error al cargar temas' }))
    .finally(() => setLoading(false));
}, [selectedEvent, refreshKey]);


  const loadEnrollments = (topic) => {
    setActiveTopic(topic);
    setLoadingEnroll(true);
    setSelectedIds([]);
    getEnrollments(topic.id)
      .then(({ data }) => setEnrollments(data.data || []))
      .catch(() => setAlert({ type: 'error', message: 'Error al cargar inscripciones' }))
      .finally(() => setLoadingEnroll(false));
  };

  const handleCreateTopic = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await createTopic({ event_id: selectedEvent, name: topicName });
      setAlert({ type: 'success', message: 'Tema creado exitosamente' });
      setTopicModal(false);
      setTopicName('');
      setRefreshKey((k) => k + 1);
    } catch (err) {
      setAlert({ type: 'error', message: err.response?.data?.message || 'Error al crear tema' });
    } finally {
      setSaving(false);
    }
  };

  const handleToggleAvailable = async (topic) => {
    try {
      await setTopicAvailable(topic.id, !topic.certificates_available);
      setAlert({ type: 'success', message: 'Estado actualizado' });
      setRefreshKey((k) => k + 1);
      if (activeTopic?.id === topic.id) {
        setActiveTopic({ ...topic, certificates_available: !topic.certificates_available });
      }
    } catch (err) {
      setAlert({ type: 'error', message: err.response?.data?.message || 'Error al actualizar' });
    }
  };

  const handleDeleteTopic = async (id) => {
    if (!window.confirm('¿Eliminar este tema? Se eliminarán todas sus inscripciones.')) return;
    try {
      await deleteTopic(id);
      setAlert({ type: 'success', message: 'Tema eliminado' });
      setActiveTopic(null);
      setRefreshKey((k) => k + 1);
    } catch (err) {
      setAlert({ type: 'error', message: err.response?.data?.message || 'Error al eliminar' });
    }
  };

  const openEnrollCreate = () => {
    setEditingEnrollment(null);
    setEnrollForm({ ru_code: '', full_name: '', career: '', amount_paid: '' });
    setEnrollModal(true);
  };

  const openEnrollEdit = (enrollment) => {
    setEditingEnrollment(enrollment);
    setEnrollForm({
      ru_code: enrollment.ru_code, full_name: enrollment.full_name,
      career: enrollment.career || '', amount_paid: enrollment.amount_paid,
    });
    setEnrollModal(true);
  };

  const handleEnrollSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ru_code: enrollForm.ru_code, full_name: enrollForm.full_name,
        career: enrollForm.career || null, amount_paid: parseFloat(enrollForm.amount_paid) || 0,
      };
      if (editingEnrollment) {
        await updateEnrollment(editingEnrollment.id, payload);
        setAlert({ type: 'success', message: 'Inscripción actualizada' });
      } else {
        await createEnrollment({ ...payload, topic_id: activeTopic.id });
        setAlert({ type: 'success', message: 'Inscripción registrada' });
      }
      setEnrollModal(false);
      loadEnrollments(activeTopic);
      setRefreshKey((k) => k + 1);
    } catch (err) {
      setAlert({ type: 'error', message: err.response?.data?.message || 'Error al guardar' });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteEnrollment = async (id) => {
    if (!window.confirm('¿Eliminar esta inscripción?')) return;
    try {
      await deleteEnrollment(id);
      setAlert({ type: 'success', message: 'Inscripción eliminada' });
      loadEnrollments(activeTopic);
      setRefreshKey((k) => k + 1);
    } catch (err) {
      setAlert({ type: 'error', message: err.response?.data?.message || 'Error al eliminar' });
    }
  };

  const handleImport = async () => {
    if (!importFile) return;
    setSaving(true);
    try {
      const { data } = await bulkImport(activeTopic.id, importFile);
      setAlert({ type: 'success', message: data.message });
      setImportModal(false);
      setImportFile(null);
      loadEnrollments(activeTopic);
      setRefreshKey((k) => k + 1);
    } catch (err) {
      setAlert({ type: 'error', message: err.response?.data?.message || 'Error al importar' });
    } finally {
      setSaving(false);
    }
  };

  const toggleSelect = (id) => {
    setSelectedIds((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);
  };

  const handleDeliverSelected = async () => {
    if (selectedIds.length === 0) return;
    if (!window.confirm(`¿Confirmar entrega de ${selectedIds.length} certificado(s)?`)) return;
    try {
      await deliverCertificates(selectedIds);
      setAlert({ type: 'success', message: 'Certificados entregados exitosamente' });
      loadEnrollments(activeTopic);
      setRefreshKey((k) => k + 1);
    } catch (err) {
      setAlert({ type: 'error', message: err.response?.data?.message || 'Error al entregar' });
    }
  };

  const handleRuSearch = async () => {
    if (!ruSearch.trim()) return;
    setSearching(true);
    setRuResults([]);
    try {
      const { data } = await searchByRu(ruSearch, selectedEvent || null);
      setRuResults(data.data);
    } catch (err) {
      setAlert({ type: 'error', message: err.response?.data?.message || 'No se encontraron resultados' });
    } finally {
      setSearching(false);
    }
  };

  const handleDeliverFromSearch = async (id) => {
    try {
      await deliverCertificates([id]);
      setAlert({ type: 'success', message: 'Certificado entregado exitosamente' });
      handleRuSearch();
      setRefreshKey((k) => k + 1);
    } catch (err) {
      setAlert({ type: 'error', message: err.response?.data?.message || 'Error al entregar' });
    }
  };

const selectableIds = enrollments
  .filter((e) => e.status === 'registered' && activeTopic?.certificates_available)
  .map((e) => e.id);

const allSelected = selectableIds.length > 0 && selectableIds.every((id) => selectedIds.includes(id));

const toggleSelectAll = () => {
  setSelectedIds(allSelected ? [] : selectableIds);
};

const enrollColumns = [
    {
      key: 'select',
      label: (
        <input
          type="checkbox"
          checked={allSelected}
          onChange={toggleSelectAll}
          title="Seleccionar todos"
        />
      ),
      width: '40px',
      render: (r) => r.status === 'registered' && activeTopic?.certificates_available && (
        <input type="checkbox" checked={selectedIds.includes(r.id)} onChange={() => toggleSelect(r.id)} />
      )
    },
    { key: 'ru_code',   label: 'RU',      render: (r) => <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{r.ru_code}</span> },
    { key: 'full_name', label: 'Nombre',  render: (r) => r.full_name },
    { key: 'career',    label: 'Carrera', render: (r) => r.career || '—' },
    { key: 'amount_paid', label: 'Monto', render: (r) => parseFloat(r.amount_paid) > 0 ? `Bs. ${parseFloat(r.amount_paid).toFixed(2)}` : 'Gratis' },
    { key: 'status', label: 'Estado', render: (r) => <Badge label={r.status === 'delivered' ? 'Entregado' : 'Registrado'} color={r.status === 'delivered' ? 'green' : 'gray'} /> },
    {
      key: 'actions', label: '', width: '120px',
      render: (r) => (
        <div className="flex gap-2">
          {can('seminar:update') && (
            <Button size="sm" variant="secondary" onClick={() => openEnrollEdit(r)}>Editar</Button>
          )}
          {can('seminar:delete') && (
            <Button size="sm" variant="ghost" onClick={() => handleDeleteEnrollment(r.id)}>Eliminar</Button>
          )}
        </div>
      )
    },
  ];

  return (
    <PageWrapper title="Seminarios">
      {alert.message && (
        <div className="mb-4">
          <Alert type={alert.type} message={alert.message} onClose={() => setAlert({ type: '', message: '' })} />
        </div>
      )}

      {/* Selector de evento + buscador */}
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 px-6 py-4 mb-6 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Evento:</label>
          <select
            value={selectedEvent}
            onChange={(e) => { setSelectedEvent(e.target.value); setActiveTopic(null); }}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Selecciona un evento...</option>
            {events.map((ev) => <option key={ev.id} value={ev.id}>{ev.name}</option>)}
          </select>
        </div>
        {can('seminar:read') && (
          <Button variant="secondary" onClick={() => { setSearchModal(true); setRuSearch(''); setRuResults([]); }} icon="🔍">
            Buscar por RU
          </Button>
        )}
      </div>

      {!selectedEvent ? (
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center text-gray-400 dark:text-gray-500">
          Selecciona un evento para ver sus temas
        </div>
      ) : !activeTopic ? (
        // ===== VISTA DE LISTA DE TEMAS =====
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <h3 className="font-semibold text-gray-800 dark:text-gray-100">Temas del evento</h3>
            {can('seminar:create') && (
              <Button onClick={() => { setTopicName(''); setTopicModal(true); }} icon="＋">Nuevo Tema</Button>
            )}
          </div>
          {loading ? (
            <p className="px-6 py-8 text-center text-gray-400 dark:text-gray-500">Cargando...</p>
          ) : topics.length === 0 ? (
            <p className="px-6 py-8 text-center text-gray-400 dark:text-gray-500">No hay temas registrados para este evento</p>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {topics.map((topic) => (
                <div key={topic.id} className="px-6 py-4 flex items-center justify-between gap-3 flex-wrap">
                  <div className="cursor-pointer flex-1" onClick={() => loadEnrollments(topic)}>
                    <p className="font-medium text-gray-800 dark:text-gray-100">{topic.name}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      {topic.total_enrolled} inscritos · {topic.total_delivered || 0} entregados
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      label={topic.certificates_available ? 'Certificados disponibles' : 'Esperando certificados'}
                      color={topic.certificates_available ? 'green' : 'yellow'}
                    />
                    <Button size="sm" variant="secondary" onClick={() => loadEnrollments(topic)}>Abrir</Button>
                    {can('seminar:delete') && (
                      <Button size="sm" variant="ghost" onClick={() => handleDeleteTopic(topic.id)}>✕</Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        // ===== VISTA DE DETALLE DE TEMA =====
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
            <button onClick={() => setActiveTopic(null)} className="text-sm text-blue-600 dark:text-blue-400 hover:underline mb-2">
              ← Volver a temas
            </button>
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-lg">{activeTopic.name}</h3>
              <div className="flex gap-2 flex-wrap">
                {can('seminar:update') && (
                  <Button
                    size="sm"
                    variant={activeTopic.certificates_available ? 'warning' : 'success'}
                    onClick={() => handleToggleAvailable(activeTopic)}
                  >
                    {activeTopic.certificates_available ? 'Deshabilitar certificados' : 'Habilitar certificados'}
                  </Button>
                )}
                {can('seminar:create') && (
                  <Button size="sm" variant="secondary" onClick={() => setImportModal(true)} icon="📂">Carga masiva</Button>
                )}
                {can('seminar:create') && (
                  <Button size="sm" onClick={openEnrollCreate} icon="＋">Inscripción manual</Button>
                )}
              </div>
            </div>
            <Badge
              label={activeTopic.certificates_available ? 'Certificados disponibles' : 'Esperando certificados'}
              color={activeTopic.certificates_available ? 'green' : 'yellow'}
            />
          </div>

          {can('seminar:deliver') && selectedIds.length > 0 && (
            <div className="px-6 py-3 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-100 dark:border-blue-800 flex items-center justify-between">
              <p className="text-sm text-blue-700 dark:text-blue-400">{selectedIds.length} seleccionado(s)</p>
              <Button size="sm" onClick={handleDeliverSelected}>Entregar seleccionados</Button>
            </div>
          )}

          <Table
            columns={enrollColumns}
            data={enrollments}
            loading={loadingEnroll}
            emptyMessage="No hay inscripciones en este tema"
          />
        </div>
      )}

      {/* Modal Nuevo Tema */}
      <Modal isOpen={topicModal} onClose={() => setTopicModal(false)} title="Nuevo Tema" size="sm">
        <form onSubmit={handleCreateTopic} className="space-y-4">
          <Input
            label="Nombre del tema" value={topicName}
            onChange={(e) => setTopicName(e.target.value)}
            required placeholder="Ej. Robótica, Base de Datos..."
          />
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setTopicModal(false)}>Cancelar</Button>
            <Button type="submit" loading={saving}>Crear</Button>
          </div>
        </form>
      </Modal>

      {/* Modal Inscripción */}
      <Modal isOpen={enrollModal} onClose={() => setEnrollModal(false)} title={editingEnrollment ? 'Editar Inscripción' : 'Nueva Inscripción'} size="sm">
        <form onSubmit={handleEnrollSubmit} className="space-y-4">
          <Input
            label="RU (código)" value={enrollForm.ru_code}
            onChange={(e) => setEnrollForm({ ...enrollForm, ru_code: e.target.value })}
            required placeholder="Ej. 12345"
          />
          <Input
            label="Nombre completo" value={enrollForm.full_name}
            onChange={(e) => setEnrollForm({ ...enrollForm, full_name: e.target.value })}
            required placeholder="Nombre y apellido"
          />
          <Input
            label="Carrera" value={enrollForm.career}
            onChange={(e) => setEnrollForm({ ...enrollForm, career: e.target.value })}
            placeholder="Opcional"
          />
          <Input
            label="Monto pagado (0 = gratis)" type="number" value={enrollForm.amount_paid}
            onChange={(e) => setEnrollForm({ ...enrollForm, amount_paid: e.target.value })}
            placeholder="0.00"
          />
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setEnrollModal(false)}>Cancelar</Button>
            <Button type="submit" loading={saving}>{editingEnrollment ? 'Guardar' : 'Registrar'}</Button>
          </div>
        </form>
      </Modal>

      {/* Modal Carga Masiva */}
      <Modal isOpen={importModal} onClose={() => setImportModal(false)} title="Carga masiva de inscripciones" size="sm">
        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Sube un archivo Excel o CSV con las columnas: <span className="font-mono">ru_code, full_name, career, amount_paid</span>
          </p>
          <Button variant="secondary" onClick={downloadTemplate} icon="⬇️">Descargar formato</Button>
          <div
            className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-blue-400"
            onClick={() => fileRef.current?.click()}
          >
            {importFile ? (
              <p className="text-sm text-gray-700 dark:text-gray-300">{importFile.name}</p>
            ) : (
              <p className="text-sm text-gray-400 dark:text-gray-500">Clic para elegir archivo (.xlsx, .xls, .csv)</p>
            )}
          </div>
          <input
            ref={fileRef} type="file" accept=".xlsx,.xls,.csv" className="hidden"
            onChange={(e) => setImportFile(e.target.files[0])}
          />
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setImportModal(false)}>Cancelar</Button>
            <Button onClick={handleImport} loading={saving} disabled={!importFile}>Importar</Button>
          </div>
        </div>
      </Modal>

      {/* Modal Buscar por RU */}
      <Modal isOpen={searchModal} onClose={() => setSearchModal(false)} title="Buscar por RU" size="md">
        <div className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text" value={ruSearch} onChange={(e) => setRuSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleRuSearch()}
              placeholder="Ingresa el RU..."
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button onClick={handleRuSearch} loading={searching}>Buscar</Button>
          </div>

          {ruResults.length > 0 && (
            <div className="space-y-3">
              {ruResults.map((r) => (
                <div key={r.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-gray-800 dark:text-gray-100">{r.full_name}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">{r.career || '—'} · {r.event_name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Tema: <span className="font-medium">{r.topic_name}</span></p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Monto: {parseFloat(r.amount_paid) > 0 ? `Bs. ${parseFloat(r.amount_paid).toFixed(2)}` : 'Gratis'}</p>
                    </div>
                    <div className="text-right space-y-1">
                      <Badge
                        label={r.certificates_available ? 'Disponible' : 'No disponible'}
                        color={r.certificates_available ? 'green' : 'yellow'}
                      />
                      <br />
                      <Badge
                        label={r.status === 'delivered' ? 'Entregado' : 'Pendiente'}
                        color={r.status === 'delivered' ? 'green' : 'gray'}
                      />
                    </div>
                  </div>
                  {r.status === 'registered' && r.certificates_available && can('seminar:deliver') && (
                    <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                      <Button size="sm" onClick={() => handleDeliverFromSearch(r.id)}>✓ Entregar certificado</Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </Modal>
    </PageWrapper>
  );
};

export default Seminar;