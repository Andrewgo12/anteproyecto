'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowDown, ArrowUp, CornerDownLeft, Search, X } from 'lucide-react'

export type CommandOption = {
  id: string
  label: string
  description: string
  category: string
}

export default function CommandPalette({
  open,
  options,
  onClose,
  onChoose,
}: {
  open: boolean
  options: CommandOption[]
  onClose: () => void
  onChoose: (id: string) => void
}) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)
  const filteredOptions = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase('es')
    if (!normalizedQuery) return options
    return options.filter((option) =>
      `${option.id} ${option.label} ${option.description} ${option.category}`
        .toLocaleLowerCase('es')
        .includes(normalizedQuery),
    )
  }, [options, query])

  useEffect(() => {
    const dialog = dialogRef.current
    if (!open || !dialog) return
    if (!dialog.open) dialog.showModal()
    setQuery('')
    setActiveIndex(0)
    window.requestAnimationFrame(() => inputRef.current?.focus())
    return () => {
      if (dialog.open) dialog.close()
    }
  }, [open])

  useEffect(() => {
    setActiveIndex((current) => Math.min(current, Math.max(filteredOptions.length - 1, 0)))
  }, [filteredOptions.length])

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActiveIndex((current) => (current + 1) % Math.max(filteredOptions.length, 1))
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveIndex((current) => (current - 1 + Math.max(filteredOptions.length, 1)) % Math.max(filteredOptions.length, 1))
    }
    if (event.key === 'Enter' && filteredOptions[activeIndex]) {
      event.preventDefault()
      onChoose(filteredOptions[activeIndex].id)
      onClose()
    }
  }

  return (
    <dialog
      ref={dialogRef}
      className="command-dialog"
      aria-label="Búsqueda rápida y navegación"
      onCancel={(event) => { event.preventDefault(); onClose() }}
      onClick={(event) => { if (event.target === event.currentTarget) onClose() }}
    >
      <section className="command-card">
        <div className="command-search-row">
          <Search aria-hidden="true" />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => { setQuery(event.target.value); setActiveIndex(0) }}
            onKeyDown={handleKeyDown}
            placeholder="Buscar pantalla, curso o acción…"
            aria-label="Buscar pantallas y acciones"
            aria-controls="command-results"
            aria-activedescendant={filteredOptions[activeIndex] ? `command-${filteredOptions[activeIndex].id}` : undefined}
            role="combobox"
            aria-expanded="true"
            aria-autocomplete="list"
          />
          <button className="command-close" type="button" aria-label="Cerrar búsqueda rápida" onClick={onClose}><X /></button>
        </div>
        <div className="command-results" id="command-results" role="listbox" aria-label="Resultados">
          {filteredOptions.length ? filteredOptions.map((option, index) => (
            <button
              id={`command-${option.id}`}
              key={option.id}
              type="button"
              role="option"
              aria-selected={activeIndex === index}
              className={`command-option ${activeIndex === index ? 'active' : ''}`}
              onMouseEnter={() => setActiveIndex(index)}
              onClick={() => { onChoose(option.id); onClose() }}
            >
              <span className="command-option-code">{option.id}</span>
              <span className="command-option-copy"><strong>{option.label}</strong><small>{option.description}</small></span>
              <span className="command-option-category">{option.category}</span>
            </button>
          )) : <p className="command-empty">No encontramos resultados. Prueba con otro término.</p>}
        </div>
        <footer className="command-footer" aria-label="Ayuda de teclado">
          <span><kbd><ArrowDown /></kbd><kbd><ArrowUp /></kbd> para moverte</span>
          <span><kbd><CornerDownLeft /></kbd> para abrir</span>
          <span><kbd>Esc</kbd> para cerrar</span>
        </footer>
      </section>
    </dialog>
  )
}
