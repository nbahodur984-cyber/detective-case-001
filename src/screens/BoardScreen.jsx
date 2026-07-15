import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import ScreenHeader from '../components/ScreenHeader.jsx'
import ScreenNav from '../components/ScreenNav.jsx'
import EvidenceIcon from '../components/EvidenceIcon.jsx'
import EvidenceModal from '../components/EvidenceModal.jsx'
import { useGame } from '../state/GameContext.jsx'
import { EVIDENCE, SUSPECTS } from '../state/caseData.js'
import './BoardScreen.css'

// Позиции карточек на доске (в % от размера доски). center-X, top-Y.
const EV_POS = {
  floorclock: { left: 10, top: 5, rot: -3 },
  wristwatch: { left: 34, top: 3, rot: 2 },
  call: { left: 58, top: 5, rot: -2 },
  weapon: { left: 83, top: 3, rot: 3 },
  rain: { left: 10, top: 31, rot: 2 },
  matchbook: { left: 34, top: 33, rot: -3 },
  contract: { left: 58, top: 31, rot: 2 },
  staging: { left: 83, top: 33, rot: -2 },
  hospital: { left: 10, top: 57, rot: -2 },
  atm: { left: 34, top: 59, rot: 3 },
  witness: { left: 58, top: 57, rot: -3 },
  nolock: { left: 83, top: 59, rot: 2 },
}
const SUS_POS = {
  lora: { left: 14, top: 84 },
  dan: { left: 38, top: 84 },
  inga: { left: 62, top: 84 },
  mark: { left: 86, top: 84 },
}

const pad2 = (n) => String(n).padStart(2, '0')

export default function BoardScreen() {
  const { state, openEvidence } = useGame()
  const [active, setActive] = useState(null) // раскрытая улика (модалка)

  const boardRef = useRef(null)
  const nodeRefs = useRef({})
  const [size, setSize] = useState({ w: 0, h: 0 })
  const [pts, setPts] = useState({}) // id -> {x,y} точка «булавки»

  const setNodeRef = (id) => (el) => {
    if (el) nodeRefs.current[id] = el
    else delete nodeRefs.current[id]
  }

  // Замер центров булавок относительно доски — для геометрии нитей.
  const measure = useCallback(() => {
    const board = boardRef.current
    if (!board) return
    const b = board.getBoundingClientRect()
    const next = {}
    for (const [id, el] of Object.entries(nodeRefs.current)) {
      const r = el.getBoundingClientRect()
      next[id] = { x: r.left - b.left + r.width / 2, y: r.top - b.top + 13 }
    }
    setSize({ w: b.width, h: b.height })
    setPts(next)
  }, [])

  useLayoutEffect(() => {
    measure()
  }, [measure])

  useEffect(() => {
    const ro = new ResizeObserver(measure)
    if (boardRef.current) ro.observe(boardRef.current)
    window.addEventListener('resize', measure)
    // Пере-замер после подгрузки веб-шрифтов (иначе булавки «съедут»).
    if (document.fonts?.ready) document.fonts.ready.then(measure)
    // И ещё раз — когда карточки «прикрепятся» (анимация входа завершится).
    const t = setTimeout(measure, 900)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
      clearTimeout(t)
    }
  }, [measure])

  const openCard = (ev) => {
    openEvidence(ev.id)
    setActive(ev)
  }

  const threadsForCard = (id) => state.threads.filter((t) => t.evidenceId === id).length
  const threadsForSuspect = (id) => state.threads.filter((t) => t.suspectId === id).length

  return (
    <div className="screen board-screen">
      <div className="board-screen__head">
        <ScreenHeader step={1} title="Доска улик">
          Нажмите на улику, чтобы рассмотреть её вблизи. Из крупного плана можно протянуть нить к
          подозреваемому — это ваша карта версий.
        </ScreenHeader>
        <div className="board-legend mono">
          <span>Раскрыто: {state.openedEvidence.length}/{EVIDENCE.length}</span>
          <span className="board-legend__sep">·</span>
          <span>Нитей: {state.threads.length}</span>
        </div>
      </div>

      <div className="board-wrap">
        <div className="board" ref={boardRef}>
          {/* Слой нитей поверх карточек, но клики пропускает насквозь */}
          <svg
            className="threads"
            width={size.w}
            height={size.h}
            viewBox={`0 0 ${size.w || 1} ${size.h || 1}`}
          >
            {state.threads.map((t, i) => {
              const a = pts[t.evidenceId]
              const b = pts[t.suspectId]
              if (!a || !b) return null
              const mx = (a.x + b.x) / 2
              const my = (a.y + b.y) / 2
              const dist = Math.hypot(b.x - a.x, b.y - a.y)
              const sag = Math.min(64, dist * 0.12) + 8
              const d = `M ${a.x} ${a.y} Q ${mx} ${my + sag} ${b.x} ${b.y}`
              return (
                <g key={`${t.evidenceId}-${t.suspectId}-${i}`} className="thread">
                  <path className="thread__line" d={d} />
                  <circle className="thread__knot" cx={a.x} cy={a.y} r="3.5" />
                  <circle className="thread__knot" cx={b.x} cy={b.y} r="3.5" />
                </g>
              )
            })}
          </svg>

          {/* Карточки улик */}
          {EVIDENCE.map((ev, i) => {
            const pos = EV_POS[ev.id]
            const opened = state.openedEvidence.includes(ev.id)
            const links = threadsForCard(ev.id)
            return (
              <button
                key={ev.id}
                ref={setNodeRef(ev.id)}
                className={'ev-card' + (opened ? ' is-opened' : '')}
                style={{
                  left: `${pos.left}%`,
                  top: `${pos.top}%`,
                  '--rot': `${pos.rot}deg`,
                  animationDelay: `${i * 0.04}s`,
                }}
                onClick={() => openCard(ev)}
              >
                <span className="ev-card__pin" />
                <span className="ev-card__no mono">№{pad2(i + 1)}</span>
                <span className="ev-card__icon">
                  <EvidenceIcon id={ev.id} />
                </span>
                <span className="ev-card__title">{ev.title}</span>
                {opened && <span className="ev-card__seen" aria-hidden="true">✓</span>}
                {links > 0 && <span className="ev-card__links">{links}</span>}
              </button>
            )
          })}

          {/* Узлы подозреваемых */}
          {SUSPECTS.map((s, si) => {
            const pos = SUS_POS[s.id]
            const links = threadsForSuspect(s.id)
            return (
              <div
                key={s.id}
                ref={setNodeRef(s.id)}
                className={'sus-node' + (links > 0 ? ' is-linked' : '')}
                style={{
                  left: `${pos.left}%`,
                  top: `${pos.top}%`,
                  animationDelay: `${0.5 + si * 0.08}s`,
                }}
              >
                <span className="sus-node__pin" />
                <span className="sus-node__photo">
                  {s.name.split(' ').map((w) => w[0]).join('')}
                </span>
                <span className="sus-node__name">{s.name}</span>
                {links > 0 && <span className="sus-node__links">{links}</span>}
              </div>
            )
          })}
        </div>
      </div>

      <div className="board-screen__foot">
        <ScreenNav />
      </div>

      {active && (
        <EvidenceModal
          evidence={active}
          exhibitNo={pad2(EVIDENCE.findIndex((e) => e.id === active.id) + 1)}
          onClose={() => setActive(null)}
        />
      )}
    </div>
  )
}
