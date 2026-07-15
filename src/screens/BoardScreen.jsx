import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import ScreenHeader from '../components/ScreenHeader.jsx'
import ScreenNav from '../components/ScreenNav.jsx'
import EvidenceIcon from '../components/EvidenceIcon.jsx'
import EvidenceModal from '../components/EvidenceModal.jsx'
import SuspectPortrait from '../components/SuspectPortrait.jsx'
import { useGame } from '../state/GameContext.jsx'
import './BoardScreen.css'

// ── Холст-макет доски ─────────────────────────────────────────────────────
// Всё внутри задано в этих координатах и целиком масштабируется под экран.
// Благодаря этому композиция не «плывёт», а геометрия нитей считается
// аналитически из раскладки дела — без единого замера DOM.
const BOARD_W = 1040
const BOARD_H = 640

// Чем крепится улика: булавка или скотч
const TAPED = new Set(['note', 'receipt'])
const ICON_SIZE = { photo: 30, doc: 22, note: 20, torn: 22, receipt: 20 }

const pad2 = (n) => String(n).padStart(2, '0')

export default function BoardScreen() {
  const { state, openEvidence, caseData } = useGame()
  const EVIDENCE = caseData.evidence
  const SUSPECTS = caseData.suspects
  const EV_POS = caseData.board.evidence
  const SUS_POS = caseData.board.suspects
  const [active, setActive] = useState(null)

  // Точка крепления нити — прямо из раскладки, без getBoundingClientRect.
  // Булавка сидит на top:-9px при размере 15px → её центр на 1.5px ВЫШЕ верха
  // карточки. Скотч (top:-8px, высота 16) центрируется ровно по верху.
  const kindById = Object.fromEntries(EVIDENCE.map((e) => [e.id, e.kind]))
  const pinOf = (id) => {
    const e = EV_POS[id]
    if (e) return { x: e.x, y: e.y + (TAPED.has(kindById[id]) ? 0 : -1.5) }
    const s = SUS_POS[id]
    if (s) return { x: s.x, y: s.y - 1.5 }
    return null
  }
  const wrapRef = useRef(null)
  const [scale, setScale] = useState(1)

  // Вписываем холст в доступное место: доска всегда видна целиком.
  const fit = useCallback(() => {
    const wrap = wrapRef.current
    if (!wrap) return
    const availW = wrap.clientWidth - 24 // минус рамка сцены (12px с каждой стороны)
    const availH = window.innerHeight - 240 // запас на шапку, легенду и подвал
    const s = Math.min(availW / BOARD_W, availH / BOARD_H)
    setScale(Math.max(0.45, Math.min(1, s)))
  }, [])

  useLayoutEffect(() => {
    fit()
  }, [fit])

  useEffect(() => {
    const ro = new ResizeObserver(fit)
    if (wrapRef.current) ro.observe(wrapRef.current)
    window.addEventListener('resize', fit)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', fit)
    }
  }, [fit])

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
          <span>
            Раскрыто: {state.openedEvidence.length}/{EVIDENCE.length}
          </span>
          <span className="board-legend__sep">·</span>
          <span>Нитей: {state.threads.length}</span>
        </div>
      </div>

      <div className="board-wrap" ref={wrapRef}>
        {/* Сцена держит место под отмасштабированный холст */}
        <div
          className="board-stage"
          style={{ width: BOARD_W * scale, height: BOARD_H * scale }}
        >
          <div className="board" style={{ '--scale': scale }}>
            {/* Нити — поверх карточек, клики пропускают насквозь */}
            <svg
              className="threads"
              viewBox={`0 0 ${BOARD_W} ${BOARD_H}`}
              preserveAspectRatio="none"
            >
              {state.threads.map((t, i) => {
                const a = pinOf(t.evidenceId)
                const b = pinOf(t.suspectId)
                if (!a || !b) return null
                const mx = (a.x + b.x) / 2
                const my = (a.y + b.y) / 2
                const dist = Math.hypot(b.x - a.x, b.y - a.y)
                const sag = Math.min(64, dist * 0.12) + 8
                const d = `M ${a.x} ${a.y} Q ${mx} ${my + sag} ${b.x} ${b.y}`
                return (
                  <g key={`${t.evidenceId}-${t.suspectId}-${i}`} className="thread">
                    <path className="thread__line" d={d} />
                    <circle className="thread__knot" cx={a.x} cy={a.y} r="4" />
                    <circle className="thread__knot" cx={b.x} cy={b.y} r="4" />
                  </g>
                )
              })}
            </svg>

            {/* Улики */}
            {EVIDENCE.map((ev, i) => {
              const pos = EV_POS[ev.id]
              const opened = state.openedEvidence.includes(ev.id)
              const links = threadsForCard(ev.id)
              return (
                <button
                  key={ev.id}
                  className={
                    `ev-card ev-card--${ev.kind}` + (opened ? ' is-opened' : '')
                  }
                  style={{
                    left: `${pos.x}px`,
                    top: `${pos.y}px`,
                    '--rot': `${pos.rot}deg`,
                    animationDelay: `${i * 0.04}s`,
                  }}
                  onClick={() => openCard(ev)}
                >
                  {TAPED.has(ev.kind) ? (
                    <span className="ev-card__tape" />
                  ) : (
                    <span className="ev-card__pin" />
                  )}
                  <span className="ev-card__no mono">№{pad2(i + 1)}</span>
                  <span className="ev-card__frame">
                    <EvidenceIcon id={ev.id} size={ICON_SIZE[ev.kind]} />
                  </span>
                  <span className="ev-card__title">{ev.title}</span>
                  {opened && (
                    <span className="ev-card__seen" aria-hidden="true">
                      ✓
                    </span>
                  )}
                  {links > 0 && <span className="ev-card__links">{links}</span>}
                </button>
              )
            })}

            {/* Подозреваемые */}
            {SUSPECTS.map((s, si) => {
              const pos = SUS_POS[s.id]
              const links = threadsForSuspect(s.id)
              return (
                <div
                  key={s.id}
                  className={'sus-node' + (links > 0 ? ' is-linked' : '')}
                  style={{
                    left: `${pos.x}px`,
                    top: `${pos.y}px`,
                    animationDelay: `${0.5 + si * 0.08}s`,
                  }}
                >
                  <span className="sus-node__pin" />
                  <span className="sus-node__photo">
                    <SuspectPortrait id={s.id} />
                  </span>
                  <span className="sus-node__name">{s.name}</span>
                  {links > 0 && <span className="sus-node__links">{links}</span>}
                </div>
              )
            })}
          </div>
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
