'use client'

import { useEffect, useRef, type FormEvent } from 'react'
import { AlertTriangle, Bell, BookOpen, CalendarDays, Check, Clock3, Download, FileCheck2, Link2, ShieldCheck, X } from 'lucide-react'

export type DialogField = {
  label: string
  placeholder?: string
  type?: 'text' | 'email' | 'date' | 'datetime-local' | 'textarea' | 'select'
  options?: string[]
  defaultValue?: string
}

export type DialogSpec = {
  kind?: 'notifications' | 'receipt' | 'menu' | 'information'
  title?: string
  description?: string
  details?: Array<{ label: string; value: string }>
  fields?: DialogField[]
  menuOptions?: Array<{ label: string; message: string }>
  warning?: string
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
}

const notificationItems = [
  { icon: Link2, title: 'Enlace actualizado', body: 'El docente publicó un nuevo enlace para Fundamentos de programación.', time: 'Hoy, 9:14 a. m.', tone: 'blue' },
  { icon: Clock3, title: 'Entrega próxima', body: 'El Taller 04 vence mañana a las 11:59 p. m.', time: 'Ayer, 4:30 p. m.', tone: 'amber' },
  { icon: BookOpen, title: 'Nueva respuesta', body: 'Javier Pérez respondió tu pregunta en el muro del curso.', time: '7 oct, 2:10 p. m.', tone: 'purple' },
]

export default function InteractionDialog({ spec, notificationsRead, onClose, onSave, onMarkNotificationsRead }: {
  spec: DialogSpec
  notificationsRead: boolean
  onClose: () => void
  onSave: (message: string) => void
  onMarkNotificationsRead: () => void
}) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const isNotifications = spec.kind === 'notifications'
  const isReceipt = spec.kind === 'receipt'
  const isMenu = spec.kind === 'menu'
  const isInformation = spec.kind === 'information'

  useEffect(() => {
    const dialog = dialogRef.current
    if (dialog && !dialog.open) dialog.showModal()
    return () => { if (dialog?.open) dialog.close() }
  }, [])

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    onSave('Cambios procesados y registrados correctamente')
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
          <div className="dialog-heading-icon">
            {isNotifications ? <Bell size={18} /> : isReceipt || isInformation ? <FileCheck2 size={18} /> : spec.warning ? <AlertTriangle size={18} /> : <CalendarDays size={18} />}
          </div>
          <div className="dialog-heading-copy">
            <span className="section-kicker">
              {isNotifications ? 'CENTRO DE ACTIVIDAD' : isReceipt ? 'CONSTANCIA DIGITAL' : isInformation ? 'DOCUMENTACIÓN DE PANTALLA' : spec.warning ? 'ACCIÓN DE EMERGENCIA · RB-05' : 'AULA+ · ACCIÓN RÁPIDA'}
            </span>
            <h2 id="interaction-dialog-title">
              {isNotifications ? 'Tus notificaciones' : isReceipt ? 'Constancia digital de asistencia' : spec.title}
            </h2>
            <p id="interaction-dialog-description">
              {isNotifications ? 'Novedades recientes de tus cursos y actividades.' : isReceipt ? 'Comprobante institucional emitido conforme a la Ley 1581 de 2012.' : spec.description}
            </p>
          </div>
          <button className="dialog-close" type="button" aria-label="Cerrar ventana" onClick={onClose}><X size={17} /></button>
        </header>

        {isMenu ? (
          <div className="dialog-menu-options" style={{ display: 'grid', gap: 8, paddingTop: 18 }}>
            {(spec.menuOptions ?? []).map((option) => (
              <button key={option.message} type="button" className="outline-button" style={{ justifyContent: 'space-between', width: '100%' }} onClick={() => onSave(option.message)}>
                {option.label}<span aria-hidden="true">→</span>
              </button>
            ))}
            <footer className="dialog-footer">
              <button className="outline-button" type="button" onClick={onClose}>Cerrar</button>
            </footer>
          </div>
        ) : isNotifications ? (
          <>
            <div className="dialog-notification-list">
              {notificationItems.map(({ icon: Icon, title, body, time, tone }) => (
                <article className={`dialog-notification ${notificationsRead ? 'read' : ''}`} key={title}>
                  <div className={`dialog-notification-icon ${tone}`}><Icon size={16} /></div>
                  <div className="dialog-notification-copy"><strong>{title}</strong><p>{body}</p><small>{time}</small></div>
                  {!notificationsRead && <span className="dialog-unread-dot" aria-label="No leída" />}
                </article>
              ))}
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
        ) : isInformation ? (
          <div className="specification-view">
            <div className="specification-details">
              {(spec.details ?? []).map((detail) => <div className="specification-detail" key={detail.label}><span>{detail.label}</span><strong>{detail.value}</strong></div>)}
            </div>
            <footer className="dialog-footer"><button className="primary-button" type="button" onClick={onClose}>Entendido</button></footer>
          </div>
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
              <button className="outline-button" type="button" onClick={onClose}>Cancelar</button>
              <button className="primary-button" type="submit"><Check size={15} />Guardar cambios</button>
            </footer>
          </form>
        )}
      </section>
    </dialog>
  )
}
