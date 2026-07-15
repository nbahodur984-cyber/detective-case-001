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

  // ── Дело №002 ─────────────────────────────────────────────────────────
  sound: (
    <>
      <path d="M4 10v4M8 6.5v11" />
      <path d="M12 8.5a5 5 0 0 1 0 7M15.5 5.5a9.5 9.5 0 0 1 0 13" />
    </>
  ),
  bolt: <path d="M13 2.5 5 13.5h5.5L9.5 21.5l8.5-11h-5.5z" />,
  mask: (
    <>
      <path d="M3.5 6.5c5-2 12-2 17 0 0 6.5-2.5 12-8.5 14.5-6-2.5-8.5-8-8.5-14.5z" />
      <path d="M8.5 11.5h1.5M14 11.5h1.5" />
    </>
  ),
  film: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 9.5h18M3 14.5h18M7.5 5v14M16.5 5v14" />
    </>
  ),
  bulb: (
    <>
      <path d="M12 3a6 6 0 0 0-3.6 10.8c.6.5 1 1.2 1.1 2h5c.1-.8.5-1.5 1.1-2A6 6 0 0 0 12 3z" />
      <path d="M9.5 18.5h5M10.5 21.5h3" />
    </>
  ),
  slider: (
    <>
      <path d="M6 3.5v17M12 3.5v17M18 3.5v17" />
      <rect x="3.5" y="7" width="5" height="3.2" rx="1.2" />
      <rect x="9.5" y="13" width="5" height="3.2" rx="1.2" />
      <rect x="15.5" y="5" width="5" height="3.2" rx="1.2" />
    </>
  ),
  dress: (
    <>
      <path d="M12 3.5a2 2 0 0 0-.6 3.9v1.4" />
      <path d="M12 8.8 3.5 17.5a1 1 0 0 0 .7 1.7h15.6a1 1 0 0 0 .7-1.7z" />
    </>
  ),
  headset: (
    <>
      <path d="M4.5 15v-3.2a7.5 7.5 0 0 1 15 0V15" />
      <rect x="2.5" y="13" width="4.5" height="6.5" rx="2.2" />
      <rect x="17" y="13" width="4.5" height="6.5" rx="2.2" />
      <path d="M17 19.5c0 1.4-2.1 2.3-4.5 2.3" />
    </>
  ),
  scissors: (
    <>
      <circle cx="6" cy="18" r="2.6" />
      <circle cx="6" cy="6" r="2.6" />
      <path d="M8.3 16.6 19.5 4.5M8.3 7.4 19.5 19.5M8.6 8.6 12 12" />
    </>
  ),
  folder: (
    <>
      <path d="M3 7.5a2 2 0 0 1 2-2h3.8l2 2.6H19a2 2 0 0 1 2 2v6.4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <path d="M3 11.5h18" />
    </>
  ),
}

const ICON_BY_ID = {
  // Дело №001
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

  // Дело №002
  cry: 'sound',
  cuesheet: 'bolt',
  mask: 'mask',
  record: 'film',
  lightsok: 'bulb',
  console: 'slider',
  consolelog: 'doc',
  dress: 'dress',
  intercom: 'headset',
  gel: 'scissors',
  oldfile: 'folder',
  role: 'doc',
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
