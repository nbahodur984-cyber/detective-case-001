import { useState } from 'react'
import ScreenHeader from '../components/ScreenHeader.jsx'
import ScreenNav from '../components/ScreenNav.jsx'
import SuspectPortrait from '../components/SuspectPortrait.jsx'
import { useGame } from '../state/GameContext.jsx'
import './InterrogationScreen.css'

const VERDICT = {
  confirm: { cls: 'is-confirm', label: 'Подтверждается уликой' },
  contradict: { cls: 'is-contradict', label: 'Противоречит улике' },
  motive: { cls: 'is-motive', label: 'Раскрывает мотив' },
}

// Плашка сверки показания с уликой.
function VerdictTag({ verdict, evidenceId, note, opened, evNo, evTitle }) {
  const v = VERDICT[verdict]
  if (!v) return null
  return (
    <div className={'vtag ' + v.cls}>
      <span className="vtag__label">{v.label}</span>
      {evidenceId && (
        <span className="vtag__ev mono">
          Улика №{evNo(evidenceId)}: {evTitle(evidenceId)}
          {!opened && <span className="vtag__unseen"> · не изучена на доске</span>}
        </span>
      )}
      {note && <p className="vtag__note">{note}</p>}
    </div>
  )
}

export default function InterrogationScreen() {
  const { state, seeReply, caseData } = useGame()
  const SUSPECTS = caseData.suspects
  const DIALOGUE = caseData.dialogue
  const EVIDENCE = caseData.evidence

  const evNo = (id) => {
    const i = EVIDENCE.findIndex((e) => e.id === id)
    return i < 0 ? '' : String(i + 1).padStart(2, '0')
  }
  const evTitle = (id) => EVIDENCE.find((e) => e.id === id)?.title || ''

  const [activeId, setActiveId] = useState(SUSPECTS[0].id)

  const suspect = SUSPECTS.find((s) => s.id === activeId)
  const script = DIALOGUE[activeId]
  const asked = state.dialogue[activeId] || []

  const askedSet = new Set(asked)
  const transcript = asked
    .map((qid) => script.questions.find((q) => q.id === qid))
    .filter(Boolean)
  const remaining = script.questions.filter((q) => !askedSet.has(q.id))

  return (
    <div className="screen">
      <div className="screen__inner">
        <ScreenHeader step={3} title="Допрос">
          Выбирайте вопросы. Ответы либо подтверждаются уликами, либо противоречат им —
          противоречие подсвечивается. Три алиби окажутся честными, одно — нет.
        </ScreenHeader>

        {/* Вкладки подозреваемых */}
        <div className="itabs">
          {SUSPECTS.map((s) => {
            const count = (state.dialogue[s.id] || []).length
            const total = DIALOGUE[s.id].questions.length
            return (
              <button
                key={s.id}
                className={'itab' + (s.id === activeId ? ' is-active' : '')}
                onClick={() => setActiveId(s.id)}
              >
                <span className="itab__photo">
                  <SuspectPortrait id={s.id} />
                </span>
                <span className="itab__name">{s.name}</span>
                <span className="itab__count mono">
                  {count}/{total}
                </span>
              </button>
            )
          })}
        </div>

        {/* Комната допроса */}
        <div className="iroom">
          <div className="iroom__head">
            <div className="iroom__photo">
              <SuspectPortrait id={suspect.id} />
            </div>
            <div>
              <h2 className="iroom__name">{suspect.name}</h2>
              <p className="iroom__role">{suspect.role}</p>
              <p className="iroom__alibi">
                <span className="mono">Алиби:</span> {suspect.alibi}
              </p>
            </div>
          </div>

          <p className="iroom__intro type">{script.intro}</p>

          {/* Транскрипт */}
          <div className="itranscript">
            {transcript.length === 0 && (
              <p className="itranscript__empty">Задайте первый вопрос.</p>
            )}
            {transcript.map((qa) => (
              <div className="qa" key={qa.id}>
                <p className="qa__q">— {qa.q}</p>
                <div className="qa__a">
                  <p className="qa__a-text type">{qa.a}</p>
                  <VerdictTag
                    verdict={qa.verdict}
                    evidenceId={qa.evidenceId}
                    note={qa.note}
                    opened={qa.evidenceId ? state.openedEvidence.includes(qa.evidenceId) : false}
                    evNo={evNo}
                    evTitle={evTitle}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Доступные вопросы */}
          {remaining.length > 0 ? (
            <div className="iasks">
              <span className="iasks__label mono">Спросить:</span>
              {remaining.map((q) => (
                <button key={q.id} className="btn ask-btn" onClick={() => seeReply(activeId, q.id)}>
                  {q.q}
                </button>
              ))}
            </div>
          ) : (
            <p className="iasks__done mono">Все вопросы заданы.</p>
          )}
        </div>

        <ScreenNav />
      </div>
    </div>
  )
}
