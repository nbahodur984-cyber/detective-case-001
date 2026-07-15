import { useId } from 'react'
import './SuspectPortrait.css'

// Полицейское фото: стена с ростомером + силуэт анфас.
// Различаются причёской и плечами — узнаваемы даже в 56px.
const FIGURE = {
  // Наследница: волосы до плеч
  lora: (
    <>
      <path d="M19 31 C17 13 43 13 41 31 C41 24 38 20 30 20 C22 20 19 24 19 31 Z" />
      <path d="M18 29 L18 47 L22.5 47 L22.5 31 Z" />
      <path d="M42 29 L42 47 L37.5 47 L37.5 31 Z" />
      <ellipse cx="30" cy="31" rx="9.5" ry="11.5" />
      <rect x="27" y="40" width="6" height="7" />
      <path d="M13 74 C13 56 21 47 30 47 C39 47 47 56 47 74 Z" />
    </>
  ),
  // Подмастерье: короткая стрижка, узкие плечи
  dan: (
    <>
      <path d="M20 28 C20 15 40 15 40 28 C40 22 36.5 18.5 30 18.5 C23.5 18.5 20 22 20 28 Z" />
      <ellipse cx="30" cy="30" rx="9.5" ry="11.5" />
      <rect x="27" y="39" width="6" height="7" />
      <path d="M16 74 C16 57 22.5 46 30 46 C37.5 46 44 57 44 74 Z" />
    </>
  ),
  // Коллекционер: волосы собраны в пучок
  inga: (
    <>
      <circle cx="30" cy="11.5" r="5" />
      <path d="M20 29 C20 15 40 15 40 29 C40 22.5 36.5 19 30 19 C23.5 19 20 22.5 20 29 Z" />
      <ellipse cx="30" cy="31" rx="9.5" ry="11.5" />
      <rect x="27" y="40" width="6" height="7" />
      <path d="M14 74 C14 56.5 21.5 47 30 47 C38.5 47 46 56.5 46 74 Z" />
    </>
  ),
  // Компаньон: короткая стрижка с пробором, костюм с галстуком
  mark: (
    <>
      <path d="M20 27 C20 15 40 15 40 27 C40 20.5 36 17.5 30 17.5 C24.5 17.5 21 20.5 20 27 Z" />
      <ellipse cx="30" cy="30" rx="9.5" ry="11.5" />
      <rect x="27" y="39" width="6" height="7" />
      <path d="M12 74 C12 56 20.5 46 30 46 C39.5 46 48 56 48 74 Z" />
    </>
  ),

  // ── Дело №002 ──────────────────────────────────────────────────────────
  // Актёр: волосы зачёсаны назад, высокий воротник плаща
  yaroslav: (
    <>
      <path d="M20 28 C20 14 40 14 40 28 C40 21 36 17.5 30 17.5 C24 17.5 20.5 21 20 28 Z" />
      <path d="M39 17 L45 12 L44 20 Z" />
      <ellipse cx="30" cy="30" rx="9.5" ry="11.5" />
      <rect x="27" y="39" width="6" height="7" />
      <path d="M13 74 C13 56 21 46 30 46 C39 46 47 56 47 74 Z" />
      <path d="M22 47 L18 74 L14 74 C14 60 17 51 22 47 Z" />
      <path d="M38 47 L42 74 L46 74 C46 60 43 51 38 47 Z" />
    </>
  ),
  // Актриса: высокая причёска, открытые плечи
  vera: (
    <>
      <path d="M20 27 C20 8 40 8 40 27 C40 19 36 15 30 15 C24 15 20 19 20 27 Z" />
      <ellipse cx="30" cy="12" rx="8" ry="6" />
      <ellipse cx="30" cy="30" rx="9.5" ry="11.5" />
      <rect x="27" y="39" width="6" height="8" />
      <path d="M11 74 C11 57 20 47 30 47 C40 47 49 57 49 74 Z" />
    </>
  ),
  // Помреж: наушники с микрофоном
  grisha: (
    <>
      <path d="M21 27 C21 16 39 16 39 27 C39 21 35.5 18 30 18 C24.5 18 21 21 21 27 Z" />
      <ellipse cx="30" cy="30" rx="9.5" ry="11.5" />
      <path d="M17 30 C17 17 43 17 43 30" fill="none" stroke="#0b0908" strokeWidth="3" />
      <rect x="14" y="27" width="6" height="10" rx="2.5" />
      <rect x="40" y="27" width="6" height="10" rx="2.5" />
      <path d="M40 36 C40 42 35 44 32 44" fill="none" stroke="#0b0908" strokeWidth="2" />
      <circle cx="31" cy="44" r="1.8" />
      <rect x="27" y="39" width="6" height="7" />
      <path d="M15 74 C15 57 22 46 30 46 C38 46 45 57 45 74 Z" />
    </>
  ),
  // Осветитель: короткое каре, узкие плечи
  kim: (
    <>
      <path d="M19 30 C19 15 41 15 41 30 L41 38 L37.5 38 C39 30 36 21 30 21 C24 21 21 30 22.5 38 L19 38 Z" />
      <ellipse cx="30" cy="30" rx="9.5" ry="11.5" />
      <rect x="27" y="39" width="6" height="7" />
      <path d="M16 74 C16 57 22.5 46 30 46 C37.5 46 44 57 44 74 Z" />
    </>
  ),
}

// Вырез пиджака и галстук — только у компаньона
const COLLAR = {
  mark: (
    <>
      <path d="M30 46 L24 49 L30 58 L36 49 Z" className="portrait__cut" />
      <path d="M30 52 L27.5 57 L30 74 L32.5 57 Z" className="portrait__tie" />
    </>
  ),
}

export default function SuspectPortrait({ id, className = '' }) {
  const uid = useId()
  const wall = `wall-${uid}`
  const clip = `clip-${uid}`

  return (
    <svg
      className={'portrait ' + className}
      viewBox="0 0 60 74"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={wall} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3b352c" />
          <stop offset="100%" stopColor="#14110d" />
        </linearGradient>
        <clipPath id={clip}>
          <rect width="60" height="74" />
        </clipPath>
      </defs>

      <g clipPath={`url(#${clip})`}>
        <rect width="60" height="74" fill={`url(#${wall})`} />
        {/* ростомер на стене */}
        <g className="portrait__ruler">
          <line x1="0" y1="16" x2="60" y2="16" />
          <line x1="0" y1="30" x2="60" y2="30" />
          <line x1="0" y1="44" x2="60" y2="44" />
          <line x1="0" y1="58" x2="60" y2="58" />
        </g>
        <g className="portrait__figure">
          {FIGURE[id]}
          {COLLAR[id]}
        </g>
      </g>
    </svg>
  )
}
