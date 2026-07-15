import { useEffect, useRef, useState } from 'react'
import ScreenHeader from '../components/ScreenHeader.jsx'
import ScreenNav from '../components/ScreenNav.jsx'
import { useGame } from '../state/GameContext.jsx'
import './TimelineScreen.css'

export default function TimelineScreen() {
  const { state, setTimeline, caseData } = useGame()
  const TIMELINE = caseData.timeline
  const TIMELINE_SCRAMBLE = caseData.timelineScramble
  const TIMELINE_INSIGHT = caseData.timelineInsight
  const byId = Object.fromEntries(TIMELINE.map((e) => [e.id, e]))
  const CORRECT = TIMELINE.map((e) => e.id)

  const [order, setOrder] = useState(() => state.timelineOrder || TIMELINE_SCRAMBLE)
  const [feedback, setFeedback] = useState(
    state.timelineSolved ? { status: 'solved' } : { status: 'idle' },
  )
  const dragIndex = useRef(null)
  const [overIndex, setOverIndex] = useState(null)

  const solved = feedback.status === 'solved'

  // Держим контекст в синхроне с локальным порядком.
  useEffect(() => {
    setTimeline(order, solved)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order, solved])

  const move = (from, to) => {
    if (solved || to < 0 || to >= order.length || from === to) return
    const next = order.slice()
    const [item] = next.splice(from, 1)
    next.splice(to, 0, item)
    setOrder(next)
    setFeedback({ status: 'idle' })
  }

  const check = () => {
    const firstWrong = order.findIndex((id, i) => id !== CORRECT[i])
    if (firstWrong === -1) {
      setFeedback({ status: 'solved' })
    } else {
      setFeedback({
        status: 'wrong',
        wrongIndex: firstWrong,
        hint: byId[order[firstWrong]].hint,
      })
    }
  }

  const reshuffle = () => {
    setOrder(TIMELINE_SCRAMBLE)
    setFeedback({ status: 'idle' })
  }

  // ── Drag & drop ────────────────────────────────────────────────────────
  const onDragStart = (i) => (e) => {
    if (solved) return
    dragIndex.current = i
    e.dataTransfer.effectAllowed = 'move'
  }
  const onDragOver = (i) => (e) => {
    if (solved) return
    e.preventDefault()
    if (overIndex !== i) setOverIndex(i)
  }
  const onDrop = (i) => (e) => {
    e.preventDefault()
    if (dragIndex.current !== null) move(dragIndex.current, i)
    dragIndex.current = null
    setOverIndex(null)
  }
  const onDragEnd = () => {
    dragIndex.current = null
    setOverIndex(null)
  }

  return (
    <div className="screen">
      <div className="screen__inner">
        <ScreenHeader step={4} title="Хронология">
          Восстановите порядок событий той ночи. Время скрыто — опирайтесь на логику. Неверный
          порядок подскажет: «не сходится по времени».
        </ScreenHeader>

        <ol className="tl">
          {order.map((id, i) => {
            const ev = byId[id]
            const isWrong = feedback.status === 'wrong' && feedback.wrongIndex === i
            return (
              <li
                key={id}
                className={
                  'tl-item' +
                  (overIndex === i ? ' is-over' : '') +
                  (isWrong ? ' is-wrong' : '') +
                  (solved ? ' is-solved' : '')
                }
                draggable={!solved}
                onDragStart={onDragStart(i)}
                onDragOver={onDragOver(i)}
                onDrop={onDrop(i)}
                onDragEnd={onDragEnd}
              >
                <span className="tl-item__handle" aria-hidden="true">
                  ⠿
                </span>
                <span className="tl-item__num mono">{i + 1}</span>
                <span className="tl-item__time mono">{solved ? ev.time : '??:??'}</span>
                <span className="tl-item__text">{ev.card}</span>
                <span className="tl-item__moves">
                  <button
                    className="tl-move"
                    onClick={() => move(i, i - 1)}
                    disabled={solved || i === 0}
                    aria-label="Выше"
                  >
                    ↑
                  </button>
                  <button
                    className="tl-move"
                    onClick={() => move(i, i + 1)}
                    disabled={solved || i === order.length - 1}
                    aria-label="Ниже"
                  >
                    ↓
                  </button>
                </span>
              </li>
            )
          })}
        </ol>

        {/* Обратная связь */}
        {feedback.status === 'wrong' && (
          <div className="tl-feedback is-wrong">
            <strong>Не сходится по времени.</strong> {feedback.hint}
          </div>
        )}
        {solved && (
          <div className="tl-feedback is-solved">
            <strong>Последовательность восстановлена.</strong>
            <p className="tl-insight">{TIMELINE_INSIGHT}</p>
          </div>
        )}

        <div className="tl-actions">
          {!solved ? (
            <button className="btn btn--accent" onClick={check}>
              Проверить порядок
            </button>
          ) : (
            <span className="tl-actions__ok mono">✓ Верно</span>
          )}
          <button className="btn btn--ghost" onClick={reshuffle}>
            Перемешать заново
          </button>
        </div>

        <ScreenNav />
      </div>
    </div>
  )
}
