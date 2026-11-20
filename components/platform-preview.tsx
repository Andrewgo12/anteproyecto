'use client'

import { useEffect, useMemo, useState } from 'react'
import CommandPalette, { type CommandOption } from '@/components/command-palette'
import {
  Activity, AlertTriangle, ArrowDownUp, ArrowLeft, ArrowRight, Bell, BookOpen, CalendarDays,
  Check, CheckCheck, ChevronDown, ChevronLeft, ChevronRight, CircleHelp,
  ClipboardCheck, Clock3, Download, ExternalLink, Eye, EyeOff, FileCheck2, FileText, Filter, Flag,
  GraduationCap, KeyRound, Link2, LockKeyhole, LogOut, Menu, MoreHorizontal, Plus, Search,
  Settings2, ShieldCheck, Sparkles, Trash2, UploadCloud, User, Users, Video, X,
} from 'lucide-react'
import InteractionDialog, { type DialogSpec } from '@/components/interaction-dialog'

type Role = 'Estudiante' | 'Docente' | 'Administrador'
type Screen = { id: string; name: string; route: string; roles: Role[]; group: string }

const screens: Screen[] = [
  { id: 'P-01', name: 'Inicio de sesión', route: '/iniciar-sesion', roles: ['Estudiante','Docente','Administrador'], group: 'Acceso y cuenta' },
  { id: 'P-02', name: 'Recuperar contraseña', route: '/recuperar', roles: ['Estudiante','Docente','Administrador'], group: 'Acceso y cuenta' },
  { id: 'P-03', name: 'Nueva contraseña', route: '/restablecer/:token', roles: ['Estudiante','Docente','Administrador'], group: 'Acceso y cuenta' },
  { id: 'P-04', name: 'Mi perfil', route: '/perfil', roles: ['Estudiante','Docente','Administrador'], group: 'Acceso y cuenta' },
  { id: 'P-05', name: 'Notificaciones', route: '/notificaciones', roles: ['Estudiante','Docente','Administrador'], group: 'Acceso y cuenta' },
  { id: 'P-06', name: 'Ayuda y privacidad', route: '/ayuda', roles: ['Estudiante','Docente','Administrador'], group: 'Acceso y cuenta' },
  { id: 'P-07', name: 'Inicio del estudiante', route: '/estudiante', roles: ['Estudiante'], group: 'Estudiante' },
  { id: 'P-08', name: 'Clases de hoy', route: '/estudiante/clases', roles: ['Estudiante'], group: 'Estudiante' },
  { id: 'P-09', name: 'Verificación de presencia', route: '/estudiante/sesiones/:id/verificacion', roles: ['Estudiante'], group: 'Estudiante' },
  { id: 'P-10', name: 'Mi asistencia', route: '/estudiante/asistencia', roles: ['Estudiante'], group: 'Estudiante' },
  { id: 'P-11', name: 'Muro de dudas', route: '/estudiante/cursos/:id/dudas', roles: ['Estudiante'], group: 'Estudiante' },
  { id: 'P-12', name: 'Herramientas recomendadas', route: '/estudiante/cursos/:id/herramientas', roles: ['Estudiante'], group: 'Estudiante' },
  { id: 'P-13', name: 'Entregas (semáforo)', route: '/estudiante/cursos/:id/entregas', roles: ['Estudiante'], group: 'Estudiante' },
  { id: 'P-14', name: 'Inicio del docente', route: '/docente', roles: ['Docente'], group: 'Docente' },
  { id: 'P-15', name: 'Enlaces de mis cursos', route: '/docente/cursos/:id/enlaces', roles: ['Docente'], group: 'Docente' },
  { id: 'P-16', name: 'Asistencia de la sesión', route: '/docente/sesiones/:id/asistencia', roles: ['Docente'], group: 'Docente' },
  { id: 'P-17', name: 'Banco de preguntas', route: '/docente/cursos/:id/preguntas', roles: ['Docente'], group: 'Docente' },
  { id: 'P-18', name: 'Reporte de asistencia', route: '/docente/cursos/:id/reporte', roles: ['Docente'], group: 'Docente' },
  { id: 'P-19', name: 'Muro de dudas (docente)', route: '/docente/cursos/:id/dudas', roles: ['Docente'], group: 'Docente' },
  { id: 'P-20', name: 'Herramientas (docente)', route: '/docente/cursos/:id/herramientas', roles: ['Docente'], group: 'Docente' },
  { id: 'P-21', name: 'Tareas y semáforo', route: '/docente/cursos/:id/tareas', roles: ['Docente'], group: 'Docente' },
  { id: 'P-22', name: 'Inicio del administrador', route: '/admin', roles: ['Administrador'], group: 'Administración' },
  { id: 'P-23', name: 'Usuarios', route: '/admin/usuarios', roles: ['Administrador'], group: 'Administración' },
  { id: 'P-24', name: 'Cursos y horarios', route: '/admin/cursos', roles: ['Administrador'], group: 'Administración' },
  { id: 'P-25', name: 'Matrículas', route: '/admin/cursos/:id/matriculas', roles: ['Administrador'], group: 'Administración' },
  { id: 'P-26', name: 'Parámetros', route: '/admin/parametros', roles: ['Administrador'], group: 'Administración' },
  { id: 'P-27', name: 'Auditoría', route: '/admin/auditoria', roles: ['Administrador'], group: 'Administración' },
  { id: 'P-28', name: 'Reclamaciones de datos', route: '/admin/reclamaciones', roles: ['Administrador'], group: 'Administración' },
  { id: 'P-29', name: 'Catálogo académico', route: '/admin/catalogo', roles: ['Administrador'], group: 'Administración' },
  { id: 'P-30', name: 'Grupos', route: '/admin/grupos', roles: ['Administrador'], group: 'Administración' },
  { id: 'P-31', name: 'Perfiles administrativos', route: '/admin/perfiles', roles: ['Administrador'], group: 'Administración' },
  { id: 'P-32', name: 'Docente: mis grupos', route: '/docente/grupos', roles: ['Docente'], group: 'Flujos complementarios' },
  { id: 'P-33', name: 'Mi calendario', route: '/calendario', roles: ['Estudiante','Docente'], group: 'Flujos complementarios' },
  { id: 'P-34', name: 'Abrir en el navegador', route: '/abrir-navegador', roles: ['Estudiante'], group: 'Flujos complementarios' },
  { id: 'P-35', name: 'Guía para instalar la aplicación', route: '/instalar', roles: ['Estudiante','Docente'], group: 'Flujos complementarios' },
  { id: 'P-36', name: 'Privacidad y datos', route: '/perfil/privacidad', roles: ['Estudiante'], group: 'Flujos complementarios' },
]

const iconFor = (group: string) => group === 'Estudiante' ? BookOpen : group === 'Docente' ? GraduationCap : group === 'Administración' ? Settings2 : ShieldCheck

export default function PlatformPreview() {
  const [role, setRole] = useState<Role>('Estudiante')
  const [activeId, setActiveId] = useState('P-07')
  const [search, setSearch] = useState('')
  const [notice, setNotice] = useState('')
  const [dialog, setDialog] = useState<DialogSpec | null>(null)
  const [notificationsRead, setNotificationsRead] = useState(false)
  const [tab, setTab] = useState('Todas')
  const [showAll, setShowAll] = useState(false)
  const [week, setWeek] = useState(0)
  const [commandOpen, setCommandOpen] = useState(false)
  const [accountMenuOpen, setAccountMenuOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const visibleScreens = useMemo(() => screens.filter((screen) => (showAll || screen.roles.includes(role)) && `${screen.id} ${screen.name}`.toLowerCase().includes(search.toLowerCase())), [role, search, showAll])
  const commandOptions = useMemo<CommandOption[]>(() => [
    ...screens.map((screen) => ({ id: screen.id, label: screen.name, description: screen.route, category: screen.group })),
    { id: 'COMMAND_NOTIFICATIONS', label: 'Centro de notificaciones', description: 'Revisa novedades recientes de tus cursos', category: 'Acciones' },
    { id: 'COMMAND_HELP', label: 'Ayuda y privacidad', description: 'Consulta la guía y los atajos de teclado', category: 'Acciones' },
    { id: 'COMMAND_SHORTCUTS', label: 'Atajos de teclado', description: 'Consulta las combinaciones de teclas de la plataforma', category: 'Acciones' },
  ], [])
  const current = screens.find((screen) => screen.id === activeId) ?? screens[6]

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const isInput = event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement || event.target instanceof HTMLSelectElement
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setCommandOpen(true)
      } else if (event.key === '?' && !isInput) {
        event.preventDefault()
        setDialog({ kind: 'shortcuts' })
      } else if (event.altKey && event.key === '1' && !isInput) {
        event.preventDefault()
        selectRole('Estudiante')
      } else if (event.altKey && event.key === '2' && !isInput) {
        event.preventDefault()
        selectRole('Docente')
      } else if (event.altKey && event.key === '3' && !isInput) {
        event.preventDefault()
        selectRole('Administrador')
      } else if (event.key === 'Escape') {
        setAccountMenuOpen(false)
        setMobileMenuOpen(false)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const chooseCommand = (id: string) => {
    if (id === 'COMMAND_NOTIFICATIONS') { setDialog({ kind: 'notifications' }); return }
    if (id === 'COMMAND_HELP') { choose('P-06'); return }
    if (id === 'COMMAND_SHORTCUTS') { setDialog({ kind: 'shortcuts' }); return }
    choose(id)
  }

  const selectRole = (next: Role) => {
    setRole(next)
    setShowAll(false)
    const first = screens.find((item) => item.roles.includes(next) && item.group !== 'Acceso y cuenta')
    if (first) setActiveId(first.id)
    setNotice(`Rol cambiado a ${next} (Demostración interactiva de prototipo)`)
    window.setTimeout(() => setNotice(''), 2400)
  }

  const choose = (id: string) => {
    setActiveId(id)
    setNotice('')
    setMobileMenuOpen(false)
  }

  const action = (message: string, customSpec?: DialogSpec) => {
    if (customSpec) {
      setDialog(customSpec)
      return
    }
    const normalized = message.toLowerCase()
    const dialogByAction: Array<[RegExp, DialogSpec]> = [
      [/cambio de emergencia/, {
        title: 'Cambio de emergencia de enlace (RB-05)',
        description: 'Actualización inmediata para resolver imprevistos técnicos sin depender de la ventana de bloqueo.',
        warning: 'Esta acción notificará al instante a todos los estudiantes conectados y quedará registrada en el log inmutable de auditoría institucional.',
        fields: [
          {
            label: 'Motivo del imprevisto (lista corta obligatoria)',
            type: 'select',
            options: [
              'Caída o inestabilidad de la plataforma habitual (Teams/Meet/Zoom)',
              'Problemas de conectividad o energía del docente',
              'Capacidad máxima de sala alcanzada',
              'Enlace caducado o sala no disponible'
            ]
          },
          { label: 'Nuevo enlace de la sesión (HTTPS)', placeholder: 'https://meet.google.com/abc-defg-hij', type: 'text' },
          { label: 'Nota explicativa para los estudiantes', placeholder: 'Nos trasladamos a Meet debido a problemas con el audio de Teams.', type: 'textarea' }
        ]
      }],
      [/confirmar presencia/, {
        title: 'Confirmar presencia manual por docente (RB-10)',
        description: 'Valida la asistencia de un estudiante con justificación pedagógica u operativa (solo desde incompleta o ausente).',
        fields: [
          { label: 'Estudiante', placeholder: 'Nombre del estudiante', defaultValue: 'Valentina Cruz' },
          { label: 'Motivo obligatorio (máx. 200 caracteres)', placeholder: 'Estudiante reportó caída de conexión al inicio de la sesión y participó activamente en el chat.', type: 'textarea' }
        ]
      }],
      [/constancia digital/, {
        kind: 'receipt',
        receiptData: {
          student: 'Kevin Andrés González Dinas',
          code: '2200417',
          course: 'Fundamentos de programación',
          group: 'Grupo 841A',
          teacher: 'Javier Pérez Campo',
          date: 'Jueves, 8 de octubre de 2026',
          entryTime: '10:01:28 a. m.',
          verification: 'Pregunta conceptual respondida en 38 s (Bucle while) · Intento 1 de 2',
          hash: 'UNIAJC-VERIF-2026-841A-2200417-8A39F'
        }
      }],
      [/subir entrega|cargar entrega|adjuntar tarea/, {
        kind: 'upload_assignment',
        title: 'Subir entrega de actividad',
        description: 'Adjunta el archivo comprimido o documento antes de la fecha límite programada.'
      }],
      [/atajos de teclado/, {
        kind: 'shortcuts'
      }],
      [/cerrar sesión/, {
        kind: 'confirm_destructive',
        title: '¿Cerrar sesión institucional?',
        description: 'Se cerrará el acceso de tu cuenta de demostración en este dispositivo.',
        warning: 'Si tienes formularios o borradores sin guardar, no se conservarán.',
        destructiveConfirmText: 'Cerrar sesión institucional'
      }],
      [/solicitar supresión|eliminar cuenta/, {
        kind: 'confirm_destructive',
        title: 'Solicitud formal de supresión de datos (Ley 1581 de 2012)',
        description: 'La supresión procederá conforme al Decreto 1377 de 2013, considerando los deberes legales de conservación de registros académicos de la UNIAJC.',
        warning: 'Atención: Los registros históricos de notas y títulos universitarios no pueden ser eliminados por mandato legal del Ministerio de Educación Nacional.',
        destructiveConfirmText: 'Radicar solicitud formal de supresión'
      }],
      [/preferencias de notificación/, {
        title: 'Preferencias de notificación institucional',
        description: 'Configura por qué canales y con qué frecuencia deseas recibir novedades de tus cursos.',
        fields: [
          { label: 'Avisos de enlaces y emergencias (RB-05)', type: 'select', options: ['Instantáneo por correo y push', 'Solo correo institucional', 'Solo push en plataforma'] },
          { label: 'Recordatorios de entregas y tareas (semáforo)', type: 'select', options: ['24 horas antes del vencimiento', '48 horas antes', 'El mismo día por la mañana', 'Desactivado'] },
          { label: 'Respuestas en el muro de dudas', type: 'select', options: ['Inmediato', 'Resumen diario a las 6:00 p. m.', 'Solo menciones directas'] },
          { label: 'Constancias de asistencia digitales (RB-12)', type: 'select', options: ['Envío automático al correo institucional', 'Solo guardar en mi historial'] }
        ]
      }],
      [/crear usuario/, {
        title: 'Registrar nuevo usuario institucional',
        description: 'Da de alta una cuenta institucional en el sistema con permisos por rol.',
        fields: [
          { label: 'Nombres completos', placeholder: 'Laura Sofía' },
          { label: 'Apellidos', placeholder: 'Gómez Morales' },
          { label: 'Correo institucional', placeholder: 'laura.gomez@estudiantes.uniajc.edu.co', type: 'email' },
          { label: 'Rol institucional', type: 'select', options: ['Estudiante', 'Docente', 'Administrador'] },
          { label: 'Programa o dependencia', placeholder: 'Ingeniería de Sistemas' }
        ]
      }],
      [/importar csv/, {
        title: 'Matrícula masiva por CSV (F-ADM-07)',
        description: 'Copia y pega o importa la lista de correos institucionales de los estudiantes para el Grupo 841A.',
        fields: [
          { label: 'Correos institucionales (uno por línea)', placeholder: 'laura.gomez@estudiantes.uniajc.edu.co\nmateo.rojas@estudiantes.uniajc.edu.co\nvalentina.cruz@estudiantes.uniajc.edu.co', type: 'textarea' },
          { label: 'Periodo académico', defaultValue: '2026-2', placeholder: '2026-2' }
        ]
      }],
      [/formulario para publicar enlace/, { title: 'Publicar enlace de clase', description: 'Comparte con tu grupo un acceso claro y actualizado a la sesión virtual.', fields: [{ label: 'Nombre de la clase', placeholder: 'Fundamentos de programación' }, { label: 'Enlace de la sesión', placeholder: 'https://...' }, { label: 'Fecha de la clase', type: 'date' }, { label: 'Nota para el grupo', type: 'textarea', placeholder: 'Agrega una indicación opcional' }] }],
      [/formulario para crear una tarea/, { title: 'Crear una tarea', description: 'Define la actividad y deja visible la fecha límite para tus estudiantes.', fields: [{ label: 'Nombre de la actividad', placeholder: 'Taller 05 · Arreglos' }, { label: 'Curso', placeholder: 'Fundamentos de programación' }, { label: 'Fecha y hora límite', type: 'datetime-local' }, { label: 'Instrucciones', type: 'textarea', placeholder: 'Describe qué deben entregar' }] }],
      [/^recomendar herramienta/, { title: 'Recomendar una herramienta', description: 'Añade un recurso útil al espacio de aprendizaje del curso.', fields: [{ label: 'Nombre del recurso', placeholder: 'Nombre de la herramienta' }, { label: 'Dirección web', placeholder: 'https://...' }, { label: '¿Para qué sirve?', type: 'textarea', placeholder: 'Describe brevemente el recurso' }] }],
      [/^nueva pregunta agregada/, { title: 'Agregar pregunta al banco (RB-08)', description: 'Prepara una pregunta de opción múltiple para la verificación de asistencia interactiva.', fields: [{ label: 'Tema curricular', type: 'select', options: ['Ciclos', 'Arreglos', 'Funciones', 'Variables y tipos', 'Condicionales'] }, { label: 'Enunciado de la pregunta', type: 'textarea', placeholder: 'Escribe el enunciado conceptual' }, { label: 'Opción correcta', placeholder: 'Escribe la respuesta correcta' }, { label: 'Opciones distractoras (una por línea)', type: 'textarea', placeholder: 'Opción incorrecta 1\nOpción incorrecta 2\nOpción incorrecta 3' }] }],
      [/atender reclamación/, {
        title: 'Atención formal de Habeas Data (Ley 1581 de 2012)',
        description: 'Procesa y emite respuesta motivada al titular dentro de los 15 días hábiles legales.',
        fields: [
          { label: 'Radicado oficial', defaultValue: 'RD-2026-014' },
          { label: 'Titular solicitante', defaultValue: 'Estudiante · CC •••••184' },
          { label: 'Tipo de derecho ejercido', type: 'select', options: ['Consulta de registros de asistencia', 'Actualización de correo institucional', 'Supresión de cuenta inactiva (egresado)', 'Revocatoria de autorización'] },
          { label: 'Respuesta formal motivada (máx. 1000 caracteres)', type: 'textarea', placeholder: 'Describe la actuación institucional adoptada y las disposiciones de la política de tratamiento de datos personales de la UNIAJC...' }
        ]
      }],
      [/matricular estudiante/, {
        title: 'Matricular estudiante en curso y grupo (F-ADM-07)',
        description: 'Inscribe a un estudiante en Fundamentos de programación · Grupo 841A.',
        fields: [
          { label: 'Código estudiantil', placeholder: '2200475' },
          { label: 'Nombres completos', placeholder: 'Carlos Alberto' },
          { label: 'Apellidos', placeholder: 'Méndez Sánchez' },
          { label: 'Correo institucional', type: 'email', placeholder: 'carlos.mendez@estudiantes.uniajc.edu.co' },
          { label: 'Periodo académico', defaultValue: '2026-2' }
        ]
      }],
      [/inspeccionar carga útil|inspeccionar bloque/, {
        kind: 'drawer',
        drawerData: {
          title: 'Bloque #1482 · CAMBIO_EMERGENCIA_ENLACE (RB-05)',
          subtitle: 'Sesión 09 · Fundamentos de programación · Grupo 841A',
          kicker: 'CADENA CRIPTOGRÁFICA INMUTABLE (SHA-256)',
          sections: [
            { label: 'Identificador del bloque SHA-256', value: '7f3a9e14c0b29845d16a8c3d91f24e0b5832a1e948c27183fa4192b0e6d8a351', isCode: true },
            { label: 'Fecha y hora con sello de tiempo NTP', value: 'Jueves, 8 de octubre de 2026 · 09:42:15.318 -05:00' },
            { label: 'Actor responsable y rol', value: 'Javier Pérez Campo · Docente Titular (DOC-4182)' },
            { label: 'IP de origen y User-Agent', value: '181.61.204.12 · Chrome 128 / Windows 11', isCode: true },
            { label: 'Estado de verificación institucional', value: 'Firmado y verificado (DTIC)', isBadge: true, badgeTone: 'green' }
          ],
          jsonPayload: JSON.stringify({
            version: '2.0',
            evento: 'CAMBIO_EMERGENCIA_ENLACE',
            regla_negocio: 'RB-05',
            curso_id: 'SIS-101',
            grupo: '841A',
            sesion_numero: 9,
            timestamp_utc: '2026-10-08T14:42:15.318Z',
            motivo_declarado: 'Caída de sala virtual previa en Teams',
            enlace_anterior: 'https://teams.microsoft.com/l/meetup-841a',
            enlace_nuevo: 'https://teams.microsoft.com/l/meetup-841a-v2',
            estudiantes_notificados: 32,
            notificacion_push_exitosa: true,
            hash_bloque_previo: '319c5a4d89012349e190248ab0912f8409128390fca9012839efa019283901a2',
            hash_sha256_bloque: '7f3a9e14c0b29845d16a8c3d91f24e0b5832a1e948c27183fa4192b0e6d8a351'
          }, null, 2)
        }
      }],
      [/nueva asignatura/, {
        title: 'Crear nueva asignatura en el catálogo (F-ADM-12)',
        description: 'Añade una asignatura al plan de estudios de la Facultad de Ingeniería.',
        fields: [
          { label: 'Código institucional', placeholder: 'SIS-601' },
          { label: 'Nombre de la materia', placeholder: 'Arquitectura de Software' },
          { label: 'Programa académico', type: 'select', options: ['Ingeniería de Sistemas (SNIES 10245)', 'Tecnología en Sistemas', 'Ingeniería Industrial', 'Ingeniería Electrónica'] },
          { label: 'Semestre y créditos', placeholder: 'Semestre 6 · 3 créditos' }
        ]
      }],
      [/nuevo periodo/, {
        title: 'Crear nuevo periodo académico',
        description: 'Configura un nuevo periodo para programación académica en UNIAJC.',
        fields: [
          { label: 'Identificador del periodo', placeholder: '2027-1' },
          { label: 'Fecha de inicio de clases', type: 'date' },
          { label: 'Fecha de finalización', type: 'date' },
          { label: 'Estado inicial', type: 'select', options: ['En planeación', 'Activo para matrículas', 'En curso'] }
        ]
      }],
      [/solicitar acceso a mis datos/, { title: 'Solicitud de acceso a datos personales (Habeas Data)', description: 'Radica una petición formal de consulta conforme a la Ley 1581 de 2012 (plazo legal perentorio: 15 días hábiles).', fields: [{ label: 'Radicado oficial automático', defaultValue: 'RD-2026-015' }, { label: 'Correo institucional titular', type: 'email', defaultValue: 'kevin.gonzalez@estudiantes.uniajc.edu.co' }, { label: 'Detalle de la solicitud de información', type: 'textarea', placeholder: 'Indica los datos de asistencia o actividad que deseas consultar formalmente.' }] }],
      [/edición de perfil/, { title: 'Editar perfil institucional', description: 'Actualiza los datos de tu cuenta de demostración.', fields: [{ label: 'Nombres', placeholder: 'Kevin Andrés' }, { label: 'Apellidos', placeholder: 'González Dinas' }, { label: 'Correo institucional', type: 'email', placeholder: 'nombre@uniajc.edu.co' }, { label: 'Programa académico', placeholder: 'Ingeniería de Sistemas' }] }],
      [/^crear grupo/, { title: 'Crear grupo académico', description: 'Organiza una nueva clase dentro del periodo académico actual.', fields: [{ label: 'Nombre del grupo', placeholder: '843B' }, { label: 'Curso', placeholder: 'Selecciona o escribe una materia' }, { label: 'Docente responsable', placeholder: 'Nombre del docente' }, { label: 'Jornada y horario', placeholder: 'Mañana · Lunes y miércoles' }] }],
    ]
    const matchingDialog = dialogByAction.find(([pattern]) => pattern.test(normalized))
    if (matchingDialog) { setDialog(matchingDialog[1]); return }
    setNotice(message)
    window.setTimeout(() => setNotice(''), 2800)
  }
  const groups = [...new Set(visibleScreens.map((screen) => screen.group))]

  return (
    <div className="platform-shell">
      <aside className={`sidebar ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="brand"><div className="brand-mark"><Video size={19} strokeWidth={2.3} /></div><div><strong>aula<span>+</span></strong><small>UNIAJC · Sede Norte</small></div></div>
        <div className="role-caption">VISTA DEL PROTOTIPO</div>
        <div className="role-switch" role="group" aria-label="Seleccionar rol">
          {(['Estudiante','Docente','Administrador'] as Role[]).map((item) => <button key={item} className={role === item && !showAll ? 'role-option selected' : 'role-option'} onClick={() => selectRole(item)}>{item === 'Estudiante' ? 'Est.' : item === 'Administrador' ? 'Admin' : item}</button>)}
        </div>
        <button className={showAll ? 'all-views active' : 'all-views'} onClick={() => setShowAll((value) => !value)}><LayersIcon />Todas las vistas <span>{screens.length}</span></button>
        <label className="screen-search"><Search size={15} /><input aria-label="Filtrar vistas en el menú" placeholder="Buscar pantalla..." value={search} onChange={(event) => setSearch(event.target.value)} /><button type="button" className="search-shortcut" aria-label="Abrir búsqueda rápida (Control o Command + K)" onClick={() => setCommandOpen(true)}><kbd>⌘ K</kbd></button></label>
        <nav className="screen-nav" aria-label="Navegación del prototipo">
          {groups.map((group) => { const GroupIcon = iconFor(group); return <section className="nav-group" key={group}><div className="nav-heading"><GroupIcon size={14} />{group}<span>{visibleScreens.filter((item) => item.group === group).length}</span></div>{visibleScreens.filter((item) => item.group === group).map((item) => <button key={item.id} onClick={() => choose(item.id)} className={activeId === item.id ? 'screen-link active' : 'screen-link'}><span className="screen-code">{item.id}</span><span>{item.name}</span></button>)}</section> })}
          {visibleScreens.length === 0 && <p className="empty-search">No se encontraron pantallas.</p>}
        </nav>
        <div className="sidebar-footer">
          <div className="avatar avatar-small">KG</div>
          <div><strong>Kevin González</strong><small>{role} · Sede Norte</small></div>
          <button aria-label="Cerrar sesión" title="Cerrar sesión institucional" onClick={() => action('Cerrar sesión')}><LogOut size={16} /></button>
        </div>
      </aside>

      <main className="workspace">
        <header className="topbar">
          <div className="breadcrumbs">
            <button className="mobile-menu-btn" aria-label="Abrir navegación móvil" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <Menu size={18} />
            </button>
            <button className="breadcrumb-btn" onClick={() => choose(role === 'Estudiante' ? 'P-07' : role === 'Docente' ? 'P-14' : 'P-22')}>Prototipo</button>
            <ChevronRight size={13} />
            <button className="breadcrumb-btn" onClick={() => setShowAll(true)}>{current.group}</button>
            <ChevronRight size={13} />
            <strong className="breadcrumb-btn active">{current.name}</strong>
          </div>
          <div className="top-actions">
            <span className="preview-badge"><span /> Vista preliminar</span>
            <button className="icon-button" aria-label="Atajos de teclado (?)" title="Atajos de teclado (?)" onClick={() => setDialog({ kind: 'shortcuts' })}><KeyRound size={17} /></button>
            <button className="icon-button" aria-label="Ayuda" onClick={() => choose('P-06')}><CircleHelp size={18} /></button>
            <button className="icon-button notification-trigger" aria-label="Abrir centro de notificaciones" onClick={() => setDialog({ kind: 'notifications' })}><Bell size={18} />{!notificationsRead && <i />}</button>
            <div className="account-menu-wrapper" style={{ position: 'relative' }}>
              <button
                type="button"
                className="avatar"
                style={{ cursor: 'pointer', border: '1px solid #d4e0f5' }}
                aria-label="Abrir menú de cuenta de usuario"
                aria-expanded={accountMenuOpen}
                onClick={() => setAccountMenuOpen(!accountMenuOpen)}
              >
                KG
              </button>
              {accountMenuOpen && (
                <div className="account-menu-popover" role="menu">
                  <div className="account-menu-header">
                    <strong>Kevin Andrés González</strong>
                    <small>kevin.gonzalez@estudiantes.uniajc.edu.co</small>
                    <span className="role-pill">{role} · Demostración</span>
                  </div>
                  <button className="account-menu-item" onClick={() => { setAccountMenuOpen(false); choose('P-04') }}>
                    <User size={14} /> Mi perfil institucional (P-04)
                  </button>
                  <button className="account-menu-item" onClick={() => { setAccountMenuOpen(false); choose('P-36') }}>
                    <ShieldCheck size={14} /> Privacidad y datos (P-36)
                  </button>
                  <button className="account-menu-item" onClick={() => { setAccountMenuOpen(false); setDialog({ kind: 'shortcuts' }) }}>
                    <KeyRound size={14} /> Atajos de teclado (<kbd>?</kbd>)
                  </button>
                  <div className="account-menu-divider" />
                  <button
                    className="account-menu-item danger"
                    onClick={() => {
                      setAccountMenuOpen(false)
                      action('Cerrar sesión')
                    }}
                  >
                    <LogOut size={14} /> Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>
        <div className="screen-stage">
          <div className="page-intro"><div><div className="eyebrow">{current.id} <span>•</span> {current.route}</div><h1>{screenTitle(current.id, current.name)}</h1><p>{screenSubtitle(current.id, current.name)}</p></div><button className="outline-button" onClick={() => action(`Ruta de referencia: ${current.route}`)}><ExternalLink size={15} /> Ver especificación</button></div>
          <PrototypeScreen id={current.id} role={role} tab={tab} setTab={setTab} week={week} setWeek={setWeek} action={action} />
        </div>
        <footer className="stage-footer"><span><ShieldCheck size={14} /> Datos de ejemplo · No representa información real · Sin biometría ni fotografías</span><span>Anteproyecto de grado · UNIAJC <span className="footer-sep">/</span> 2026</span></footer>
        {notice && <div className="toast" role="status"><Check size={16} />{notice}<button aria-label="Cerrar aviso" onClick={() => setNotice('')}><X size={14} /></button></div>}
        {dialog && <InteractionDialog spec={dialog} notificationsRead={notificationsRead} onClose={() => setDialog(null)} onSave={(message) => { setDialog(null); setNotice(message); window.setTimeout(() => setNotice(''), 2800) }} onMarkNotificationsRead={() => { setNotificationsRead(true); setDialog(null); setNotice('Notificaciones marcadas como leídas'); window.setTimeout(() => setNotice(''), 2800) }} />}
        <CommandPalette open={commandOpen} options={commandOptions} onClose={() => setCommandOpen(false)} onChoose={chooseCommand} />
      </main>
    </div>
  )
}

function LayersIcon() { return <div className="layers-icon"><span /><span /><span /></div> }

function screenTitle(id: string, name: string) {
  const titles: Record<string,string> = { 'P-07':'¡Hola, Kevin!','P-08':'Clases de hoy','P-09':'Verifica tu presencia','P-10':'Mi asistencia','P-11':'Muro de dudas','P-12':'Herramientas recomendadas','P-13':'Entregas de tus cursos','P-14':'¡Buen día, Javier!','P-15':'Enlaces de mis cursos','P-16':'Asistencia de la sesión','P-17':'Banco de preguntas','P-18':'Reporte de asistencia','P-19':'Dudas de tus estudiantes','P-20':'Herramientas del curso','P-21':'Tareas y semáforo','P-22':'Panel de administración','P-23':'Usuarios','P-24':'Cursos y horarios','P-25':'Matrículas del curso','P-26':'Parámetros del sistema','P-27':'Registro de auditoría','P-28':'Reclamaciones de datos','P-29':'Catálogo académico','P-30':'Grupos académicos','P-31':'Perfiles administrativos','P-32':'Docente: mis grupos','P-33':'Mi calendario','P-36':'Privacidad y datos' }
  return titles[id] ?? name
}
function screenSubtitle(id: string, name: string) {
  const captions: Record<string,string> = {
    'P-07':'Aquí tienes lo importante para empezar tu jornada.',
    'P-08':'Tus clases y enlaces para hoy, en un solo lugar.',
    'P-09':'Confirma tu presencia en pocos pasos, sin salir de clase.',
    'P-10':'Consulta tu registro personal y descarga constancias digitales válidas.',
    'P-11':'Pregunta, comparte y encuentra respuestas de tu curso.',
    'P-12':'Recursos interactivos recomendados por tu docente para fortalecer la práctica.',
    'P-13':'Organiza tus próximas entregas con semáforo visual según fecha límite.',
    'P-14':'Un resumen de tus cursos y pendientes de hoy.',
    'P-15':'Control del enlace con ventana de bloqueo (RB-04) y cambio de emergencia.',
    'P-16':'Gestiona la presencia interactiva de tu grupo en tiempo real.',
    'P-17':'Banco de preguntas conceptuales para verificación de presencia (RB-08).',
    'P-18':'Consolida el reporte de asistencia del periodo para exportar a CSV o PDF.',
    'P-19':'Responde oportunamente a las inquietudes planteadas por tus estudiantes.',
    'P-20':'Administra herramientas pedagógicas y entornos de práctica para tu grupo.',
    'P-21':'Supervisa la distribución agregada del grupo en cada entrega sin exponer identidades.',
    'P-22':'Vista general del estado de la plataforma, actividad y auditoría.',
    'P-23':'Gestión de usuarios institucionales, roles y credenciales de acceso.',
    'P-24':'Programación académica de cursos, horarios y enlaces asignados.',
    'P-25':'Control de cupos, inscripciones e importación masiva por archivo CSV.',
    'P-26':'Parámetros del sistema, ventanas de verificación y retención institucional.',
    'P-27':'Registro de auditoría criptográfica inmutable con sellos de tiempo (SHA-256).',
    'P-28':'Gestión de peticiones de Habeas Data conforme a la Ley 1581 de 2012.',
    'P-29':'Catálogo institucional de facultades, programas académicos y mallas.',
    'P-30':'Organización de grupos académicos, jornadas y cupos del periodo.',
    'P-31':'Definición de perfiles administrativos y niveles de autorización.',
    'P-32':'Tus grupos académicos, horarios y accesos directos de gestión.',
    'P-33':'Consulta las clases programadas para tus grupos.',
    'P-36':'Consulta qué datos aparecen en este prototipo y cómo ejercer tus derechos.'
  }
  return captions[id] ?? `Gestiona ${name.toLowerCase()} de forma sencilla y segura.`
}

function PrototypeScreen({ id, role, tab, setTab, week, setWeek, action }: { id:string; role:Role; tab:string; setTab:(value:string)=>void; week:number; setWeek:(value:number)=>void; action:(message:string, spec?: DialogSpec)=>void }) {
  if (['P-01','P-02','P-03'].includes(id)) return <AuthScreen id={id} action={action} />
  if (id === 'P-09') return <AttendanceCheck action={action} />
  if (id === 'P-33') return <CalendarScreen week={week} setWeek={setWeek} action={action} />
  if (id === 'P-07' || id === 'P-14' || id === 'P-22') return <Dashboard id={id} action={action} />
  if (id === 'P-11' || id === 'P-19') return <QuestionsScreen role={role} action={action} />
  if (id === 'P-13' || id === 'P-21') return <AssignmentsScreen role={role} action={action} />
  if (id === 'P-16') return <AttendanceScreen id={id} action={action} />
  if (id === 'P-18') return <AttendanceReportScreen action={action} />
  if (id === 'P-10') return <StudentAttendanceScreen action={action} />
  if (id === 'P-15') return <TeacherLinksScreen action={action} />
  if (id === 'P-17') return <QuestionBankScreen action={action} />
  if (id === 'P-20') return <TeacherResourcesScreen action={action} />
  if (id === 'P-12') return <ResourcesScreen id={id} action={action} />
  if (id === 'P-25') return <EnrollmentManagementScreen action={action} />
  if (id === 'P-27') return <AuditLogScreen action={action} />
  if (id === 'P-28') return <DataClaimsScreen action={action} />
  if (id === 'P-29') return <AcademicCatalogueScreen action={action} />
  if (id === 'P-32') return <TeacherGroupsScreen action={action} />
  if (id === 'P-08') return <ClassesScreen id={id} action={action} />
  if (id === 'P-36') return <PrivacyScreen action={action} />
  if (id === 'P-04') return <ProfileScreen id={id} action={action} />
  if (id === 'P-05') return <NotificationsScreen action={action} />
  if (id.startsWith('P-2')) return <AdminScreen id={id} tab={tab} setTab={setTab} action={action} />
  return <UtilityScreen id={id} action={action} />
}

function TeacherLinksScreen({ action }: { action: (message: string) => void }) {
  return (
    <>
      <div className="lock-banner">
        <div className="lock-banner-icon"><Clock3 size={19} /></div>
        <div className="lock-banner-copy">
          <strong>Ventana de bloqueo activa · Regla RB-04 (30 minutos)</strong>
          <p>Faltan menos de 30 minutos para el inicio de la sesión (10:00 a. m.). La edición ordinaria del enlace está deshabilitada en la plataforma para evitar desorientación en los estudiantes. Si ocurre cualquier eventualidad técnica, pulsa <em>Cambio de emergencia</em>.</p>
        </div>
        <div className="lock-banner-countdown">
          <span>Tiempo restante</span>
          <strong>18:24 min</strong>
        </div>
      </div>

      <section className="panel data-panel" style={{ marginBottom: 16 }}>
        <div className="data-toolbar">
          <div>
            <span className="section-kicker">ENLACE VIGENTE DE LA SESIÓN · GRUPO 841A</span>
            <h2>Fundamentos de programación · Sesión de hoy</h2>
            <p className="toolbar-description">Jueves, 8 de octubre de 2026 · 10:00 a. m. – 11:30 a. m. · Sede Norte</p>
          </div>
          <div className="toolbar-actions">
            <button className="outline-button" style={{ opacity: 0.55, cursor: 'not-allowed' }} title="Bloqueado por inicio próximo (RB-04)" onClick={() => action('La edición ordinaria está bloqueada en los 30 min previos')}>
              <LockKeyhole size={14} /> Edición ordinaria bloqueada
            </button>
            <button className="emergency-button" onClick={() => action('Cambio de emergencia')}>
              <AlertTriangle size={15} /> Cambio de emergencia (RB-05)
            </button>
          </div>
        </div>

        <div style={{ padding: '0 18px 18px' }}>
          <div className="join-link" style={{ padding: 12, borderRadius: 9, background: '#f8fafc' }}>
            <div className="link-icon" style={{ background: '#eaf1fc', color: '#2b5ea9', width: 36, height: 36 }}>
              <Video size={19} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <span className="status-pill green">Vigente</span>
                <span className="emergency-tag">Microsoft Teams</span>
                <small style={{ color: '#8895a7' }}>Publicado a las 8:15 a. m. por Javier Pérez</small>
              </div>
              <strong style={{ fontSize: 13, color: '#1f2e46', marginTop: 4, display: 'block' }}>
                https://teams.microsoft.com/l/meetup-join/reunion-841a-uniajc-2026
              </strong>
            </div>
            <button className="outline-button" onClick={() => action('Enlace copiado al portapapeles')}>
              <Link2 size={14} /> Copiar
            </button>
            <button className="primary-button" onClick={() => action('Probando apertura de la sala virtual')}>
              Probar sala <ExternalLink size={13} />
            </button>
          </div>
        </div>
      </section>

      <section className="panel data-panel">
        <div className="data-toolbar">
          <div>
            <span className="section-kicker">CONTROL DE VERSIONES · RB-03</span>
            <h2>Historial de enlaces de la sesión</h2>
            <p className="toolbar-description">Registro inmutable de versiones para auditoría y trazabilidad académica.</p>
          </div>
          <button className="text-button" onClick={() => action('Consultar auditoría completa en P-27')}>
            Ver en Auditoría (P-27) <ArrowRight size={13} />
          </button>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Versión</th>
                <th>Hora</th>
                <th>Enlace</th>
                <th>Tipo de cambio</th>
                <th>Motivo registrado</th>
                <th>Autor</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>v2 (Vigente)</strong></td>
                <td>9:42 a. m.</td>
                <td><code>teams.microsoft.com/l/meetup-841a-v2</code></td>
                <td><span className="emergency-tag">Emergencia (RB-05)</span></td>
                <td>Caída de sala virtual previa en Teams</td>
                <td>Javier Pérez</td>
                <td><span className="status-pill green">Vigente</span></td>
              </tr>
              <tr>
                <td><strong>v1</strong></td>
                <td>8:15 a. m.</td>
                <td><code>teams.microsoft.com/l/meetup-841a</code></td>
                <td>Edición ordinaria</td>
                <td>Programación inicial del periodo</td>
                <td>Javier Pérez</td>
                <td><span className="status-pill gray">Reemplazado</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </>
  )
}

function StudentAttendanceScreen({ action }: { action: (message: string, spec?: DialogSpec) => void }) {
  const records = [
    { s: 'Sesión 09', d: 'Hoy, 8 oct', h: '10:01 a. m.', v: 'Pregunta conceptual respondida en 38 s (Bucle while)', st: 'Presente', tone: 'green', code: '8A39F' },
    { s: 'Sesión 08', d: '5 oct', h: '10:03 a. m.', v: 'Pregunta conceptual respondida en 42 s (Funciones)', st: 'Presente', tone: 'green', code: '7B12C' },
    { s: 'Sesión 07', d: '1 oct', h: '10:17 a. m.', v: 'Ingreso 17 min tarde · Registrado en plataforma', st: 'Tarde', tone: 'amber', code: '5C88D' },
    { s: 'Sesión 06', d: '28 sep', h: '10:02 a. m.', v: 'Validada por docente (falla técnica Teams)', st: 'Confirmada', tone: 'green', code: '4D21E' },
    { s: 'Sesión 05', d: '24 sep', h: '9:59 a. m.', v: 'Pregunta conceptual respondida en 27 s (Variables)', st: 'Presente', tone: 'green', code: '3E90F' },
  ]
  return (
    <>
      <div className="stat-grid compact-stats">
        <div className="stat-card compact"><div className="mini-status green" /><span>Porcentaje acumulado</span><strong>94,4%</strong></div>
        <div className="stat-card compact"><div className="mini-status blue" /><span>Sesiones asistidas</span><strong>17 / 18</strong></div>
        <div className="stat-card compact"><div className="mini-status green" /><span>Verificadas a tiempo</span><strong>16</strong></div>
        <div className="stat-card compact"><div className="mini-status amber" /><span>Ingresos tarde</span><strong>1</strong></div>
      </div>

      <section className="panel data-panel">
        <div className="data-toolbar">
          <div>
            <span className="section-kicker">HISTORIAL PERSONAL DE ASISTENCIA (F-ASI-12)</span>
            <h2>Kevin Andrés González Dinas · Código 2200417</h2>
            <p className="toolbar-description">Registros de presencia puntual sin captura de fotografías ni datos biométricos (Ley 1581 de 2012).</p>
          </div>
          <div className="segmented">
            <button className="selected">Fundamentos de programación</button>
            <button onClick={() => action('Mostrando Matemáticas discretas')}>Matemáticas discretas</button>
            <button onClick={() => action('Mostrando Bases de datos')}>Bases de datos</button>
          </div>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Sesión</th>
                <th>Fecha</th>
                <th>Hora ingreso</th>
                <th>Verificación interactiva</th>
                <th>Estado</th>
                <th>Comprobante</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r) => (
                <tr key={r.s}>
                  <td><strong>{r.s}</strong></td>
                  <td>{r.d}</td>
                  <td>{r.h}</td>
                  <td>{r.v}</td>
                  <td><span className={`status-pill ${r.tone}`}>{r.st}</span></td>
                  <td>
                    <button
                      className="outline-button"
                      style={{ padding: '4px 8px', fontSize: 9 }}
                      onClick={() => action('Ver constancia digital', {
                        kind: 'receipt',
                        receiptData: {
                          student: 'Kevin Andrés González Dinas',
                          code: '2200417',
                          course: 'Fundamentos de programación',
                          group: 'Grupo 841A',
                          teacher: 'Javier Pérez Campo',
                          date: r.d === 'Hoy, 8 oct' ? 'Jueves, 8 de octubre de 2026' : `${r.d} de 2026`,
                          entryTime: r.h,
                          verification: r.v,
                          hash: `UNIAJC-VERIF-2026-841A-2200417-${r.code}`
                        }
                      })}
                    >
                      <FileCheck2 size={13} /> Constancia
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="privacy-note"><ShieldCheck size={14} /> Cada constancia cuenta con identificador criptográfico único para reclamos ante la secretaría académica.</p>
      </section>
    </>
  )
}

function TeacherGroupsScreen({ action }: { action: (message: string) => void }) {
  const groups = [
    { code: '841A', course: 'Fundamentos de programación', sem: 'Semestre 1', time: 'Lun y Jue · 10:00 – 11:30 a. m.', platform: 'Teams', students: 32, attendance: '92%', doubts: 3, assignments: 2 },
    { code: '831B', course: 'Bases de datos', sem: 'Semestre 3', time: 'Mar y Vie · 2:00 – 3:30 p. m.', platform: 'Zoom', students: 28, attendance: '89%', doubts: 1, assignments: 1 },
    { code: '802A', course: 'Ingeniería de software', sem: 'Semestre 5', time: 'Mié · 6:00 – 9:00 p. m.', platform: 'Teams / Meet', students: 30, attendance: '95%', doubts: 4, assignments: 1 },
    { code: '843B', course: 'Matemáticas discretas', sem: 'Semestre 1', time: 'Lun y Mié · 8:00 – 9:30 a. m.', platform: 'Google Meet', students: 26, attendance: '91%', doubts: 0, assignments: 3 },
  ]
  return (
    <>
      <div className="stat-grid compact-stats">
        <div className="stat-card compact"><div className="mini-status blue" /><span>Grupos asignados</span><strong>4</strong></div>
        <div className="stat-card compact"><div className="mini-status mint" /><span>Estudiantes totales</span><strong>116</strong></div>
        <div className="stat-card compact"><div className="mini-status green" /><span>Asistencia promedio</span><strong>91,8%</strong></div>
        <div className="stat-card compact"><div className="mini-status amber" /><span>Dudas por responder</span><strong>8</strong></div>
      </div>

      <div className="group-grid">
        {groups.map((g) => (
          <article className="panel group-card-box" key={g.code}>
            <div>
              <div className="group-top">
                <span className="group-code-pill">Grupo {g.code}</span>
                <span className="status-pill blue">{g.platform}</span>
              </div>
              <h3>{g.course}</h3>
              <p>{g.sem} · Ingeniería de Sistemas · Sede Norte</p>
              <div className="group-meta-row">
                <span><Clock3 size={13} /> {g.time}</span>
                <span><Users size={13} /> {g.students} est.</span>
                <span><ClipboardCheck size={13} /> {g.attendance}</span>
              </div>
            </div>
            <div className="group-actions">
              <button className="primary-button" onClick={() => action(`Abriendo enlaces de ${g.course}`)}><Link2 size={13} /> Enlaces</button>
              <button className="outline-button" onClick={() => action(`Abriendo asistencia de ${g.course}`)}><ClipboardCheck size={13} /> Asistencia</button>
              <button className="outline-button" onClick={() => action(`Abriendo muro de dudas de ${g.course}`)}><BookOpen size={13} /> Dudas ({g.doubts})</button>
              <button className="outline-button" onClick={() => action(`Abriendo tareas de ${g.course}`)}><FileText size={13} /> Tareas</button>
            </div>
          </article>
        ))}
      </div>
    </>
  )
}

function AttendanceScreen({id,action}:{id:string;action:(message:string)=>void}) {
 return (
   <>
     <div className="stat-grid compact-stats">
       {[['Presentes','28','green'],['Pendientes','3','amber'],['Ausentes','1','rose'],['Total del grupo','32','blue']].map(([l,n,c])=>(
         <div className="stat-card compact" key={l}><div className={`mini-status ${c}`}/><span>{l}</span><strong>{n}</strong></div>
       ))}
     </div>
     <section className="panel data-panel">
       <div className="data-toolbar">
         <div>
           <span className="section-kicker">ASISTENCIA EN VIVO · FUNDAMENTOS DE PROGRAMACIÓN</span>
           <h2>Sesión 09 · Jueves, 8 de octubre de 2026</h2>
           <p className="toolbar-description">Monitoreo en tiempo real de presencia interactiva por verificación conceptual (RB-08).</p>
         </div>
         <div className="toolbar-actions">
           <button className="outline-button" onClick={() => action('Descargando reporte CSV de la sesión')}><Download size={15}/>Exportar CSV</button>
           <button className="primary-button" onClick={() => action('Verificación de asistencia abierta por docente')}><ClipboardCheck size={15}/>Abrir verificación</button>
         </div>
       </div>
       <div className="table-wrap">
         <table>
           <thead>
             <tr>
               <th>Estudiante</th>
               <th>Código</th>
               <th>Hora de ingreso</th>
               <th>Verificación conceptual</th>
               <th>Estado</th>
               <th>Acción docente</th>
             </tr>
           </thead>
           <tbody>
             {[
               ['Laura Gómez','2200384','9:58 a. m.','Pregunta respondida en 24 s (while)','Presente','green'],
               ['Mateo Rojas','2200405','10:01 a. m.','Pregunta respondida en 31 s (while)','Presente','green'],
               ['Kevin González','2200417','10:01 a. m.','Pregunta respondida en 38 s (while)','Presente','green'],
               ['Valentina Cruz','2200420','—','Tiempo expirado · Conexión inestable','Pendiente','amber'],
               ['Samuel Torres','2200442','—','Sin registro de ingreso en plataforma','Ausente','rose']
             ].map(([n,cod,t,v,s,tone])=>(
               <tr key={n}>
                 <td>
                   <div className="person-cell">
                     <div className="avatar avatar-table">{n.split(' ').map(x=>x[0]).join('')}</div>
                     <strong>{n}</strong>
                   </div>
                 </td>
                 <td><code>{cod}</code></td>
                 <td>{t}</td>
                 <td>{v}</td>
                 <td><span className={`status-pill ${tone}`}>{s}</span></td>
                 <td>
                   {['Pendiente','Ausente'].includes(s) ? (
                     <button className="outline-button" style={{padding:'4px 8px',fontSize:9}} onClick={()=>action('Confirmar presencia por docente (RB-10)')}>
                       <ClipboardCheck size={13}/> Justificar (RB-10)
                     </button>
                   ) : (
                     <button className="more-button" aria-label={`Opciones para ${n}`} onClick={()=>action(`Opciones para ${n}`)}>
                       <MoreHorizontal size={17}/>
                     </button>
                   )}
                 </td>
               </tr>
             ))}
           </tbody>
         </table>
       </div>
       <div className="table-footer">
         <span>Mostrando 5 de 32 estudiantes registrados en la sesión</span>
         <div>
           <button aria-label="Página anterior"><ChevronLeft size={16}/></button>
           <button className="page-number">1</button>
           <button>2</button>
           <button>3</button>
           <button aria-label="Página siguiente"><ChevronRight size={16}/></button>
         </div>
       </div>
     </section>
   </>
 )
}

function QuestionsScreen({role,action}:{role:Role;action:(message:string)=>void}) {
 const [filter,setFilter] = useState('Todas')
 const teacher = role === 'Docente'
 return <div className="questions-layout"><section className="panel questions-panel"><div className="data-toolbar"><div><span className="section-kicker">FUNDAMENTOS DE PROGRAMACIÓN · GRUPO 841A</span><h2>{teacher?'Conversación del curso':'Dudas recientes'}</h2></div><span className="count-badge">3 sin responder</span></div><div className="filter-tabs">{['Todas','Sin responder','Resueltas'].map(item=><button className={filter===item?'active':''} key={item} onClick={()=>{setFilter(item);action(`Filtro: ${item}`)}}>{item}</button>)}</div><div className="question-list">{[['MR','Mateo Rojas','¿Cómo se recorre una matriz bidimensional?','hace 12 min','Programación · Ciclos y matrices','3'],['VC','Valentina Cruz','¿Podrían compartir un ejemplo de función recursiva?','hace 1 h','Programación · Funciones','1'],['ST','Samuel Torres','¿La entrega incluye pseudocódigo?','ayer','Taller 04 · Entregas','0']].map(([initials,name,q,time,tag,replies],i)=><article className="question-card" key={q}><div className="avatar question-avatar">{initials}</div><div className="question-content"><div className="question-author"><strong>{name}</strong><span>{time}</span></div><p>{q}</p><div className="question-foot"><span className="topic-tag">{tag}</span><span>{replies} respuestas</span></div>{teacher && i===0 && <div className="reply-box"><input aria-label="Escribe una respuesta" placeholder="Escribe una respuesta para el curso..."/><button className="primary-button" onClick={() => action('Respuesta publicada en el muro')}><ArrowRight size={15}/>Responder</button></div>}</div><span className={`status-pill ${i===2?'green':'amber'}`}>{i===2?'Resuelta':'Abierta'}</span></article>)}</div>{!teacher&&<div className="composer"><div className="avatar">KG</div><input aria-label="Escribe tu pregunta" placeholder="¿Qué te gustaría preguntar al curso?"/><button className="primary-button" onClick={() => action('Tu duda quedó publicada')}><Plus size={16}/>Publicar duda</button></div>}</section><aside className="panel questions-aside"><div className="aside-icon"><BookOpen size={19}/></div><h2>Un espacio para aprender</h2><p>Comparte tus preguntas con el curso. Tu docente recibirá un resumen para acompañarte.</p><div className="aside-stat"><span>Temas recientes</span><strong>12</strong></div><div className="topic-chip-list"><span>Funciones</span><span>Variables</span><span>Entregas</span></div></aside></div>
}

function AssignmentsScreen({role,action}:{role:Role;action:(message:string, spec?: DialogSpec)=>void}) {
 const teacher = role === 'Docente'
 const rows = [
   ['Taller 04 · Ciclos','Fundamentos de programación','9 oct · 11:59 p. m.','red','Prioridad alta', '18 a tiempo', '8 próximas', '6 críticas', true],
   ['Lectura: modelo relacional','Bases de datos','12 oct · 11:59 p. m.','amber','Próxima', '24 a tiempo', '5 próximas', '3 críticas', true],
   ['Quiz de lógica','Matemáticas discretas','16 oct · 8:00 a. m.','green','A tiempo', '30 a tiempo', '2 próximas', '0 críticas', false],
   ['Proyecto de curso','Ingeniería de software','22 oct · 11:59 p. m.','gray','Sin iniciar', '12 a tiempo', '10 en progreso', '10 sin iniciar', false]
 ] as const
 return <><div className="assignment-summary">{[['Vencen pronto','2','rose'],['En los próximos 7 días','3','amber'],['A tiempo','5','green']].map(([l,n,c])=><div className={`summary-tile ${c}`} key={l}><div><span>{l}</span><strong>{n}</strong></div><div className="summary-spark"/></div>)}</div><section className="panel data-panel"><div className="data-toolbar"><div className="segmented">{['Todas','Esta semana','Completadas'].map((item,i)=><button key={item} className={i===0?'selected':''} onClick={()=>action(`Mostrando: ${item}`)}>{item}</button>)}</div>{teacher&&<button className="primary-button" onClick={()=>action('Formulario para crear una tarea')}><Plus size={16}/>Nueva tarea</button>}</div><div className="assignment-list">{rows.map(([title,course,due,tone,status,g,a,r,canUpload])=><article className="assignment-row" key={title}><div className={`assignment-marker ${tone}`}><FileText size={17}/></div><div className="assignment-name"><strong>{title}</strong><span>{course}</span>{teacher && <div className="aggregate-breakdown"><span className="agg-pill green">{g}</span><span className="agg-pill amber">{a}</span><span className="agg-pill rose">{r}</span></div>}</div><div className="assignment-due"><small>{teacher?'Fecha límite':'ENTREGA'}</small><strong>{due}</strong></div><div className={`traffic ${tone}`}><span/><span>{status}</span></div>{!teacher && canUpload && <button className="outline-button" style={{ padding: '4px 8px', fontSize: 9.5 }} onClick={() => action(`Subir entrega para ${title}`, { kind: 'upload_assignment', title: `Subir entrega: ${title}`, description: `${course} · Fecha límite: ${due}` })}><UploadCloud size={13} /> Subir</button>}<button className="more-button" aria-label="Opciones de la tarea" onClick={()=>action('Opciones de la tarea')}><MoreHorizontal size={18}/></button></article>)}</div><p className="privacy-note"><ShieldCheck size={14}/> {teacher ? 'El resumen del docente muestra distribución agregada de estudiantes sin exponer identidades (HU-12).' : 'Semáforo automático basado en fecha límite para priorizar el estudio.'}</p></section></>
}

function Dashboard({ id, action }: {id:string; action:(message:string)=>void}) {
  const admin = id === 'P-22', teacher = id === 'P-14'
  return <>
    <div className="welcome-line"><div className="welcome-date"><CalendarDays size={15} /> Jueves, 8 de octubre de 2026 <span>·</span> Jornada mañana</div><button className="text-button" onClick={() => action('Mostrando calendario de la semana')}><CalendarDays size={15} /> Ver calendario</button></div>
    <div className="stat-grid">{(admin ? [['Grupos activos','24','+3 este periodo','blue'],['Estudiantes','846','En 24 grupos','purple'],['Sesiones hoy','18','4 en curso','mint'],['Disponibilidad','99,8%','Últimos 30 días','amber']] : teacher ? [['Mis cursos','4','2 clases esta semana','blue'],['Dudas pendientes','8','3 nuevas hoy','amber'],['Tareas por vencer','3','Próximos 7 días','rose'],['Asistencia reciente','92%','Promedio del periodo','mint']] : [['Clases hoy','3','Próxima a las 10:00 a. m.','blue'],['Asistencia','92%','Este periodo','mint'],['Entregas próximas','2','Una para mañana','amber'],['Dudas respondidas','4','En esta semana','purple']]).map(([label,value,desc,color]) => <div className="stat-card" key={label}><div className={`stat-icon ${color}`}>{label.includes('Clases')||label.includes('Sesiones') ? <CalendarDays size={17}/> : label.includes('Dudas') ? <BookOpen size={17}/> : label.includes('Disponibilidad') ? <Activity size={17}/> : label.includes('Estudiantes') ? <Users size={17}/> : label.includes('Asistencia') ? <ClipboardCheck size={17}/> : <Clock3 size={17}/>}</div><span>{label}</span><strong>{value}</strong><small>{desc}</small></div>)}</div>
    <div className="dashboard-columns"><section className="panel next-class"><div className="panel-heading"><div><span className="section-kicker">{admin ? 'ACTIVIDAD ACADÉMICA' : 'TU SIGUIENTE CLASE'}</span><h2>{admin ? 'Panorama de hoy' : teacher ? 'Próxima clase' : 'Fundamentos de programación'}</h2></div><button className="more-button" aria-label="Más opciones"><MoreHorizontal size={19}/></button></div><div className="class-detail"><div className="subject-icon"><BookOpen size={20}/></div><div className="class-copy"><strong>{admin ? 'Sesiones activas' : teacher ? 'Ingeniería de software' : 'Fundamentos de programación'}</strong><span>{admin ? '4 clases en curso en sede norte' : 'Grupo 841A · Aula virtual en Teams'}</span></div><span className="time-pill"><span/> {admin ? 'EN VIVO' : '10:00 a. m.'}</span></div><div className="class-meta"><span><Clock3 size={14}/>{admin ? 'Actualizado hace 2 min' : 'Hoy · 10:00 – 11:30 a. m.'}</span><span><Users size={14}/>{admin ? '4 docentes conectados' : '32 estudiantes'}</span></div>{!admin && <div className="join-link"><div className="link-icon"><Link2 size={17}/></div><div><small>ENLACE VIGENTE</small><strong>teams.microsoft.com / reunión-841a</strong></div><button aria-label="Copiar enlace" onClick={() => action('Enlace copiado al portapapeles')}><Link2 size={16}/></button><button className="join-button" onClick={() => action('Abriendo la clase virtual')}>Ingresar <ArrowRight size={15}/></button></div>}</section>
    <section className="panel today-panel"><div className="panel-heading"><div><span className="section-kicker">{admin ? 'ESTADO DEL SISTEMA' : 'AGENDA DE HOY'}</span><h2>{admin ? 'Estado general' : 'Tu jornada'}</h2></div><span className="live-tag"><i/> Al día</span></div>{admin ? <div className="system-list"><div><span className="system-dot green"/><span>Servicio de plataforma</span><strong>Operativo</strong></div><div><span className="system-dot green"/><span>Disponibilidad mensual</span><strong>99,8%</strong></div><div><span className="system-dot amber"/><span>Reclamaciones abiertas</span><strong>2 pendientes</strong></div></div> : <div className="agenda-list"><AgendaItem time="8:00" title="Matemáticas discretas" place="Meet · Grupo 841A" status="Finalizada" tone="muted"/><AgendaItem time="10:00" title="Fundamentos de programación" place="Teams · Grupo 841A" status="En 20 min" tone="blue"/><AgendaItem time="2:00" title="Bases de datos" place="Zoom · Grupo 831B" status="Próxima" tone="amber"/></div>}</section></div>
    <div className="bottom-panels"><section className="panel mini-panel"><div className="panel-heading"><div><span className="section-kicker">{admin ? 'GESTIÓN' : 'PARA HOY'}</span><h2>{admin ? 'Accesos rápidos' : teacher ? 'Pendientes del curso' : 'Lo que sigue'}</h2></div><button className="text-button" onClick={() => action('Abriendo el detalle')}>Ver todo <ArrowRight size={14}/></button></div><div className="quick-list">{(admin ? [['+','Crear grupo','Nuevo grupo académico'],['U','Gestionar usuarios','Revisar cuentas activas'],['A','Ver auditoría','Últimos movimientos']] : teacher ? [['?','Responder dudas','3 preguntas nuevas'],['↗','Revisar entregas','2 vencen esta semana'],['✓','Tomar asistencia','Clase de las 10:00 a. m.']] : [['✓','Confirmar asistencia','Fundamentos de programación'],['↗','Entrega de programación','Vence mañana, 11:59 p. m.'],['?','Revisar respuestas','Muro de dudas del curso']]).map(([icon,title,desc])=><button key={title} className="quick-row" onClick={() => action(`${title}: acción de demostración`)}><span className="quick-dot">{icon}</span><span><strong>{title}</strong><small>{desc}</small></span><ChevronRight size={16}/></button>)}</div></section><section className="panel tip-panel"><div className="tip-top"><div className="tip-icon"><Sparkles size={16}/></div><span>UN CONSEJO</span></div><h2>{admin ? 'Tu gestión, más simple' : 'Todo en un solo lugar'}</h2><p>{admin ? 'Organiza los grupos del nuevo periodo desde el módulo de Grupos.' : 'Encuentra enlaces, tareas y avisos de tus cursos sin cambiar de plataforma.'}</p><button className="tip-link" onClick={() => action('Abriendo guía rápida')}>Explorar guía <ArrowRight size={14}/></button></section></div>
  </>
}
function AgendaItem({time,title,place,status,tone}:{time:string;title:string;place:string;status:string;tone:string}) { return <div className="agenda-item"><span className="agenda-time">{time}<small>{time === '2:00' ? 'p. m.' : 'a. m.'}</small></span><span className="agenda-track"/><div className="agenda-copy"><strong>{title}</strong><small>{place}</small></div><span className={`status-pill ${tone}`}>{status}</span></div> }

function ClassesScreen({id,action}:{id:string;action:(message:string)=>void}) {
  const teacher = id !== 'P-08', today = id === 'P-08'
  const [view, setView] = useState<'today' | 'week'>('today')
  const [activeDay, setActiveDay] = useState(3)
  const week = [
    { label: 'Lun', date: '05', count: 2 }, { label: 'Mar', date: '06', count: 1 },
    { label: 'Mié', date: '07', count: 1 }, { label: 'Jue', date: '08', count: 3 },
    { label: 'Vie', date: '09', count: 1 }, { label: 'Sáb', date: '10', count: 0 },
    { label: 'Dom', date: '11', count: 0 },
  ]
  const weekClasses = [
    [
      { time: '8:00 a. m.', title: 'Matemáticas discretas', group: '841A', platform: 'Google Meet', status: 'Primera clase', tone: 'blue' },
      { time: '10:00 a. m.', title: 'Fundamentos de programación', group: '841A', platform: 'Teams', status: 'Segunda clase', tone: 'purple' },
    ],
    [{ time: '9:00 a. m.', title: 'Bases de datos', group: '831B', platform: 'Zoom', status: 'Clase del día', tone: 'amber' }],
    [{ time: '10:00 a. m.', title: 'Ingeniería de software', group: '841A', platform: 'Teams', status: 'Clase del día', tone: 'purple' }],
    [
      { time: '8:00 a. m.', title: 'Matemáticas discretas', group: '841A', platform: 'Google Meet', status: 'Finalizada', tone: 'muted' },
      { time: '10:00 a. m.', title: 'Fundamentos de programación', group: '841A', platform: 'Teams', status: 'En 20 min', tone: 'blue' },
      { time: '2:00 p. m.', title: 'Bases de datos', group: '831B', platform: 'Zoom', status: 'Próxima clase', tone: 'amber' },
    ],
    [{ time: '11:00 a. m.', title: 'Ingeniería de software', group: '841A', platform: 'Teams', status: 'Clase del día', tone: 'purple' }],
    [], [],
  ]
  const todayClasses = [
    { time: '10:00 a. m.', title: 'Fundamentos de programación', group: '841A', platform: 'Teams', status: 'Enlace vigente', tone: 'blue' },
    { time: '11:00 a. m.', title: 'Matemáticas discretas', group: '841A', platform: 'Google Meet', status: 'Finalizada', tone: 'muted' },
    { time: '2:00 p. m.', title: 'Bases de datos', group: '831B', platform: 'Zoom', status: 'Próxima clase', tone: 'amber' },
  ]
  const classes = view === 'week' ? weekClasses[activeDay] : todayClasses
  return <div className="panel data-panel">
    <div className="data-toolbar">
      <div className="segmented">
        <button className={view === 'today' ? 'selected' : ''} onClick={() => setView('today')}>{today ? 'Hoy' : teacher ? 'Mis cursos' : 'Mis grupos'}</button>
        <button className={view === 'week' ? 'selected' : ''} onClick={() => setView('week')}>{today ? 'Esta semana' : 'Archivados'}</button>
      </div>
      <div className="toolbar-actions"><label className="inline-search"><Search size={15}/><input placeholder="Buscar curso" /></label><button className="outline-button" onClick={() => action('Filtro aplicado')}><Filter size={15}/>Filtros</button>{teacher && <button className="primary-button" onClick={() => action('Formulario para publicar enlace')}><Plus size={16}/>Publicar enlace</button>}</div>
    </div>
    {today && view === 'week' && <section className="week-explorer" aria-label="Agenda semanal de clases">
      <div className="week-explorer-top"><div><span className="section-kicker">SEMANA 41 · OCTUBRE 2026</span><h2>Tu ritmo esta semana</h2><p>Elige un día para ver el recorrido de tus clases.</p></div><div className="week-summary"><strong>8</strong><span>sesiones<br/>programadas</span></div></div>
      <div className="week-day-selector" role="group" aria-label="Seleccionar día de la semana">
        {week.map((day, index) => <button key={day.date} className={`week-day-button ${activeDay === index ? 'active' : ''}`} aria-pressed={activeDay === index} aria-label={`${day.label} ${day.date} de octubre, ${day.count ? `${day.count} clases` : 'sin clases'}`} onClick={() => setActiveDay(index)}><span className="week-day-name">{day.label}</span><strong>{day.date}</strong><span className="week-day-count">{day.count ? `${day.count} ${day.count === 1 ? 'clase' : 'clases'}` : 'Libre'}</span><span className={`week-day-mark ${day.count ? 'has-classes' : ''}`} aria-hidden="true" /></button>)}
      </div>
      <div className="week-schedule-heading"><div><span className="section-kicker">{['LUNES','MARTES','MIÉRCOLES','JUEVES','VIERNES','SÁBADO','DOMINGO'][activeDay]} {week[activeDay].date} DE OCTUBRE</span><h3>{week[activeDay].count ? `${week[activeDay].count} ${week[activeDay].count === 1 ? 'clase en tu agenda' : 'clases en tu agenda'}` : 'Un día para recargar'}</h3></div><span className="week-focus-label"><span/> {week[activeDay].count ? 'Día académico' : 'Sin clases'}</span></div>
      {classes.length ? <div className="week-sessions">{classes.map((item) => <article className="week-session-row" key={`${item.time}-${item.title}`}><div className="week-session-time">{item.time}</div><div className={`week-session-line ${item.tone}`} aria-hidden="true"><span/></div><div className="week-session-copy"><div className="week-session-title"><strong>{item.title}</strong><span className={`status-pill ${item.tone}`}>{item.status}</span></div><span>{item.group} · Ingeniería de Sistemas</span><small><Video size={12}/>{item.platform}</small></div><div style={{ display: 'flex', gap: 6 }}><button className="outline-button row-action" title="Copiar enlace directo" onClick={() => action(`Enlace de ${item.title} copiado al portapapeles`)}><Link2 size={13} /></button><button className="outline-button row-action" onClick={() => action('Abriendo enlace de la clase')}>Ver clase <ArrowRight size={14}/></button></div></article>)}</div> : <div className="week-empty"><CalendarDays size={19}/><span>Tu semana también necesita pausas. No hay clases programadas para este día.</span></div>}
      <div className="week-explorer-footer"><span><i/> Sesión programada</span><span>Los horarios corresponden a tu zona local.</span></div>
    </section>}
    {(!today || view === 'today') && <div className="class-list">{classes.map((item, index) => <article className="class-row-card" key={item.title}><div className={`class-date-icon ${index === 0 ? 'today' : ''}`}><span>OCT</span><strong>{view === 'week' ? week[activeDay].date : 8}</strong></div><div className="class-row-main"><div className="class-row-title"><strong>{item.title}</strong><span className={`status-pill ${item.tone}`}>{item.status}</span></div><p>{item.group} · Ingeniería de Sistemas</p><div className="class-row-meta"><span><Clock3 size={13}/>{item.time}</span><span><Video size={13}/>{item.platform}</span></div></div><div style={{ display: 'flex', gap: 6 }}><button className="outline-button row-action" title="Copiar enlace al portapapeles" onClick={() => action(`Enlace de ${item.title} copiado al portapapeles`)}><Link2 size={13} /></button><button className="outline-button row-action" onClick={() => action(teacher ? 'Abriendo enlace y opciones del curso' : 'Abriendo enlace de la clase')}>{teacher ? 'Gestionar' : 'Ingresar'} <ArrowRight size={14}/></button></div></article>)}</div>}
  </div>
}

function ProfileScreen({id,action}:{id:string;action:(message:string, spec?: DialogSpec)=>void}) {
 return <div className="profile-grid"><section className="panel profile-panel"><div className="profile-hero"><div className="avatar profile-avatar">KG</div><div><h2>Kevin Andrés González Dinas</h2><p>Estudiante · Ingeniería de Sistemas</p></div><button className="outline-button" onClick={()=>action('Edición de perfil')}><Settings2 size={15}/>Editar perfil</button></div><div className="form-grid">{[['Nombres','Kevin Andrés'],['Apellidos','González Dinas'],['Correo institucional','kevin.gonzalez@estudiantes.uniajc.edu.co'],['Código estudiantil','2200417'],['Programa','Ingeniería de Sistemas'],['Semestre','Octavo'],['Jornada','Mañana']].map(([label,value])=><label className="form-field" key={label}>{label}<input defaultValue={value}/></label>)}</div><div className="setting-row"><div><strong>Preferencias de notificación</strong><p>Recibe novedades de tus clases y cursos en tus canales preferidos.</p></div><button className="outline-button" onClick={()=>action('Preferencias de notificación')}><Settings2 size={15}/>Configurar</button></div><div className="setting-row"><div><strong>Sesiones abiertas</strong><p>Este dispositivo · Último acceso hoy, 8:42 a. m.</p></div><button className="text-button" onClick={()=>action('Cerrar otras sesiones', { kind: 'confirm_destructive', title: '¿Cerrar todas las demás sesiones activas?', description: 'Se revocarán todos los tokens y sesiones abiertas en otros navegadores.', warning: 'Solo se conservará el acceso actual en este equipo.', destructiveConfirmText: 'Cerrar otras sesiones' })}>Cerrar otras sesiones</button></div><button className="primary-button" onClick={()=>action('Cambios guardados correctamente')}><Check size={16}/>Guardar cambios</button></section><aside className="panel account-aside"><div className="aside-icon"><LockKeyhole size={18}/></div><span className="section-kicker">CUENTA SEGURA</span><h2>Tu información está protegida</h2><p>Usamos tus datos solo para apoyar la gestión de tus clases virtuales conforme a la Ley 1581 de 2012.</p><button className="text-button" onClick={()=>action('Abriendo política de privacidad')}>Leer política de privacidad <ArrowRight size={14}/></button></aside></div>
}

function PrivacyScreen({ action }: { action: (message: string, spec?: DialogSpec) => void }) {
  const downloadDataJson = () => {
    const data = {
      plataforma: 'aula+ UNIAJC Sede Norte',
      marco_normativo: 'Ley 1581 de 2012 y Decreto 1377 de 2013 (Habeas Data)',
      titular: {
        nombres: 'Kevin Andrés',
        apellidos: 'González Dinas',
        codigo_estudiantil: '2200417',
        correo_institucional: 'kevin.gonzalez@estudiantes.uniajc.edu.co',
        programa: 'Ingeniería de Sistemas',
        semestre: 'Octavo (2026-2)',
        sede: 'Sede Norte (Cali, Colombia)'
      },
      politica_privacidad: {
        biometria_almacenada: false,
        reconocimiento_facial: false,
        fotografias_almacenadas: false,
        descripcion: 'La plataforma aula+ no recopila, procesa ni almacena datos biométricos, rasgos faciales ni fotografías personales.'
      },
      resumen_asistencia: {
        porcentaje_acumulado: '94.4%',
        sesiones_registradas: 18,
        asistidas: 17,
        constancias_digitales_emitidas: 17
      },
      cursos_inscritos: [
        { codigo: 'SIS-101', nombre: 'Fundamentos de programación', grupo: '841A', docente: 'Javier Pérez Campo' },
        { codigo: 'MAT-101', nombre: 'Matemáticas discretas', grupo: '841A', docente: 'Carlos Ríos' },
        { codigo: 'SIS-301', nombre: 'Bases de datos', grupo: '831B', docente: 'Mónica Salazar' }
      ]
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'aula_plus_mis_datos_2200417.json'
    a.click()
    URL.revokeObjectURL(url)
    action('Archivo de datos personales (JSON) generado y descargado correctamente')
  }

  return (
    <div className="profile-grid">
      <section className="panel profile-panel">
        <div className="profile-hero">
          <div className="aside-icon"><ShieldCheck size={20} /></div>
          <div>
            <h2>Tu información, bajo tu control</h2>
            <p>Garantía de Habeas Data conforme a la Ley 1581 de 2012 y Decreto 1377 de 2013.</p>
          </div>
        </div>
        <div className="privacy-callout">
          <LockKeyhole size={19} />
          <div>
            <strong>Minimización estricta de datos · Sin biometría ni fotografías</strong>
            <p>La plataforma aula+ verifica tu presencia mediante preguntas conceptuales en vivo. No solicita, no procesa y no almacena fotos ni reconocimiento facial.</p>
          </div>
        </div>
        <div className="setting-row">
          <div>
            <strong>Datos de identificación institucional</strong>
            <p>Nombre, correo institucional (@estudiantes.uniajc.edu.co), código y programa académico.</p>
          </div>
          <span className="status-pill blue">Institucional</span>
        </div>
        <div className="setting-row">
          <div>
            <strong>Actividad académica y asistencia</strong>
            <p>Registros de conexión, hora de respuesta conceptual y constancias criptográficas con SHA-256.</p>
          </div>
          <span className="status-pill green">Auditado</span>
        </div>
        <div className="setting-row">
          <div>
            <strong>Finalidad exclusiva</strong>
            <p>Acompañamiento pedagógico y gestión de clases virtuales en UNIAJC Sede Norte.</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 16 }}>
          <button className="primary-button" onClick={() => action('Solicitar acceso a mis datos')}>
            <FileText size={15} /> Radicar solicitud ARCO
          </button>
          <button className="outline-button" onClick={downloadDataJson}>
            <Download size={15} /> Descargar mis datos (JSON)
          </button>
          <button
            className="outline-button"
            style={{ color: '#c2392d', borderColor: '#f9ccc8' }}
            onClick={() => action('Solicitud de supresión de datos')}
          >
            <Trash2 size={15} /> Solicitar supresión
          </button>
        </div>
      </section>
      <aside className="panel account-aside">
        <div className="aside-icon"><ShieldCheck size={18} /></div>
        <span className="section-kicker">TUS DERECHOS ARCO</span>
        <h2>Acceso, Rectificación, Cancelación y Oposición</h2>
        <p>Todo titular tiene derecho a conocer, actualizar y rectificar sus datos personales frente a los responsables del tratamiento (Art. 8, Ley 1581 de 2012).</p>
        <div className="aside-stat"><span>Plazo legal perentorio</span><strong>15 días hábiles</strong></div>
        <button className="text-button" style={{ marginTop: 12 }} onClick={() => action('Solicitar acceso a mis datos')}>
          Iniciar trámite formal <ArrowRight size={14} />
        </button>
      </aside>
    </div>
  )
}

function NotificationsScreen({action}:{action:(message:string)=>void}) { return <section className="panel data-panel"><div className="data-toolbar"><div><span className="section-kicker">ÚLTIMOS 7 DÍAS</span><h2>Todo está al día</h2></div><button className="text-button" onClick={()=>action('Todas las notificaciones marcadas como leídas')}><CheckCheck size={15}/>Marcar todo como leído</button></div><div className="notification-list">{[['link','Enlace actualizado','El docente publicó un nuevo enlace para Fundamentos de programación.','Hoy, 9:14 a. m.','blue'],['due','Entrega próxima','El Taller 04 vence mañana a las 11:59 p. m.','Ayer, 4:30 p. m.','amber'],['question','Nueva respuesta','Javier Pérez respondió tu pregunta en el muro del curso.','7 oct, 2:10 p. m.','purple']].map(([kind,title,body,time,color])=><article className="notification-row" key={title}><div className={`notification-icon ${color}`}>{kind==='link'?<Link2 size={17}/>:kind==='due'?<Clock3 size={17}/>:<BookOpen size={17}/>}</div><div><strong>{title}</strong><p>{body}</p><small>{time}</small></div><span className="unread-dot"/></article>)}</div></section> }
function AttendanceReportScreen({ action }: { action: (message: string) => void }) {
  const [filterStudent, setFilterStudent] = useState('')
  const rows = [
    { name: 'Laura Gómez', code: '2200384', s: ['P','P','P','P','P','P','P','P','P'], total: '9 / 9', pct: '100%', risk: false },
    { name: 'Kevin González', code: '2200417', s: ['P','P','P','P','P','J','P','P','P'], total: '9 / 9', pct: '100%', risk: false },
    { name: 'Mateo Rojas', code: '2200405', s: ['P','P','P','T','P','P','P','P','P'], total: '9 / 9', pct: '94,4%', risk: false },
    { name: 'Valentina Cruz', code: '2200420', s: ['P','P','J','P','P','P','T','P','P'], total: '9 / 9', pct: '88,9%', risk: false },
    { name: 'Carlos Méndez', code: '2200431', s: ['P','P','P','P','A','P','P','P','P'], total: '8 / 9', pct: '88,9%', risk: false },
    { name: 'Andrea Pineda', code: '2200455', s: ['P','P','P','P','P','P','P','P','P'], total: '9 / 9', pct: '100%', risk: false },
    { name: 'Samuel Torres', code: '2200442', s: ['P','A','P','A','P','A','P','A','P'], total: '5 / 9', pct: '55,6%', risk: true },
    { name: 'Diana Restrepo', code: '2200468', s: ['A','P','A','P','P','A','P','A','P'], total: '5 / 9', pct: '55,6%', risk: true },
  ]
  const filtered = rows.filter(r => r.name.toLowerCase().includes(filterStudent.toLowerCase()) || r.code.includes(filterStudent))

  return (
    <>
      <div className="stat-grid compact-stats">
        <div className="stat-card compact"><div className="mini-status green" /><span>Asistencia promedio</span><strong>91,7%</strong></div>
        <div className="stat-card compact"><div className="mini-status green" /><span>Estudiantes al día (&gt;80%)</span><strong>30 / 32</strong></div>
        <div className="stat-card compact"><div className="mini-status rose" /><span>En riesgo (&lt;80%)</span><strong>2</strong></div>
        <div className="stat-card compact"><div className="mini-status blue" /><span>Sesiones computadas</span><strong>9 / 16</strong></div>
      </div>

      <section className="panel data-panel">
        <div className="data-toolbar">
          <div>
            <span className="section-kicker">REPORTE CONSOLIDADO DEL PERIODO (F-ASI-11) · GRUPO 841A</span>
            <h2>Fundamentos de programación · Planilla de asistencia acumulada</h2>
            <p className="toolbar-description">Periodo académico 2026-2 · Sede Norte · Alerta temprana por inasistencia (Reglamento UNIAJC).</p>
          </div>
          <div className="toolbar-actions">
            <button className="outline-button" onClick={() => action('Descargando reporte oficial en CSV (F-ASI-11)')}>
              <Download size={15} /> Exportar CSV
            </button>
            <button className="primary-button" onClick={() => action('Generando planilla oficial en PDF')}>
              <FileCheck2 size={15} /> Planilla PDF
            </button>
          </div>
        </div>

        <div className="data-toolbar secondary-toolbar">
          <label className="inline-search">
            <Search size={15} />
            <input placeholder="Filtrar por estudiante o código..." value={filterStudent} onChange={(e) => setFilterStudent(e.target.value)} />
          </label>
          <div className="toolbar-actions">
            <span style={{ fontSize: 9, color: '#7a879c' }}>Convenciones:</span>
            <span className="matrix-pill green">P</span> <span style={{ fontSize: 8.5, color: '#68778f' }}>Presente</span>
            <span className="matrix-pill amber">T</span> <span style={{ fontSize: 8.5, color: '#68778f' }}>Tarde</span>
            <span className="matrix-pill green">J</span> <span style={{ fontSize: 8.5, color: '#68778f' }}>Justificada</span>
            <span className="matrix-pill rose">A</span> <span style={{ fontSize: 8.5, color: '#68778f' }}>Ausente</span>
          </div>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Estudiante</th>
                <th>Código</th>
                {['S1','S2','S3','S4','S5','S6','S7','S8','S9'].map((s) => <th key={s} style={{ textAlign: 'center' }}>{s}</th>)}
                <th>Asistidas</th>
                <th>Porcentaje</th>
                <th>Condición</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.code}>
                  <td>
                    <div className="person-cell">
                      <div className="avatar avatar-table">{r.name.split(' ').map(x=>x[0]).join('')}</div>
                      <strong>{r.name}</strong>
                    </div>
                  </td>
                  <td><code>{r.code}</code></td>
                  {r.s.map((val, idx) => (
                    <td key={idx} style={{ textAlign: 'center' }}>
                      <span className={`matrix-pill ${val === 'P' || val === 'J' ? 'green' : val === 'T' ? 'amber' : 'rose'}`}>
                        {val}
                      </span>
                    </td>
                  ))}
                  <td><strong>{r.total}</strong></td>
                  <td><strong style={{ color: r.risk ? '#b83b32' : '#2b784e' }}>{r.pct}</strong></td>
                  <td>
                    {r.risk ? (
                      <span className="risk-pill danger">
                        <AlertTriangle size={11} /> En riesgo (&lt;80%)
                      </span>
                    ) : (
                      <span className="risk-pill safe">
                        <Check size={11} /> Al día
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="privacy-note">
          <AlertTriangle size={14} style={{ color: '#d08616' }} /> Alerta reglamentaria: El reglamento estudiantil de la UNIAJC estipula que una inasistencia superior al 20% injustificada inhabilita el derecho a evaluación final.
        </p>
      </section>
    </>
  )
}

function QuestionBankScreen({ action }: { action: (message: string) => void }) {
  const [topic, setTopic] = useState('Todas')
  const questions = [
    {
      id: 'Q-01',
      topic: 'Ciclos',
      title: '¿Qué estructura de control permite ejecutar un bloque de instrucciones de manera repetitiva mientras una condición booleana se mantenga verdadera?',
      options: [
        { text: 'Bucle while (condición) {...}', correct: true },
        { text: 'Condicional if (condición) {...}', correct: false },
        { text: 'Estructura switch (valor) {...}', correct: false },
        { text: 'Bloque try {...} catch (...)', correct: false },
      ],
      successRate: '94,2%',
      difficulty: 'Básica',
      status: 'Activa',
      uses: 48
    },
    {
      id: 'Q-02',
      topic: 'Arreglos',
      title: 'En los lenguajes de programación indexados en base cero (C, Java, Python, JavaScript), ¿cuál es el índice del primer elemento de un vector?',
      options: [
        { text: 'Índice 0', correct: true },
        { text: 'Índice 1', correct: false },
        { text: 'Índice -1', correct: false },
        { text: 'Depende de la asignación dinámica', correct: false },
      ],
      successRate: '91,8%',
      difficulty: 'Básica',
      status: 'Activa',
      uses: 42
    },
    {
      id: 'Q-03',
      topic: 'Funciones',
      title: '¿Qué palabra reservada se utiliza para transferir un valor de retorno desde el ámbito interno de una función hacia la sentencia invocadora?',
      options: [
        { text: 'return', correct: true },
        { text: 'void', correct: false },
        { text: 'yield / output', correct: false },
        { text: 'send / push', correct: false },
      ],
      successRate: '96,1%',
      difficulty: 'Básica',
      status: 'Activa',
      uses: 39
    },
    {
      id: 'Q-04',
      topic: 'Variables',
      title: '¿Cuál de los siguientes tipos primitivos permite almacenar exclusivamente valores de verdad lógica (verdadero / falso)?',
      options: [
        { text: 'boolean / bool', correct: true },
        { text: 'integer / int', correct: false },
        { text: 'string / texto', correct: false },
        { text: 'float / real', correct: false },
      ],
      successRate: '88,5%',
      difficulty: 'Básica',
      status: 'Activa',
      uses: 35
    },
    {
      id: 'Q-05',
      topic: 'Ciclos',
      title: 'En una iteración con for (int i = 0; i < N; i++), ¿cuántas veces se ejecuta el bloque interno si el límite N es igual a 5?',
      options: [
        { text: '5 veces (para i = 0, 1, 2, 3, 4)', correct: true },
        { text: '4 veces (para i = 1, 2, 3, 4)', correct: false },
        { text: '6 veces (incluyendo la evaluación final)', correct: false },
        { text: 'Infinitas veces hasta desbordamiento', correct: false },
      ],
      successRate: '82,4%',
      difficulty: 'Intermedia',
      status: 'Activa',
      uses: 29
    },
  ]
  const filtered = topic === 'Todas' ? questions : questions.filter(q => q.topic.toLowerCase() === topic.toLowerCase())

  return (
    <>
      <div className="stat-grid compact-stats">
        <div className="stat-card compact"><div className="mini-status green" /><span>Preguntas activas</span><strong>12 / 14</strong></div>
        <div className="stat-card compact"><div className="mini-status blue" /><span>Temas cubiertos</span><strong>4</strong></div>
        <div className="stat-card compact"><div className="mini-status green" /><span>Acierto promedio</span><strong>90,6%</strong></div>
        <div className="stat-card compact"><div className="mini-status mint" /><span>Verificaciones hechas</span><strong>182</strong></div>
      </div>

      <section className="panel data-panel">
        <div className="data-toolbar">
          <div>
            <span className="section-kicker">BANCO DE PREGUNTAS (F-ASI-09, RB-08) · FUNDAMENTOS DE PROGRAMACIÓN</span>
            <h2>Preguntas para verificación interactiva de presencia</h2>
            <p className="toolbar-description">Rotación aleatoria al ingresar a la sesión virtual · 3 minutos de respuesta · Sin biometría ni fotografías (Ley 1581).</p>
          </div>
          <button className="primary-button" onClick={() => action('Nueva pregunta agregada')}>
            <Plus size={15} /> Nueva pregunta
          </button>
        </div>

        <div className="filter-tabs" style={{ padding: '0 17px' }}>
          {['Todas', 'Ciclos', 'Arreglos', 'Funciones', 'Variables'].map((t) => (
            <button key={t} className={topic === t ? 'active' : ''} onClick={() => { setTopic(t); action(`Filtro tema: ${t}`) }}>
              {t} {t === 'Todas' ? '(5)' : ''}
            </button>
          ))}
        </div>

        <div style={{ padding: '16px' }}>
          {filtered.map((q) => (
            <article className="q-card" key={q.id}>
              <div className="q-card-header">
                <span className="q-badge-num">{q.id} · {q.topic}</span>
                <span className="q-title">{q.title}</span>
                <span className="status-pill green">{q.status}</span>
              </div>
              <div className="q-options-grid">
                {q.options.map((opt) => (
                  <div key={opt.text} className={`q-opt ${opt.correct ? 'correct' : ''}`}>
                    <span className="radio checked" style={{ border: opt.correct ? '4px solid #3d8c66' : '1px solid #cbd3df' }} />
                    <span>{opt.text}</span>
                    {opt.correct && <span className="correct-label" style={{ marginLeft: 'auto' }}>Correcta</span>}
                  </div>
                ))}
              </div>
              <div className="q-footer">
                <span>Dificultad: <strong>{q.difficulty}</strong> · Utilizada en <strong>{q.uses}</strong> verificaciones</span>
                <span>Tasa de acierto grupal: <strong style={{ color: '#2d7c54' }}>{q.successRate}</strong></span>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button className="outline-button" style={{ padding: '4px 8px', fontSize: 9 }} onClick={() => action(`Probar pregunta ${q.id}`)}>
                    Probar
                  </button>
                  <button className="outline-button" style={{ padding: '4px 8px', fontSize: 9 }} onClick={() => action(`Editar pregunta ${q.id}`)}>
                    Editar
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
        <p className="privacy-note">
          <ShieldCheck size={14} /> Regla RB-08: Cada pregunta se presenta una sola vez por estudiante por sesión con orden aleatorio de opciones para garantizar integridad académica.
        </p>
      </section>
    </>
  )
}

function TeacherResourcesScreen({ action }: { action: (message: string) => void }) {
  const tools = [
    { mark: 'PY', name: 'Programiz', desc: 'Compilador y entorno interactivo de algoritmos en Python y C.', site: 'programiz.com', clicks: 48, status: 'Activo', tone: 'blue' },
    { mark: 'DB', name: 'SQLBolt', desc: 'Lecciones guiadas interactivas de consultas SQL relacionales.', site: 'sqlbolt.com', clicks: 36, status: 'Activo', tone: 'mint' },
    { mark: 'MD', name: 'Visualgo', desc: 'Animación interactiva de árboles, grafos, pilas, colas y matrices.', site: 'visualgo.net', clicks: 32, status: 'Activo', tone: 'purple' },
    { mark: 'PT', name: 'Python Tutor', desc: 'Ejecución visual de código para observar el estado de variables en memoria.', site: 'pythontutor.com', clicks: 26, status: 'Activo', tone: 'blue' },
  ]
  return (
    <>
      <div className="stat-grid compact-stats">
        <div className="stat-card compact"><div className="mini-status blue" /><span>Recursos recomendados</span><strong>4 activos</strong></div>
        <div className="stat-card compact"><div className="mini-status mint" /><span>Consultas de estudiantes</span><strong>142 clics</strong></div>
        <div className="stat-card compact"><div className="mini-status green" /><span>Estudiantes que accedieron</span><strong>28 / 32</strong></div>
        <div className="stat-card compact"><div className="mini-status amber" /><span>Sugerencias recibidas</span><strong>2</strong></div>
      </div>

      <section className="panel data-panel">
        <div className="data-toolbar">
          <div>
            <span className="section-kicker">HERRAMIENTAS PEDAGÓGICAS · FUNDAMENTOS DE PROGRAMACIÓN</span>
            <h2>Recursos y herramientas recomendadas para el grupo</h2>
            <p className="toolbar-description">Los recursos recomendados aparecen visibles en el panel de los estudiantes del Grupo 841A.</p>
          </div>
          <button className="primary-button" onClick={() => action('Recomendar una herramienta')}>
            <Plus size={15} /> Recomendar herramienta
          </button>
        </div>

        <div className="resource-grid">
          {tools.map((t) => (
            <article className="resource-card" key={t.name}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div className={`resource-logo ${t.tone}`}>{t.mark}</div>
                <span className="status-pill green">{t.status}</span>
              </div>
              <h3>{t.name}</h3>
              <p>{t.desc}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '8px 0 10px', fontSize: 8.5, color: '#7a889e' }}>
                <span className="resource-site" style={{ margin: 0 }}><ExternalLink size={12} /> {t.site}</span>
                <span><strong>{t.clicks}</strong> interacciones</span>
              </div>
              <div style={{ display: 'flex', gap: 6, borderTop: '1px solid #edf1f6', paddingTop: 8 }}>
                <button className="outline-button" style={{ padding: '5px 8px', fontSize: 9 }} onClick={() => action(`Editar recurso ${t.name}`)}>Editar</button>
                <button className="text-button" onClick={() => action(`Abriendo ${t.name}`)}>Visitar enlace <ArrowRight size={13} /></button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  )
}

function ResourcesScreen({id,action}:{id:string;action:(message:string)=>void}) {
  return (
    <section className="panel data-panel">
      <div className="data-toolbar">
        <div>
          <span className="section-kicker">HERRAMIENTAS RECOMENDADAS · FUNDAMENTOS DE PROGRAMACIÓN</span>
          <h2>Aprende con estas herramientas</h2>
          <p className="toolbar-description">Recursos interactivos seleccionados por tu docente para fortalecer la práctica de algoritmos y programación.</p>
        </div>
        <button className="outline-button" onClick={() => action('Herramientas actualizadas')}><Activity size={15}/>Actualizar</button>
      </div>
      <div className="resource-grid">
        {[
          ['PY','Programiz','Practica conceptos de programación con ejercicios interactivos y compilador en línea.','programiz.com','blue'],
          ['DB','SQLBolt','Tutorial interactivo paso a paso para aprender y ejercitar consultas SQL relacionales.','sqlbolt.com','mint'],
          ['MD','Visualgo','Visualiza algoritmos, estructuras de datos, recursión y matrices paso a paso.','visualgo.net','purple'],
          ['PT','Python Tutor','Observa visualmente cómo la memoria y variables cambian línea a línea en tu código.','pythontutor.com','blue'],
          ['CS','CS50 Sandbox','Entorno de desarrollo ágil en la nube para probar pequeños algoritmos.','sandbox.cs50.io','mint'],
          ['CF','Codeforces','Problemas de lógica y programación competitiva para niveles iniciales.','codeforces.com','purple']
        ].map(([mark,name,desc,site,color])=>(
          <article className="resource-card" key={name}>
            <div className={`resource-logo ${color}`}>{mark}</div>
            <h3>{name}</h3>
            <p>{desc}</p>
            <span className="resource-site"><ExternalLink size={13}/>{site}</span>
            <button className="text-button" onClick={()=>action(`Abriendo ${name} en una nueva pestaña`)}>Abrir recurso <ArrowRight size={14}/></button>
          </article>
        ))}
      </div>
    </section>
  )
}

function EnrollmentManagementScreen({ action }: { action: (message: string) => void }) {
  const [filter, setFilter] = useState('')
  const students = [
    { code: '2200384', name: 'Laura Sofía Gómez Morales', email: 'laura.gomez@estudiantes.uniajc.edu.co', date: '01/08/2026', status: 'Activo', tone: 'green' },
    { code: '2200417', name: 'Kevin Andrés González Dinas', email: 'kevin.gonzalez@estudiantes.uniajc.edu.co', date: '01/08/2026', status: 'Activo', tone: 'green' },
    { code: '2200405', name: 'Mateo Rojas Carvajal', email: 'mateo.rojas@estudiantes.uniajc.edu.co', date: '02/08/2026', status: 'Activo', tone: 'green' },
    { code: '2200420', name: 'Valentina Cruz Delgado', email: 'valentina.cruz@estudiantes.uniajc.edu.co', date: '02/08/2026', status: 'Activo', tone: 'green' },
    { code: '2200431', name: 'Carlos Alberto Méndez', email: 'carlos.mendez@estudiantes.uniajc.edu.co', date: '03/08/2026', status: 'Activo', tone: 'green' },
    { code: '2200442', name: 'Samuel Torres Beltrán', email: 'samuel.torres@estudiantes.uniajc.edu.co', date: '04/08/2026', status: 'Pendiente activación', tone: 'amber' },
    { code: '2200455', name: 'Andrea Pineda López', email: 'andrea.pineda@estudiantes.uniajc.edu.co', date: '05/08/2026', status: 'Activo', tone: 'green' },
    { code: '2200468', name: 'Diana Marcela Restrepo', email: 'diana.restrepo@estudiantes.uniajc.edu.co', date: '06/08/2026', status: 'Pendiente activación', tone: 'amber' },
  ]
  const filtered = students.filter(s => s.name.toLowerCase().includes(filter.toLowerCase()) || s.code.includes(filter))

  return (
    <>
      <div className="stat-grid compact-stats">
        <div className="stat-card compact"><div className="mini-status blue" /><span>Matriculados oficiales</span><strong>32 / 35</strong></div>
        <div className="stat-card compact"><div className="mini-status green" /><span>Cuentas activas aula+</span><strong>29</strong></div>
        <div className="stat-card compact"><div className="mini-status amber" /><span>Invitaciones pendientes</span><strong>3</strong></div>
        <div className="stat-card compact"><div className="mini-status mint" /><span>Cupos disponibles</span><strong>3</strong></div>
      </div>

      <section className="panel data-panel">
        <div className="data-toolbar">
          <div>
            <span className="section-kicker">CONTROL DE MATRÍCULAS (F-ADM-07) · FACULTAD DE INGENIERÍA</span>
            <h2>Fundamentos de programación · Grupo 841A</h2>
            <p className="toolbar-description">Periodo académico 2026-2 · Semestre 1 · Sincronizado con Registro y Control Académico UNIAJC.</p>
          </div>
          <div className="toolbar-actions">
            <button className="outline-button" onClick={() => action('Importar CSV para matricula masiva')}>
              <Download size={15} /> Importar CSV
            </button>
            <button className="primary-button" onClick={() => action('Matricular estudiante en grupo 841A')}>
              <Plus size={15} /> Matricular estudiante
            </button>
          </div>
        </div>

        <div className="data-toolbar secondary-toolbar">
          <label className="inline-search">
            <Search size={15} />
            <input placeholder="Buscar por nombre o código..." value={filter} onChange={(e) => setFilter(e.target.value)} />
          </label>
          <div className="toolbar-actions">
            <button className="outline-button" onClick={() => action('Exportando lista de matriculados')}>Descargar lista</button>
          </div>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Código</th>
                <th>Estudiante</th>
                <th>Correo institucional</th>
                <th>Fecha de inscripción</th>
                <th>Estado aula+</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.code}>
                  <td><code>{s.code}</code></td>
                  <td>
                    <div className="person-cell">
                      <div className="avatar avatar-table">{s.name.split(' ').slice(0,2).map(x=>x[0]).join('')}</div>
                      <strong>{s.name}</strong>
                    </div>
                  </td>
                  <td>{s.email}</td>
                  <td>{s.date}</td>
                  <td><span className={`status-pill ${s.tone}`}>{s.status}</span></td>
                  <td>
                    {s.status.includes('Pendiente') ? (
                      <button className="outline-button" style={{ padding: '4px 8px', fontSize: 9 }} onClick={() => action(`Reenviando invitación a ${s.email}`)}>
                        Reenviar enlace
                      </button>
                    ) : (
                      <button className="more-button" aria-label={`Opciones de ${s.name}`} onClick={() => action(`Opciones de matrícula para ${s.name}`)}>
                        <MoreHorizontal size={16} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="table-footer">
          <span>Mostrando {filtered.length} de 32 estudiantes matriculados</span>
          <div>
            <button aria-label="Página anterior"><ChevronLeft size={16} /></button>
            <button className="page-number">1</button>
            <button>2</button>
            <button>3</button>
            <button aria-label="Página siguiente"><ChevronRight size={16} /></button>
          </div>
        </div>
      </section>
    </>
  )
}

function AuditLogScreen({ action }: { action: (message: string, spec?: DialogSpec) => void }) {
  const [filterType, setFilterType] = useState('Todos')
  const logs = [
    { hash: '7f3a9e14c0b29845d16a8c3d91f24e0b5832a1e948c27183fa4192b0e6d8a351', time: 'Hoy, 9:42:15 a. m.', user: 'Javier Pérez Campo', role: 'Docente', action: 'CAMBIO_EMERGENCIA_ENLACE (RB-05)', entity: 'Sesión 09 · Grupo 841A', ip: '181.61.204.12', cat: 'Enlaces' },
    { hash: 'e41d8b02fc610344d59a721c8901b54a237f8149e31d8065bf1920ab4c19ef02', time: 'Hoy, 9:15:00 a. m.', user: 'Sistema aula+', role: 'Servicio Daemon', action: 'BLOQUEO_ORDINARIO_ENLACE (RB-04)', entity: 'Sesión 09 · Grupo 841A', ip: '127.0.0.1 (local)', cat: 'Enlaces' },
    { hash: 'a9c4311054b12389e023418cd90a21f78234be19f04128938fa21e840d829140', time: 'Hoy, 8:45:22 a. m.', user: 'Sofía Ramírez', role: 'Administrador', action: 'ALTA_USUARIO_INSTITUCIONAL', entity: 'Usuario: laura.gomez', ip: '190.84.112.5', cat: 'Cuentas' },
    { hash: '5b208ef712093844bca0921389e0129f84392018fca9012389ef041289ea0192', time: 'Ayer, 5:12:40 p. m.', user: 'Javier Pérez Campo', role: 'Docente', action: 'JUSTIFICACION_ASISTENCIA (RB-10)', entity: 'Estudiante: Valentina Cruz', ip: '181.61.204.12', cat: 'Asistencia' },
    { hash: '319c5a4d89012349e190248ab0912f8409128390fca9012839efa019283901a2', time: 'Ayer, 3:30:11 p. m.', user: 'Carlos Valencia (DTIC)', role: 'Administrador', action: 'ACTUALIZAR_PARAMETRO (RB-14)', entity: 'Ventana verificación: 3 min', ip: '192.168.10.4', cat: 'Parámetros' },
    { hash: '9d84e20148901293ef012984ab0912f8409128390fca9012839efa019283901b', time: '7 oct, 2:10:05 p. m.', user: 'Sistema aula+', role: 'Servicio Daemon', action: 'RESUMEN_NOTIFICACIONES_ENV', entity: 'Lote 841A (32 estudiantes)', ip: '127.0.0.1 (local)', cat: 'Cuentas' },
  ]
  const filtered = filterType === 'Todos' ? logs : logs.filter(l => l.cat === filterType)

  return (
    <>
      <div className="stat-grid compact-stats">
        <div className="stat-card compact"><div className="mini-status blue" /><span>Total registros inmutables</span><strong>1.482</strong></div>
        <div className="stat-card compact"><div className="mini-status rose" /><span>Cambios emergencia (RB-05)</span><strong>2</strong></div>
        <div className="stat-card compact"><div className="mini-status mint" /><span>Justificaciones (RB-10)</span><strong>7</strong></div>
        <div className="stat-card compact"><div className="mini-status green" /><span>Integridad criptográfica</span><strong>100% OK</strong></div>
      </div>

      <section className="panel data-panel">
        <div className="data-toolbar">
          <div>
            <span className="section-kicker">SEGURIDAD Y TRAZABILIDAD (F-ADM-09, RB-14) · CADENA CRIPTOGRÁFICA</span>
            <h2>Registro inmutable de auditoría institucional</h2>
            <p className="toolbar-description">Cada operación sensible genera un bloque firmado con SHA-256 no repudiable para auditoría de la DTIC.</p>
          </div>
          <button className="outline-button" onClick={() => action('Verificando integridad criptográfica de la cadena')}>
            <ShieldCheck size={15} /> Verificar cadena
          </button>
        </div>

        <div className="filter-tabs" style={{ padding: '0 17px' }}>
          {['Todos', 'Enlaces', 'Asistencia', 'Cuentas', 'Parámetros'].map((f) => (
            <button key={f} className={filterType === f ? 'active' : ''} onClick={() => { setFilterType(f); action(`Filtro auditoría: ${f}`) }}>
              {f}
            </button>
          ))}
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Hash SHA-256</th>
                <th>Fecha y hora</th>
                <th>Actor</th>
                <th>Rol</th>
                <th>Acción ejecutada</th>
                <th>Entidad afectada</th>
                <th>IP origen</th>
                <th>Detalle</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((l) => (
                <tr key={l.hash}>
                  <td><span className="audit-hash-badge">{l.hash.slice(0, 16)}...</span></td>
                  <td>{l.time}</td>
                  <td><strong>{l.user}</strong></td>
                  <td><span className="status-pill gray">{l.role}</span></td>
                  <td>
                    <span className={`status-pill ${l.action.includes('RB-05') ? 'rose' : l.action.includes('RB-10') ? 'green' : 'blue'}`}>
                      {l.action}
                    </span>
                  </td>
                  <td>{l.entity}</td>
                  <td><code>{l.ip}</code></td>
                  <td>
                    <button
                      className="outline-button"
                      style={{ padding: '4px 8px', fontSize: 9 }}
                      onClick={() => action(`Inspeccionar bloque ${l.hash.slice(0, 8)}`, {
                        kind: 'drawer',
                        drawerData: {
                          title: `Bloque SHA-256 · ${l.action}`,
                          subtitle: `${l.entity} · Registrado el ${l.time}`,
                          kicker: 'CADENA CRIPTOGRÁFICA INMUTABLE (SHA-256)',
                          sections: [
                            { label: 'Hash criptográfico (SHA-256)', value: l.hash, isCode: true },
                            { label: 'Fecha y hora (Sello NTP)', value: l.time },
                            { label: 'Actor responsable y rol', value: `${l.user} (${l.role})` },
                            { label: 'Acción institucional auditada', value: l.action, isBadge: true, badgeTone: l.action.includes('RB-05') ? 'rose' : l.action.includes('RB-10') ? 'green' : 'blue' },
                            { label: 'Entidad afectada', value: l.entity },
                            { label: 'Dirección IP de origen', value: l.ip, isCode: true },
                            { label: 'Integridad y no repudio (RB-14)', value: 'Verificado con firma digital DTIC', isBadge: true, badgeTone: 'green' }
                          ],
                          jsonPayload: JSON.stringify({
                            version: '2.0',
                            evento: l.action,
                            categoria: l.cat,
                            actor: l.user,
                            rol: l.role,
                            entidad: l.entity,
                            timestamp: l.time,
                            ip: l.ip,
                            hash_sha256: l.hash,
                            integridad_criptografica: 'VALIDA_NTP_SINCRONIZADO'
                          }, null, 2)
                        }
                      })}
                    >
                      Inspeccionar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="privacy-note">
          <LockKeyhole size={14} /> Principio de no repudio (RB-14): Los registros de auditoría no pueden ser eliminados ni modificados por ningún perfil administrativo.
        </p>
      </section>
    </>
  )
}

function DataClaimsScreen({ action }: { action: (message: string) => void }) {
  const claims = [
    { id: 'RD-2026-014', holder: 'Estudiante · CC •••••184', type: 'Consulta de registros de asistencia', date: '7 oct 2026', daysLeft: '9 días hábiles', status: 'En trámite', tone: 'amber' },
    { id: 'RD-2026-012', holder: 'Docente · CC •••••902', type: 'Rectificación de correo institucional', date: '5 oct 2026', daysLeft: '7 días hábiles', status: 'En trámite', tone: 'amber' },
    { id: 'RD-2026-009', holder: 'Estudiante · CC •••••337', type: 'Supresión de cuenta inactiva (egresado)', date: '2 oct 2026', daysLeft: 'Resuelta en 4 días', status: 'Resuelta', tone: 'green' },
    { id: 'RD-2026-006', holder: 'Estudiante · CC •••••512', type: 'Consulta de historial de participación', date: '25 sep 2026', daysLeft: 'Resuelta en 3 días', status: 'Resuelta', tone: 'green' },
  ]

  return (
    <>
      <div className="habeas-banner">
        <ShieldCheck size={20} />
        <div>
          <strong>PROTECCIÓN DE DATOS PERSONALES · LEY ESTATUTARIA 1581 DE 2012 Y DECRETO 1377 DE 2013</strong>
          <p>La plataforma aula+ opera bajo principios estrictos de minimización de datos. <strong>No procesa, no solicita ni almacena datos biométricos, reconocimiento facial ni fotografías de los titulares.</strong> Toda solicitud de consulta, actualización o supresión debe responderse en un plazo legal perentorio máximo de 15 días hábiles.</p>
        </div>
      </div>

      <div className="stat-grid compact-stats">
        <div className="stat-card compact"><div className="mini-status blue" /><span>Solicitudes radicadas</span><strong>6</strong></div>
        <div className="stat-card compact"><div className="mini-status amber" /><span>En trámite legal</span><strong>2</strong></div>
        <div className="stat-card compact"><div className="mini-status green" /><span>Resueltas formalmente</span><strong>4</strong></div>
        <div className="stat-card compact"><div className="mini-status mint" /><span>Cumplimiento de plazos</span><strong>100%</strong></div>
      </div>

      <section className="panel data-panel">
        <div className="data-toolbar">
          <div>
            <span className="section-kicker">GESTIÓN DE HABEAS DATA (F-ADM-11) · SECRETARÍA GENERAL</span>
            <h2>Solicitudes y reclamaciones de titulares de datos</h2>
            <p className="toolbar-description">Atención de peticiones de estudiantes y docentes sobre sus datos personales almacenados en aula+.</p>
          </div>
          <button className="primary-button" onClick={() => action('Atender reclamación de datos personales')}>
            <FileText size={15} /> Atender reclamación
          </button>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Radicado</th>
                <th>Titular solicitante</th>
                <th>Derecho ejercido</th>
                <th>Fecha radicación</th>
                <th>Término legal</th>
                <th>Estado</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {claims.map((c) => (
                <tr key={c.id}>
                  <td><strong>{c.id}</strong></td>
                  <td><code>{c.holder}</code></td>
                  <td>{c.type}</td>
                  <td>{c.date}</td>
                  <td><span className="legal-countdown"><Clock3 size={11} /> {c.daysLeft}</span></td>
                  <td><span className={`status-pill ${c.tone}`}>{c.status}</span></td>
                  <td>
                    <button className="outline-button" style={{ padding: '4px 8px', fontSize: 9 }} onClick={() => action(`Atender reclamación ${c.id}`)}>
                      {c.status === 'Resuelta' ? 'Ver acta' : 'Atender'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="privacy-note">
          <ShieldCheck size={14} /> Las respuestas a peticiones de Habeas Data son notificadas al correo institucional del titular con copia a la asesoría jurídica institucional.
        </p>
      </section>
    </>
  )
}

function AcademicCatalogueScreen({ action }: { action: (message: string) => void }) {
  const semesters = [
    {
      sem: 'Semestre 1',
      credits: '16 créditos',
      subjects: [
        { code: 'SIS-101', name: 'Fundamentos de programación', cr: '3 cr' },
        { code: 'MAT-101', name: 'Matemáticas discretas', cr: '3 cr' },
        { code: 'MAT-102', name: 'Cálculo diferencial', cr: '3 cr' },
        { code: 'ING-101', name: 'Introducción a la ingeniería', cr: '2 cr' },
        { code: 'HUM-101', name: 'Competencias comunicativas', cr: '2 cr' },
        { code: 'ENG-101', name: 'Inglés I', cr: '3 cr' },
      ]
    },
    {
      sem: 'Semestre 3',
      credits: '17 créditos',
      subjects: [
        { code: 'SIS-301', name: 'Bases de datos', cr: '3 cr' },
        { code: 'SIS-302', name: 'Estructuras de datos', cr: '3 cr' },
        { code: 'MAT-301', name: 'Álgebra lineal', cr: '3 cr' },
        { code: 'FIS-301', name: 'Física general', cr: '3 cr' },
        { code: 'ENG-301', name: 'Inglés III', cr: '3 cr' },
        { code: 'HUM-301', name: 'Constitución y democracia', cr: '2 cr' },
      ]
    },
    {
      sem: 'Semestre 5',
      credits: '16 créditos',
      subjects: [
        { code: 'SIS-501', name: 'Ingeniería de software I', cr: '3 cr' },
        { code: 'SIS-502', name: 'Redes de computadores', cr: '3 cr' },
        { code: 'SIS-503', name: 'Sistemas operativos', cr: '3 cr' },
        { code: 'INV-501', name: 'Metodología de la investigación', cr: '2 cr' },
        { code: 'MAT-501', name: 'Probabilidad y estadística', cr: '3 cr' },
        { code: 'HUM-501', name: 'Electiva sociohumanística I', cr: '2 cr' },
      ]
    },
    {
      sem: 'Semestre 8',
      credits: '16 créditos',
      subjects: [
        { code: 'PRG-801', name: 'Anteproyecto de grado', cr: '3 cr' },
        { code: 'EMP-801', name: 'Innovación y emprendimiento', cr: '3 cr' },
        { code: 'SIS-801', name: 'Seguridad informática', cr: '3 cr' },
        { code: 'SIS-802', name: 'Arquitectura empresarial', cr: '3 cr' },
        { code: 'HUM-801', name: 'Deontología y ética profesional', cr: '2 cr' },
        { code: 'OPT-801', name: 'Electiva de profundización III', cr: '2 cr' },
      ]
    },
  ]

  return (
    <>
      <div className="catalogue-card">
        <div className="catalogue-header">
          <div>
            <span className="section-kicker">PROGRAMA ACADÉMICO REGISTRADO · UNIAJC</span>
            <h2 style={{ margin: '4px 0', fontSize: 16 }}>Ingeniería de Sistemas · Sede Norte</h2>
            <p className="toolbar-description">Código SNIES: 10245 · Registro Calificado Resolución 014820 MinEducación · 160 créditos académicos.</p>
          </div>
          <div className="toolbar-actions">
            <button className="outline-button" onClick={() => action('Nueva asignatura')}>
              <Plus size={14} /> Nueva asignatura
            </button>
            <button className="primary-button" onClick={() => action('Nuevo periodo')}>
              <Plus size={14} /> Nuevo periodo
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 18 }}>
          <div className="stat-card compact"><div className="mini-status green" /><span>Periodo vigente</span><strong>2026-2 (Activo)</strong></div>
          <div className="stat-card compact"><div className="mini-status blue" /><span>Facultad</span><strong>Ingeniería</strong></div>
          <div className="stat-card compact"><div className="mini-status mint" /><span>Grupos en curso</span><strong>24 grupos</strong></div>
        </div>

        <div style={{ borderTop: '1px solid #edf0f5', paddingTop: 14 }}>
          <h3 style={{ fontSize: 13, color: '#273852', margin: '0 0 12px' }}>Malla curricular y asignaturas por semestre</h3>
          {semesters.map((s) => (
            <div className="semester-row" key={s.sem}>
              <div>
                <span className="semester-tag">{s.sem}</span>
                <small style={{ display: 'block', textAlign: 'center', fontSize: 8, color: '#8592a4', marginTop: 3 }}>{s.credits}</small>
              </div>
              <div className="subject-chips">
                {s.subjects.map((sub) => (
                  <div className="subject-chip" key={sub.code} title={`${sub.name} (${sub.cr})`}>
                    <strong>{sub.code}</strong>
                    <span>{sub.name}</span>
                    <small>({sub.cr})</small>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

function AdminScreen({id,tab,setTab,action}:{id:string;tab:string;setTab:(v:string)=>void;action:(message:string)=>void}) {
 const config:Record<string,{title:string;desc:string;columns:string[];rows:string[][]}>={
  'P-23':{title:'Usuarios registrados',desc:'Gestiona las cuentas y permisos institucionales.',columns:['Nombre','Correo institucional','Rol','Estado','Último acceso'],rows:[['Laura Gómez','laura.gomez@estudiantes.uniajc.edu.co','Estudiante','Activo','Hoy, 9:42 a. m.'],['Javier Pérez','javier.perez@uniajc.edu.co','Docente','Activo','Hoy, 8:10 a. m.'],['Mateo Rojas','mateo.rojas@estudiantes.uniajc.edu.co','Estudiante','Activo','Ayer, 4:26 p. m.'],['Sofía Ramírez','sofia.ramirez@uniajc.edu.co','Administrador','Activo','7 oct, 2:11 p. m.']]},
  'P-24':{title:'Cursos y horarios',desc:'Administra la oferta académica del periodo.',columns:['Curso','Programa','Grupo','Horario','Docente'],rows:[['Fundamentos de programación','Ing. de Sistemas','841A','Lun y jue · 10:00 a. m.','Javier Pérez'],['Bases de datos','Ing. de Sistemas','831B','Mar y vie · 2:00 p. m.','Mónica Salazar'],['Matemáticas discretas','Ing. de Sistemas','841A','Lun y mié · 8:00 a. m.','Carlos Ríos'],['Ingeniería de software','Ing. de Sistemas','802A','Mié · 6:00 p. m.','Javier Pérez']]},
  'P-30':{title:'Grupos del periodo',desc:'Crea, organiza y archiva grupos académicos.',columns:['Grupo','Materia','Docente','Jornada','Estudiantes'],rows:[['841A','Fundamentos de programación','Javier Pérez','Mañana','32'],['831B','Bases de datos','Mónica Salazar','Tarde','28'],['802A','Ingeniería de software','Javier Pérez','Noche','30'],['843B','Matemáticas discretas','Carlos Ríos','Mañana','26']]},
  'P-31':{title:'Accesos administrativos',desc:'Define perfiles y su ámbito de gestión.',columns:['Nombre','Correo institucional','Ámbito','Estado'],rows:[['Sofía Ramírez','sofia.ramirez@uniajc.edu.co','Institucional','Activo'],['Andrés Valencia','andres.valencia@uniajc.edu.co','Facultad de Ingeniería','Activo'],['María López','maria.lopez@uniajc.edu.co','Programa · Sistemas','Activo']]}
 }
 const data=config[id];
 if(id==='P-26') return (
   <section className="panel settings-panel">
     <div className="data-toolbar">
       <div>
         <span className="section-kicker">CONFIGURACIÓN INSTITUCIONAL</span>
         <h2>Parámetros del sistema</h2>
       </div>
       <button className="outline-button" onClick={()=>action('Historial de cambios abierto')}><Activity size={15}/>Historial de cambios</button>
     </div>
     <div className="parameter-list">
       {[
         ['Ventana de verificación de presencia (RB-08)','3 minutos','Tiempo disponible para responder la pregunta conceptual interactiva.'],
         ['Bloqueo de enlace antes de clase (RB-04)','30 minutos','El enlace queda bloqueado antes del inicio para evitar desorientación.'],
         ['Retención de registros de asistencia','12 meses','Periodo de conservación conforme a la política institucional.'],
         ['Notificación de dudas y alertas','Resumen diario','Frecuencia de avisos al docente responsable del grupo.']
       ].map(([l,v,d])=>(
         <div className="parameter-row" key={l}>
           <div><strong>{l}</strong><p>{d}</p></div>
           <select defaultValue={v} aria-label={l}><option>{v}</option><option>Personalizado</option></select>
         </div>
       ))}
     </div>
     <button className="primary-button" onClick={()=>action('Parámetros guardados con registro de auditoría')}><Check size={15}/>Guardar cambios</button>
   </section>
 )
 return (
   <section className="panel data-panel">
     <div className="data-toolbar">
       <div>
         <span className="section-kicker">{id==='P-23'?'ADMINISTRACIÓN · CUENTAS':'GESTIÓN ACADÉMICA · 2026-2'}</span>
         <h2>{data?.title??'Datos de la institución'}</h2>
         <p className="toolbar-description">{data?.desc??'Administra la información de la plataforma.'}</p>
       </div>
       <button className="primary-button" onClick={()=>action(id==='P-23'?'Formulario para crear usuario':id==='P-30'?'Formulario para crear grupo':'Nuevo registro')}>
         <Plus size={15}/>{id==='P-23'?'Crear usuario':id==='P-30'?'Crear grupo':'Nuevo'}
       </button>
     </div>
     <div className="data-toolbar secondary-toolbar">
       <label className="inline-search"><Search size={15}/><input placeholder="Buscar por nombre o código"/></label>
       <div className="toolbar-actions"><button className="outline-button" onClick={()=>action('Filtros desplegados')}><Filter size={15}/>Filtros</button></div>
     </div>
     <div className="table-wrap">
       <table>
         <thead>
           <tr>
             {data?.columns.map(col=><th key={col}>{col}{col==='Nombre'&&<ArrowDownUp size={12}/>}</th>)}
           </tr>
         </thead>
         <tbody>
           {data?.rows.map((row,i)=>(
             <tr key={i}>
               {row.map((cell,j)=>(
                 <td key={j}>
                   {j===0?<div className="person-cell"><div className="avatar avatar-table">{cell.split(' ').slice(0,2).map(x=>x[0]).join('')}</div><strong>{cell}</strong></div>:j===row.length-1&&['Activo','Matriculado','Exitoso','Resuelta'].includes(cell)?<span className="status-pill green">{cell}</span>:j===row.length-1&&['Pendiente','En revisión'].includes(cell)?<span className="status-pill amber">{cell}</span>:cell}
                 </td>
               ))}
             </tr>
           ))}
         </tbody>
       </table>
     </div>
     <div className="table-footer">
       <span>Mostrando {data?.rows.length??0} registros · Página 1 de 8</span>
       <div>
         <button aria-label="Página anterior"><ChevronLeft size={16}/></button>
         <button className="page-number">1</button>
         <button>2</button>
         <button>3</button>
         <button aria-label="Página siguiente"><ChevronRight size={16}/></button>
       </div>
     </div>
   </section>
 )
}

function CalendarScreen({week,setWeek,action}:{week:number;setWeek:(n:number)=>void;action:(m:string)=>void}) { const days=['Lun 5','Mar 6','Mié 7','Jue 8','Vie 9']; return <section className="panel calendar-panel"><div className="calendar-toolbar"><div className="segmented"><button className="selected">Semana</button><button onClick={()=>action('Vista mensual seleccionada')}>Mes</button></div><div className="calendar-center"><button className="icon-button" aria-label="Semana anterior" onClick={()=>setWeek(week-1)}><ChevronLeft size={17}/></button><strong>{week===0?'5 – 9 de octubre de 2026':week<0?'28 sep – 2 oct de 2026':'12 – 16 de octubre de 2026'}</strong><button className="icon-button" aria-label="Semana siguiente" onClick={()=>setWeek(week+1)}><ChevronRight size={17}/></button></div><button className="outline-button" onClick={()=>setWeek(0)}>Hoy</button></div><div className="calendar-grid"><div className="calendar-time-spacer"/>{days.map((d,i)=><div className={i===3?'day-heading current':'day-heading'} key={d}>{d.split(' ')[0]}<strong>{Number(d.split(' ')[1])+week*7}</strong></div>)}{['8 a. m.','9 a. m.','10 a. m.','11 a. m.','12 p. m.','1 p. m.','2 p. m.','3 p. m.'].map((time,row)=><div className="calendar-row" key={time}><span className="calendar-time">{time}</span>{days.map((day,col)=><div className="calendar-cell" key={day+time}>{(row===2&&col===0||row===4&&col===2||row===6&&col===3)&&<button className={`calendar-event event-${(col+row)%3}`} onClick={()=>action('Abriendo detalle de la clase')}>{row===2?'Fundamentos de programación':row===4?'Matemáticas discretas':'Bases de datos'}<small>{row===2?'10:00 · Teams':row===4?'12:00 · Meet':'2:00 · Zoom'}</small></button>}</div>)}</div>)}</div></section> }
function AttendanceCheck({ action }: { action: (m: string, spec?: DialogSpec) => void }) {
  const [step, setStep] = useState(1)
  const [secondsLeft, setSecondsLeft] = useState(168)
  const [attempt] = useState(1)

  useEffect(() => {
    if (step === 3) return
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [step])

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  return (
    <div className="check-layout">
      <section className="panel check-card">
        <div className="check-course">
          <div className="subject-icon"><BookOpen size={20} /></div>
          <div>
            <strong>Fundamentos de programación</strong>
            <span>Grupo 841A · Javier Pérez Campo</span>
          </div>
          <span className="time-pill"><span /> ABIERTA</span>
        </div>
        <div className="progress-steps">
          {['Ingreso', 'Verificación', 'Confirmación'].map((x, i) => (
            <div className={i + 1 <= step ? 'step done' : 'step'} key={x}>
              <span>{i + 1 < step ? <Check size={13} /> : i + 1}</span>
              <small>{x}</small>
            </div>
          ))}
        </div>
        {step === 1 ? (
          <div className="check-body">
            <div className="check-illustration"><ClipboardCheck size={32} /></div>
            <span className="section-kicker">PASO 1 DE 3 · REGLA RB-08</span>
            <h2>Registra tu ingreso a la clase</h2>
            <p>Confirma que estás conectado a la sesión de hoy. No necesitas encender la cámara ni salir de la videollamada.</p>
            <div className="check-info" style={{ display: 'flex', justifyContent: 'center', gap: 10 }}>
              <div className={`timer-pill ${secondsLeft < 60 ? 'urgent' : ''}`}>
                <Clock3 size={13} /> {formatTimer(secondsLeft)} min restantes
              </div>
              <span style={{ fontSize: 9, color: '#7a889e', alignSelf: 'center' }}>Intento {attempt} de 2</span>
            </div>
            <button className="primary-button wide-button" onClick={() => setStep(2)}>
              Registrar ingreso <ArrowRight size={16} />
            </button>
          </div>
        ) : step === 2 ? (
          <div className="check-body">
            <div className="check-illustration"><Sparkles size={30} /></div>
            <span className="section-kicker">PASO 2 DE 3 · PREGUNTA CONCEPTUAL (RB-08)</span>
            <h2>Pregunta rápida sobre la clase</h2>
            <p style={{ fontWeight: 600, color: '#273852', margin: '8px 0 14px' }}>
              ¿Qué estructura permite repetir instrucciones mientras una condición booleana se mantenga verdadera?
            </p>
            <div className="choice-list">
              {['Bucle while (condición)', 'Condicional if (condición)', 'Declaración de variable entera'].map((option, i) => (
                <button
                  key={option}
                  onClick={(e) => {
                    e.currentTarget.classList.add('chosen')
                    setTimeout(() => setStep(3), 360)
                  }}
                >
                  <span className="radio" />
                  <span>{option}</span>
                  {i === 0 && <span style={{ marginLeft: 'auto', fontSize: 8.5, color: '#8895a7' }}>38 s promedio</span>}
                </button>
              ))}
            </div>
            <div className="check-info">
              <ShieldCheck size={15} />
              <span>Verificación interactiva de presencia sin captura de datos biométricos ni fotografías (Ley 1581).</span>
            </div>
          </div>
        ) : (
          <div className="check-body success-body">
            <div className="success-check"><Check size={28} /></div>
            <span className="section-kicker">PASO 3 DE 3 · VALIDACIÓN EXITOSA</span>
            <h2>¡Asistencia confirmada!</h2>
            <p>Tu presencia quedó registrada en el log inmutable con sello de tiempo institucional.</p>
            <div className="attendance-status">
              <div>
                <span style={{ display: 'block', fontSize: 8.5, color: '#738399' }}>Estado oficial</span>
                <strong><span /> Presente a tiempo</strong>
              </div>
              <div style={{ textAlign: 'right' }}>
                <small style={{ fontSize: 8, color: '#8b97a8', display: 'block' }}>Tiempo empleado</small>
                <strong style={{ color: '#2b5ea9', fontSize: 9.5 }}>38 segundos (Intento 1 de 2)</strong>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
              <button
                className="outline-button"
                style={{ flex: 1 }}
                onClick={() => action('Ver constancia digital', {
                  kind: 'receipt',
                  receiptData: {
                    student: 'Kevin Andrés González Dinas',
                    code: '2200417',
                    course: 'Fundamentos de programación',
                    group: 'Grupo 841A',
                    teacher: 'Javier Pérez Campo',
                    date: 'Jueves, 8 de octubre de 2026',
                    entryTime: '10:01:28 a. m.',
                    verification: 'Pregunta conceptual respondida en 38 s (Bucle while) · Intento 1 de 2',
                    hash: 'UNIAJC-VERIF-2026-841A-2200417-8A39F'
                  }
                })}
              >
                <FileCheck2 size={14} /> Constancia (RB-12)
              </button>
              <button
                className="primary-button"
                style={{ flex: 1 }}
                onClick={() => action('Volver a la clase virtual')}
              >
                Volver a la clase <ExternalLink size={14} />
              </button>
            </div>
          </div>
        )}
      </section>
      <aside className="panel check-aside">
        <div className="aside-icon"><ShieldCheck size={18} /></div>
        <span className="section-kicker">HABEAS DATA · UNIAJC</span>
        <h2>Privacidad institucional</h2>
        <p>Esta verificación solo evalúa tu respuesta en vivo. La plataforma nunca graba imágenes de tu cámara web ni aplica algoritmos de reconocimiento facial.</p>
        <button className="text-button" onClick={() => action('Abriendo información de privacidad')}>
          Ver política de tratamiento de datos <ArrowRight size={14} />
        </button>
      </aside>
    </div>
  )
}

function AuthScreen({ id, action }: { id: string; action: (m: string) => void }) {
  const login = id === 'P-01'
  const reset = id === 'P-03'
  const [showPassword, setShowPassword] = useState(false)
  const [emailCooldown, setEmailCooldown] = useState(false)

  const handleSendRecovery = () => {
    setEmailCooldown(true)
    action('Enlace de recuperación enviado a tu correo institucional')
    setTimeout(() => setEmailCooldown(false), 30000)
  }

  return (
    <div className="auth-layout">
      <section className="auth-card">
        <div className="auth-logo">
          <div className="brand-mark"><Video size={19} /></div>
          <strong>aula<span>+</span></strong>
        </div>
        <span className="section-kicker">{login ? 'BIENVENIDO A TU CAMPUS VIRTUAL' : reset ? 'SEGURIDAD DE TU CUENTA' : 'RECUPERACIÓN INSTITUCIONAL'}</span>
        <h2>{login ? 'Inicia sesión' : reset ? 'Crea tu nueva contraseña' : 'Recupera el acceso a tu cuenta'}</h2>
        <p>
          {login
            ? 'Ingresa con tu correo institucional UNIAJC para continuar a tus clases virtuales.'
            : reset
            ? 'Establece una nueva clave para proteger tu acceso a la plataforma.'
            : 'Te enviaremos un enlace seguro y temporal a tu bandeja institucional de correo.'}
        </p>

        <div className="auth-fields">
          <label className="form-field">
            Correo institucional
            <input
              type="email"
              placeholder="nombre@estudiantes.uniajc.edu.co"
              defaultValue={login ? 'kevin.gonzalez@estudiantes.uniajc.edu.co' : ''}
            />
          </label>

          {login && (
            <label className="form-field">
              Contraseña
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Ingresa tu contraseña"
                  defaultValue="uniajc2026"
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </label>
          )}

          {reset && (
            <>
              <label className="form-field">
                Nueva contraseña
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Mínimo 10 caracteres"
                    defaultValue="Uniajc2026*"
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </label>
              <label className="form-field">
                Confirmar contraseña
                <input type="password" placeholder="Repite tu nueva contraseña" defaultValue="Uniajc2026*" />
              </label>
              <div style={{ background: '#f8fafc', border: '1px solid #edf1f6', borderRadius: 7, padding: '8px 10px', fontSize: 8.5, color: '#68778f' }}>
                <span style={{ fontWeight: 650, display: 'block', color: '#273852', marginBottom: 2 }}>Criterios de seguridad:</span>
                <div>✓ Mínimo 10 caracteres alfanuméricos</div>
                <div>✓ Al menos una mayúscula y un número</div>
                <div>✓ Sin inclusión de tu código ni datos obvios</div>
              </div>
            </>
          )}
        </div>

        {login && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', margin: '4px 0 14px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 9.5, color: '#526279', cursor: 'pointer' }}>
              <input type="checkbox" defaultChecked /> Recordar sesión
            </label>
            <button className="auth-link" style={{ margin: 0 }} onClick={() => action('Vista de recuperación disponible en P-02')}>
              ¿Olvidaste tu contraseña?
            </button>
          </div>
        )}

        <button
          className="primary-button wide-button"
          onClick={() => {
            if (id === 'P-02') handleSendRecovery()
            else action(login ? 'Inicio de sesión de demostración exitoso' : 'Contraseña restablecida correctamente')
          }}
          disabled={id === 'P-02' && emailCooldown}
        >
          {login ? 'Iniciar sesión' : reset ? 'Guardar nueva contraseña' : emailCooldown ? 'Enlace enviado (espera 30 s)' : 'Enviar enlace de recuperación'} <ArrowRight size={16} />
        </button>

        <div className="auth-secure">
          <LockKeyhole size={14} /> Acceso protegido por autenticación institucional UNIAJC
        </div>
      </section>

      <aside className="auth-side">
        <div className="auth-decoration">
          <span className="decoration-circle circle-one" />
          <span className="decoration-circle circle-two" />
          <div className="floating-card">
            <div className="subject-icon"><CalendarDays size={20} /></div>
            <div>
              <strong>Tu jornada, organizada</strong>
              <small>Clases · Enlaces · Asistencia</small>
            </div>
            <Check size={16} />
          </div>
        </div>
        <span className="section-kicker">UNIAJC · SEDE NORTE</span>
        <h2>Todo lo que rodea tu clase virtual, en un solo lugar.</h2>
        <p>Conecta con tus cursos, encuentra tus enlaces vigentes y verifica tu presencia sin complicaciones.</p>
      </aside>
    </div>
  )
}

function UtilityScreen({ id, action }: { id: string; action: (m: string) => void }) {
  const install = id === 'P-35'
  const open = id === 'P-34'
  const help = id === 'P-06'
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  const faqs = [
    {
      q: '¿Cómo cambio el enlace de clase si Teams o Meet falla?',
      a: 'Si eres docente y faltan menos de 30 minutos para la clase, la plataforma activa la regla RB-04 de bloqueo para evitar confusiones. Si surge un imprevisto técnico, utiliza el botón "Cambio de emergencia (RB-05)" indicando el motivo. Todos los estudiantes recibirán la notificación instantánea y se creará un registro inmutable en auditoría.'
    },
    {
      q: '¿Por qué la verificación de presencia no pide fotografías ni biometría?',
      a: 'Conforme a la Ley 1581 de 2012 y el principio de minimización de datos, aula+ no captura fotografías ni procesa reconocimiento facial. La asistencia se valida respondiendo una pregunta conceptual de opción múltiple aleatoria en un lapso de 3 minutos.'
    },
    {
      q: '¿Cómo descargo mi constancia digital de asistencia?',
      a: 'En la pantalla "Mi asistencia (P-10)", cada sesión tiene un botón "Constancia" que genera un comprobante con identificador criptográfico único (RB-12) válido ante la secretaría académica.'
    },
    {
      q: '¿Qué plazo tiene la institución para atender peticiones de Habeas Data?',
      a: 'Conforme al Artículo 15 de la Ley 1581 de 2012, cualquier solicitud de consulta, rectificación o supresión de datos personales debe ser resuelta en un término legal máximo de 15 días hábiles.'
    }
  ]

  return (
    <div className="utility-layout">
      <section className="panel utility-main">
        <div className="utility-art">
          <div className="utility-art-icon">
            {install ? <Download size={26} /> : open ? <ExternalLink size={26} /> : <CircleHelp size={26} />}
          </div>
        </div>
        <span className="section-kicker">
          {install ? 'ACCESO MÓVIL · PWA' : open ? 'COMPATIBILIDAD WEB' : 'CENTRO DE AYUDA Y PRIVACIDAD'}
        </span>
        <h2>
          {install ? 'Instala aula+ en tu celular' : open ? 'Abre tu clase en el navegador' : '¿En qué podemos orientarte hoy?'}
        </h2>
        <p>
          {install
            ? 'Agrega la plataforma a la pantalla de inicio de tu smartphone o tablet para consultar horarios y enlaces en segundos sin instalar aplicaciones pesadas.'
            : open
            ? 'Si experimentas problemas con la aplicación de escritorio de Teams o Zoom, puedes abrir la sesión virtual directamente desde cualquier navegador compatible.'
            : 'Preguntas frecuentes sobre enlaces de videoconferencia, verificación interactiva de asistencia y tus derechos de protección de datos personales.'}
        </p>

        {help ? (
          <div style={{ marginTop: 18 }}>
            <span className="section-kicker" style={{ display: 'block', marginBottom: 10 }}>PREGUNTAS FRECUENTES RESUELTAS</span>
            {faqs.map((f, idx) => (
              <div className="accordion-box" key={f.q}>
                <button
                  type="button"
                  className="accordion-header"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  aria-expanded={openFaq === idx}
                >
                  <span>{f.q}</span>
                  <ChevronDown
                    size={15}
                    style={{
                      transform: openFaq === idx ? 'rotate(180deg)' : 'none',
                      transition: 'transform .18s',
                      flex: 'none'
                    }}
                  />
                </button>
                {openFaq === idx && (
                  <div className="accordion-content">
                    {f.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <button
            className="primary-button"
            onClick={() => action(install ? 'Sigue los pasos de instalación en tu dispositivo' : 'Abriendo sala en el navegador del sistema')}
          >
            {install ? 'Ver guía de instalación' : 'Continuar en el navegador'} <ArrowRight size={15} />
          </button>
        )}
      </section>

      <aside className="panel utility-steps">
        <span className="section-kicker">{install ? 'EN TRES PASOS' : 'CANALES OFICIALES'}</span>
        {(install
          ? ['Abre esta página en Safari o Chrome.', 'Toca el botón Compartir o Menú.', 'Selecciona “Agregar a pantalla de inicio”.']
          : ['Secretaría Académica UNIAJC', 'Mesa de Ayuda DTIC', 'Oficina de Protección de Datos']
        ).map((item, i) => (
          <div className="utility-step" key={item}>
            <span>{i + 1}</span>
            <div>
              <strong>{item}</strong>
              <small>{install ? 'Instalación instantánea y segura.' : 'Atención institucional de lunes a viernes.'}</small>
            </div>
            <ChevronRight size={16} />
          </div>
        ))}
        <div className="help-contact">
          <CircleHelp size={16} />
          <span>¿Tienes dudas técnicas o académicas?</span>
          <button onClick={() => action('Contacto con soporte de la DTIC')}>Contactar soporte</button>
        </div>
      </aside>
    </div>
  )
}
