import { useId } from 'react'
import './DeskScene.css'

// Стол детектива, вид сверху. Всё нарисовано вектором — никаких внешних
// картинок. Единственный цвет — янтарный свет лампы из правого верхнего угла.
export default function DeskScene() {
  const uid = useId()
  const wood = `wood-${uid}`
  const glow = `glow-${uid}`
  const vig = `vig-${uid}`
  const clip = `clip-${uid}`

  return (
    <svg
      className="desk"
      viewBox="0 0 900 340"
      role="img"
      aria-label="Стол детектива: раскрытая папка с делом, фотография, лупа и лампа"
    >
      <defs>
        <linearGradient id={wood} x1="0" y1="0" x2="0.7" y2="1">
          <stop offset="0%" stopColor="#2c2118" />
          <stop offset="100%" stopColor="#13100c" />
        </linearGradient>
        <radialGradient id={glow} cx="0.8" cy="0.06" r="0.85">
          <stop offset="0%" stopColor="rgba(224,161,58,0.34)" />
          <stop offset="55%" stopColor="rgba(224,161,58,0.07)" />
          <stop offset="100%" stopColor="rgba(224,161,58,0)" />
        </radialGradient>
        <radialGradient id={vig} cx="0.5" cy="0.45" r="0.78">
          <stop offset="55%" stopColor="rgba(0,0,0,0)" />
          <stop offset="100%" stopColor="rgba(0,0,0,0.6)" />
        </radialGradient>
        <clipPath id={clip}>
          <rect width="900" height="340" rx="6" />
        </clipPath>
      </defs>

      <g clipPath={`url(#${clip})`}>
        {/* Столешница */}
        <rect width="900" height="340" fill={`url(#${wood})`} />
        <g className="desk__grain">
          <path d="M0 46h900M0 122h900M0 198h900M0 274h900" />
          <path d="M0 84h900M0 160h900M0 236h900M0 312h900" />
        </g>

        {/* Свет лампы */}
        <rect width="900" height="340" fill={`url(#${glow})`} />

        {/* ── Кофе и след от чашки ─────────────────────────────────── */}
        <circle className="desk__stain" cx="176" cy="268" r="27" />
        <g className="desk__cup">
          <circle cx="82" cy="74" r="33" className="desk__cup-body" />
          <circle cx="82" cy="74" r="25" className="desk__cup-coffee" />
          <path d="M116 66a15 15 0 0 1 0 26" className="desk__cup-handle" />
        </g>

        {/* ── Раскрытая папка с делом ──────────────────────────────── */}
        <g transform="rotate(-2.5 415 175)">
          <rect x="232" y="72" width="366" height="200" rx="5" className="desk__folder" />
          {/* левый лист */}
          <rect x="244" y="84" width="168" height="176" rx="2" className="desk__paper" />
          <g className="desk__lines">
            <path d="M258 106h96M258 122h140M258 138h140M258 154h118M258 170h140M258 186h84" />
          </g>
          {/* правый лист */}
          <rect x="420" y="84" width="166" height="176" rx="2" className="desk__paper desk__paper--2" />
          <g className="desk__lines">
            <path d="M434 106h72" />
            <path d="M434 128h138M434 144h138M434 160h104M434 176h138M434 192h126M434 208h62" />
          </g>
          {/* печать на правом листе */}
          <g className="desk__stamp" transform="rotate(-9 540 108)">
            <rect x="498" y="94" width="84" height="26" rx="3" />
          </g>
        </g>

        {/* ── Фотография-полароид ──────────────────────────────────── */}
        <g transform="rotate(7 712 128)">
          <rect x="648" y="52" width="128" height="152" rx="2" className="desk__polaroid" />
          <rect x="658" y="62" width="108" height="104" className="desk__photo" />
          {/* силуэт в кадре */}
          <g className="desk__figure">
            <circle cx="712" cy="106" r="15" />
            <path d="M686 166c0-18 12-31 26-31s26 13 26 31z" />
          </g>
          <g className="desk__lines">
            <path d="M668 184h68" />
          </g>
        </g>

        {/* Нить от фото к папке */}
        <path className="desk__thread" d="M660 196 Q 600 250 505 244" />
        <circle className="desk__knot" cx="660" cy="196" r="4" />
        <circle className="desk__knot" cx="505" cy="244" r="4" />

        {/* ── Лупа ─────────────────────────────────────────────────── */}
        <g transform="rotate(-24 118 214)">
          <line x1="146" y1="248" x2="196" y2="292" className="desk__lens-handle" />
          <circle cx="118" cy="214" r="45" className="desk__lens-glass" />
          <circle cx="118" cy="214" r="45" className="desk__lens-rim" />
          <path d="M92 190a34 34 0 0 1 22-14" className="desk__lens-shine" />
        </g>

        {/* ── Ручка ────────────────────────────────────────────────── */}
        <g transform="rotate(-16 740 286)">
          <rect x="662" y="280" width="140" height="10" rx="5" className="desk__pen" />
          <path d="M802 280l18 5-18 5z" className="desk__pen-tip" />
        </g>

        {/* ── Пара обрывков ────────────────────────────────────────── */}
        <g transform="rotate(11 848 176)">
          <rect x="812" y="146" width="72" height="60" rx="2" className="desk__paper" />
          <g className="desk__lines">
            <path d="M822 164h50M822 178h50M822 192h32" />
          </g>
        </g>

        {/* Виньетка */}
        <rect width="900" height="340" fill={`url(#${vig})`} />
      </g>
    </svg>
  )
}
