'use client'

import { useEffect, useRef, useState, type FormEvent } from 'react'
import {
  AlertTriangle, Bell, BookOpen, CalendarDays, Check, Clock3, Download,
  FileCheck2, FileText, KeyRound, Link2, LockKeyhole, LogOut, ShieldCheck,
  Trash2, UploadCloud, X
} from 'lucide-react'

export type DialogField = {
  label: string
  placeholder?: string
  type?: 'text' | 'email' | 'date' | 'datetime-local' | 'textarea' | 'select'
  options?: string[]
  defaultValue?: string
}

export type DialogSpec = {
  kind?: 'notifications' | 'receipt' | 'confirm_destructive' | 'shortcuts' | 'upload_assignment' | 'drawer'
  title?: string
  description?: string
  fields?: DialogField[]
  warning?: string
  destructiveConfirmText?: string
  receiptData?: {
    student: string
    code: string
    course: string
    group: string
    teacher: string
    date: string
    entryTime: string
    verification: string
    hash: string
  }
  drawerData?: {
    title: string
    subtitle: string
    kicker?: string
    sections: Array<{ label: string; value: string; isCode?: boolean; isBadge?: boolean; badgeTone?: string }>
    jsonPayload?: string
  }
}

const notificationItems = [
  { id: 'n1', icon: Link2, title: 'Enlace actualizado', body: 'El docente publicó un nuevo enlace para Fundamentos de programación.', time: 'Hoy, 9:14 a. m.', tone: 'blue', read: false },
  { id: 'n2', icon: Clock3, title: 'Entrega próxima', body: 'El Taller 04 vence mañana a las 11:59 p. m.', time: 'Ayer, 4:30 p. m.', tone: 'amber', read: false },
  { id: 'n3', icon: BookOpen, title: 'Nueva respuesta', body: 'Javier Pérez respondió tu pregunta en el muro del curso.', time: '7 oct, 2:10 p. m.', tone: 'purple', read: false },
  { id: 'n4', icon: ShieldCheck, title: 'Constancia emitida', body: 'Tu constancia de asistencia para la sesión 08 quedó registrada.', time: '5 oct, 10:15 a. m.', tone: 'blue', read: true },
]

export default function InteractionDialog({ spec, notificationsRead, onClose, onSave, onMarkNotificationsRead }: {
  spec: DialogSpec
  notificationsRead: boolean
  onClose: () => void
  onSave: (message: string) => void
  onMarkNotificationsRead: () => void
}) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [submitting, setSubmitting] = useState(false)
  const [filterNotif, setFilterNotif] = useState<'all' | 'unread'>('all')
  const [selectedFile, setSelectedFile] = useState<string | null>('taller_04_ciclos_kgonzalez.zip (1.4 MB)')

  const isNotifications = spec.kind === 'notifications'
  const isReceipt = spec.kind === 'receipt'
  const isDestructive = spec.kind === 'confirm_destructive'
  const isShortcuts = spec.kind === 'shortcuts'
  const isUpload = spec.kind === 'upload_assignment'
  const isDrawer = spec.kind === 'drawer'

  useEffect(() => {
    const dialog = dialogRef.current
    if (dialog && !dialog.open) dialog.showModal()
    return () => { if (dialog?.open) dialog.close() }
  }, [])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitting(true)
    setTimeout(() => {
      setSubmitting(false)
      onSave('Cambios procesados y registrados correctamente con trazabilidad de auditoría')
    }, 450)
  }

  function handleDestructiveConfirm() {
    setSubmitting(true)
    setTimeout(() => {
      setSubmitting(false)
      onSave(spec.destructiveConfirmText ?? 'Acción destructiva ejecutada y registrada en auditoría')
    }, 400)
  }

  if (isDrawer && spec.drawerData) {
    const d = spec.drawerData
    return (
      <dialog
        ref={dialogRef}
        className="drawer-dialog"
        aria-label={d.title}
        onCancel={(event) => { event.preventDefault(); onClose() }}
        onClick={(event) => { if (event.target === event.currentTarget) onClose() }}
      >
        <div className="drawer-content">
          <header className="drawer-header">
            <div>
              <span className="section-kicker">{d.kicker ?? 'DETALLE DE AUDITORÍA · INSPECCIÓN'}</span>
              <h2>{d.title}</h2>
              <p>{d.subtitle}</p>
            </div>
            <button className="dialog-close" type="button" aria-label="Cerrar panel" onClick={onClose}><X size={18} /></button>
          </header>

          <div className="drawer-sections">
            {d.sections.map((sec) => (
              <div className="drawer-section-card" key={sec.label}>
                <span>{sec.label}</span>
                {sec.isCode ? (
                  <code style={{ fontSize: 10, wordBreak: 'break-all', display: 'block', color: '#274b88' }}>{sec.value}</code>
                ) : sec.isBadge ? (
                  <span className={`status-pill ${sec.badgeTone ?? 'blue'}`} style={{ marginTop: 2, display: 'inline-block' }}>{sec.value}</span>
                ) : (
                  <strong>{sec.value}</strong>
                )}
              </div>
            ))}

            {d.jsonPayload && (
              <div>
                <span className="section-kicker" style={{ display: 'block', margin: '8px 0 4px' }}>CARGA ÚTIL JSON VERIFICADA</span>
                <pre className="drawer-json-box">{d.jsonPayload}</pre>
              </div>
            )}
          </div>

          <footer className="dialog-footer" style={{ marginTop: 'auto', paddingTop: 16 }}>
            <button className="outline-button" type="button" onClick={onClose}>Cerrar panel</button>
            <button className="primary-button" type="button" onClick={() => onSave('Copia del registro de auditoría exportada')}>
              <Download size={14} /> Exportar registro
            </button>
          </footer>
        </div>
      </dialog>
    )
  }

  return (
    <dialog
      ref={dialogRef}
      className="aula-dialog"
      aria-labelledby="interaction-dialog-title"
      aria-describedby="interaction-dialog-description"
      onCancel={(event) => { event.preventDefault(); onClose() }}
      onClick={(event) => { if (event.target === event.currentTarget) onClose() }}
    >
      <section className="dialog-card">
        <header className="dialog-header">
          <div className="dialog-heading-icon" style={{ background: isDestructive ? '#feeceb' : undefined, color: isDestructive ? '#c2392d' : undefined }}>
            {isNotifications ? <Bell size={18} /> : isReceipt ? <FileCheck2 size={18} /> : isDestructive ? <Trash2 size={18} /> : isShortcuts ? <KeyRound size={18} /> : isUpload ? <UploadCloud size={18} /> : spec.warning ? <AlertTriangle size={18} /> : <CalendarDays size={18} />}
          </div>
          <div className="dialog-heading-copy">
            <span className="section-kicker">
              {isNotifications ? 'CENTRO DE ACTIVIDAD' : isReceipt ? 'CONSTANCIA DIGITAL' : isDestructive ? 'CONFIRMACIÓN SENSIBLE' : isShortcuts ? 'AYUDA DE ACCESIBILIDAD' : isUpload ? 'ENTREGA DE ACTIVIDAD' : spec.warning ? 'ACCIÓN DE EMERGENCIA · RB-05' : 'AULA+ · ACCIÓN'}
            </span>
            <h2 id="interaction-dialog-title">
              {isNotifications ? 'Tus notificaciones' : isReceipt ? 'Constancia digital de asistencia' : isDestructive ? (spec.title ?? 'Confirmar acción') : isShortcuts ? 'Atajos de teclado y navegación' : isUpload ? (spec.title ?? 'Subir entrega de tarea') : spec.title}
            </h2>
            <p id="interaction-dialog-description">
              {isNotifications ? 'Novedades recientes de tus cursos y actividades.' : isReceipt ? 'Comprobante institucional emitido conforme a la Ley 1581 de 2012.' : isDestructive ? (spec.description ?? 'Esta acción tiene efectos permanentes en la plataforma.') : isShortcuts ? 'Navega con rapidez por las pantallas y módulos con combinaciones de teclas.' : isUpload ? 'Adjunta tu archivo antes de la fecha límite programada.' : spec.description}
            </p>
          </div>
          <button className="dialog-close" type="button" aria-label="Cerrar ventana" onClick={onClose}><X size={17} /></button>
        </header>

        {isNotifications ? (
          <>
            <div style={{ display: 'flex', gap: 8, padding: '10px 0', borderBottom: '1px solid #edf1f6' }}>
              <button className={`segmented-btn ${filterNotif === 'all' ? 'active' : ''}`} style={{ border: 0, background: filterNotif === 'all' ? '#eaf1fc' : 'transparent', color: filterNotif === 'all' ? '#204d9b' : '#68778f', padding: '4px 9px', borderRadius: 5, fontSize: 10, fontWeight: 600 }} onClick={() => setFilterNotif('all')}>
                Todas (4)
              </button>
              <button className={`segmented-btn ${filterNotif === 'unread' ? 'active' : ''}`} style={{ border: 0, background: filterNotif === 'unread' ? '#eaf1fc' : 'transparent', color: filterNotif === 'unread' ? '#204d9b' : '#68778f', padding: '4px 9px', borderRadius: 5, fontSize: 10, fontWeight: 600 }} onClick={() => setFilterNotif('unread')}>
                No leídas ({notificationsRead ? 0 : 3})
              </button>
            </div>
            <div className="dialog-notification-list">
              {notificationItems
                .filter((item) => filterNotif === 'all' || (!notificationsRead && !item.read))
                .map(({ icon: Icon, title, body, time, tone, read }) => {
                  const isItemRead = notificationsRead || read
                  return (
                    <article className={`dialog-notification ${isItemRead ? 'read' : ''}`} key={title}>
                      <div className={`dialog-notification-icon ${tone}`}><Icon size={16} /></div>
                      <div className="dialog-notification-copy"><strong>{title}</strong><p>{body}</p><small>{time}</small></div>
                      {!isItemRead && <span className="dialog-unread-dot" aria-label="No leída" />}
                    </article>
                  )
                })}
              {filterNotif === 'unread' && notificationsRead && (
                <div className="empty-state-box" style={{ padding: '24px 14px', margin: '10px 0' }}>
                  <div className="empty-state-icon" style={{ width: 36, height: 36 }}><Check size={18} /></div>
                  <h3>¡Estás al día!</h3>
                  <p>No tienes notificaciones pendientes por leer.</p>
                </div>
              )}
            </div>
            <footer className="dialog-footer">
              <button className="outline-button" type="button" onClick={onClose}>Cerrar</button>
              <button className="primary-button" type="button" onClick={onMarkNotificationsRead} disabled={notificationsRead}><Check size={15} />{notificationsRead ? 'Todo leído' : 'Marcar todo como leído'}</button>
            </footer>
          </>
        ) : isReceipt ? (
          <div className="receipt-view">
            <div className="receipt-badge-header">
              <ShieldCheck size={20} className="receipt-shield" />
              <div>
                <strong>ASISTENCIA VERIFICADA Y REGISTRADA</strong>
                <small>UNIAJC · Sede Norte · Periodo 2026-2</small>
              </div>
              <span className="status-pill green">Válida</span>
            </div>
            <div className="receipt-grid">
              <div><span>Estudiante</span><strong>{spec.receiptData?.student ?? 'Kevin Andrés González Dinas'}</strong></div>
              <div><span>Código estudiantil</span><strong>{spec.receiptData?.code ?? '2200417'}</strong></div>
              <div><span>Curso</span><strong>{spec.receiptData?.course ?? 'Fundamentos de programación'}</strong></div>
              <div><span>Grupo y docente</span><strong>{spec.receiptData?.group ?? 'Grupo 841A'} · {spec.receiptData?.teacher ?? 'Javier Pérez Campo'}</strong></div>
              <div><span>Fecha de la clase</span><strong>{spec.receiptData?.date ?? 'Jueves, 8 de octubre de 2026'}</strong></div>
              <div><span>Hora de ingreso</span><strong>{spec.receiptData?.entryTime ?? '10:01:28 a. m.'}</strong></div>
              <div className="receipt-wide"><span>Método de verificación</span><strong>{spec.receiptData?.verification ?? 'Pregunta interactiva conceptual (Bucle while) respondida en 38 s'}</strong></div>
              <div className="receipt-wide"><span>Tratamiento de datos</span><small>Sin captura de fotografías ni datos biométricos. Conforme a Ley 1581 de 2012.</small></div>
              <div className="receipt-wide receipt-hash"><span>Identificador único de auditoría</span><code>{spec.receiptData?.hash ?? 'UNIAJC-VERIF-2026-841A-2200417-8A39F'}</code></div>
            </div>
            <footer className="dialog-footer">
              <button className="outline-button" type="button" onClick={onClose}>Cerrar</button>
              <button className="primary-button" type="button" onClick={() => onSave('Comprobante digital descargado en PDF')}><Download size={15} />Descargar constancia</button>
            </footer>
          </div>
        ) : isDestructive ? (
          <div style={{ paddingTop: 14 }}>
            <div className="destructive-alert">
              <AlertTriangle size={18} />
              <div>
                <strong>{spec.warning ?? 'Atención: esta acción requiere confirmación explícita.'}</strong>
                <p style={{ margin: '4px 0 0', fontSize: 10 }}>{spec.description ?? 'Si continúas, el registro se actualizará y quedará asentado en el log inmutable de auditoría.'}</p>
              </div>
            </div>
            <p style={{ fontSize: 10.5, color: '#56667d', lineHeight: 1.5, margin: '14px 0 18px' }}>
              Por favor confirma que deseas proceder con esta operación en la plataforma institucional aula+.
            </p>
            <footer className="dialog-footer">
              <button className="outline-button" type="button" onClick={onClose} disabled={submitting}>Cancelar</button>
              <button className="destructive-button" type="button" onClick={handleDestructiveConfirm} disabled={submitting}>
                <Trash2 size={14} /> {submitting ? 'Procesando...' : (spec.destructiveConfirmText ?? 'Confirmar y proceder')}
              </button>
            </footer>
          </div>
        ) : isShortcuts ? (
          <div style={{ paddingTop: 12 }}>
            <p style={{ fontSize: 10.5, color: '#68778f', margin: '0 0 12px' }}>
              Usa los siguientes atajos en cualquier momento dentro de la plataforma:
            </p>
            <div className="shortcuts-grid">
              <div className="shortcut-row"><span>Búsqueda rápida</span><div className="shortcut-keys"><kbd>⌘</kbd><kbd>K</kbd> / <kbd>Ctrl</kbd><kbd>K</kbd></div></div>
              <div className="shortcut-row"><span>Cerrar ventana o drawer</span><div className="shortcut-keys"><kbd>Esc</kbd></div></div>
              <div className="shortcut-row"><span>Ver ayuda y atajos</span><div className="shortcut-keys"><kbd>?</kbd></div></div>
              <div className="shortcut-row"><span>Navegación de campos</span><div className="shortcut-keys"><kbd>Tab</kbd></div></div>
              <div className="shortcut-row"><span>Confirmar formulario</span><div className="shortcut-keys"><kbd>Enter</kbd></div></div>
              <div className="shortcut-row"><span>Rol: Estudiante</span><div className="shortcut-keys"><kbd>Alt</kbd><kbd>1</kbd></div></div>
              <div className="shortcut-row"><span>Rol: Docente</span><div className="shortcut-keys"><kbd>Alt</kbd><kbd>2</kbd></div></div>
              <div className="shortcut-row"><span>Rol: Administrador</span><div className="shortcut-keys"><kbd>Alt</kbd><kbd>3</kbd></div></div>
            </div>
            <footer className="dialog-footer">
              <button className="primary-button" type="button" onClick={onClose}>Entendido</button>
            </footer>
          </div>
        ) : isUpload ? (
          <form className="dialog-form" onSubmit={handleSubmit}>
            <div className="file-dropzone" onClick={() => setSelectedFile('taller_04_ciclos_kgonzalez_v2.zip (1.6 MB)')}>
              <div className="dropzone-icon"><UploadCloud size={22} /></div>
              <div className="dropzone-info">
                <strong>Arrastra tu entrega aquí o haz clic para examinar</strong>
                <small>Formatos admitidos: ZIP, PDF, PY, IPYNB (Máximo 25 MB)</small>
              </div>
            </div>
            {selectedFile && (
              <div style={{ background: '#f5f8fd', border: '1px solid #dbe6fa', borderRadius: 8, padding: '10px 12px', marginTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <FileText size={16} style={{ color: '#2b579f' }} />
                  <span style={{ fontSize: 10.5, fontWeight: 600, color: '#273852' }}>{selectedFile}</span>
                </div>
                <button type="button" style={{ border: 0, background: 'none', color: '#c2392d', padding: 2 }} onClick={() => setSelectedFile(null)}>
                  <X size={15} />
                </button>
              </div>
            )}
            <div className="upload-progress">
              <div className="upload-progress-bar" style={{ width: selectedFile ? '100%' : '0%' }} />
            </div>
            <label className="dialog-field dialog-field-wide" style={{ marginTop: 14 }}>
              <span>Comentario opcional para el docente</span>
              <textarea placeholder="Ej. Se incluye el pseudocódigo y los tres ejercicios resueltos en Python." rows={2} />
            </label>
            <footer className="dialog-footer">
              <button className="outline-button" type="button" onClick={onClose} disabled={submitting}>Cancelar</button>
              <button className="primary-button" type="submit" disabled={!selectedFile || submitting}>
                <Check size={15} /> {submitting ? 'Subiendo entrega...' : 'Confirmar entrega'}
              </button>
            </footer>
          </form>
        ) : (
          <form className="dialog-form" onSubmit={handleSubmit}>
            {spec.warning && (
              <div className="dialog-alert-warning">
                <AlertTriangle size={16} />
                <span>{spec.warning}</span>
              </div>
            )}
            <div className="dialog-fields">
              {(spec.fields ?? []).map((field) => (
                <label className={`dialog-field ${field.type === 'textarea' ? 'dialog-field-wide' : ''}`} key={field.label}>
                  <span>{field.label}</span>
                  {field.type === 'textarea' ? (
                    <textarea required placeholder={field.placeholder} rows={3} defaultValue={field.defaultValue} />
                  ) : field.type === 'select' ? (
                    <select required className="dialog-select" defaultValue={field.defaultValue ?? field.options?.[0]}>
                      {(field.options ?? []).map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : (
                    <input required type={field.type ?? 'text'} placeholder={field.placeholder} defaultValue={field.defaultValue} />
                  )}
                </label>
              ))}
            </div>
            <p className="dialog-demo-note"><span />Demostración interactiva de anteproyecto · Auditoría registrada.</p>
            <footer className="dialog-footer">
              <button className="outline-button" type="button" onClick={onClose} disabled={submitting}>Cancelar</button>
              <button className="primary-button" type="submit" disabled={submitting}>
                <Check size={15} /> {submitting ? 'Guardando...' : 'Guardar cambios'}
              </button>
            </footer>
          </form>
        )}
      </section>
    </dialog>
  )
}

