// Монохромные штриховые иконки-«экспонаты» для карточек улик.
// Наследуют цвет через currentColor — вписываются в нуар-палитру.
const PATHS = {
  clock: (
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 7.5v4.5l3 2" />
    </>
  ),
  phone: (
    <path d="M6.5 4.5c0 8 5 13 13 13l-.5-3.5-4 .3-5-5 .3-4z" />
  ),
  drop: <path d="M12 3.5s6 6.7 6 10.5a6 6 0 0 1-12 0c0-3.8 6-10.5 6-10.5z" />,
  weight: (
    <>
      <circle cx="12" cy="6" r="2" />
      <path d="M9 8.5h6l1.7 11H7.3z" />
    </>
  ),
  match: (
    <>
      <path d="M8 20l7.5-13" />
      <circle cx="16.5" cy="5.5" r="2.6" />
    </>
  ),
  doc: (
    <>
      <path d="M7 3.5h6.5L18 8v12.5H7z" />
      <path d="M9.5 12h6M9.5 15.5h6M9.5 8.5h3" />
    </>
  ),
  cross: <path d="M10 4h4v6h6v4h-6v6h-4v-6H4v-4h6z" />,
  card: (
    <>
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <path d="M3 10h18" />
    </>
  ),
  eye: (
    <>
      <path d="M2.5 12S6.5 6 12 6s9.5 6 9.5 6-4 6-9.5 6S2.5 12 2.5 12z" />
      <circle cx="12" cy="12" r="2.6" />
    </>
  ),
  lock: (
    <>
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </>
  ),
}

const ICON_BY_ID = {
  floorclock: 'clock',
  wristwatch: 'clock',
  staging: 'clock',
  call: 'phone',
  rain: 'drop',
  weapon: 'weight',
  matchbook: 'match',
  contract: 'doc',
  hospital: 'cross',
  atm: 'card',
  witness: 'eye',
  nolock: 'lock',
}

export default function EvidenceIcon({ id, size = 26 }) {
  const key = ICON_BY_ID[id] || 'doc'
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {PATHS[key]}
    </svg>
  )
}
