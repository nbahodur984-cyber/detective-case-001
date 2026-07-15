import { useState } from 'react'
import ScreenHeader from '../components/ScreenHeader.jsx'
import ScreenNav from '../components/ScreenNav.jsx'
import SuspectPortrait from '../components/SuspectPortrait.jsx'
import { useGame } from '../state/GameContext.jsx'
import './AccusationScreen.css'

const pad2 = (n) => String(n).padStart(2, '0')

export default function AccusationScreen() {
  const { state, setAccusation, setVerdict, next, caseData } = useGame()
  const { suspects: SUSPECTS, evidence: EVIDENCE, motives: MOTIVES, solution: SOLUTION } = caseData
  const [pick, setPick] = useState({
    suspectId: state.accusation.suspectId,
    motiveId: state.accusation.motiveId,
    evidenceId: state.accusation.evidenceId,
  })

  const complete = pick.suspectId && pick.motiveId && pick.evidenceId
  const suspect = SUSPECTS.find((s) => s.id === pick.suspectId)
  const motive = MOTIVES.find((m) => m.id === pick.motiveId)
  const evidence = EVIDENCE.find((e) => e.id === pick.evidenceId)

  const submit = () => {
    if (!complete) return
    const okS = pick.suspectId === SOLUTION.culpritId
    const okM = pick.motiveId === SOLUTION.motiveId
    const okE = pick.evidenceId === SOLUTION.keyEvidenceId || pick.evidenceId === SOLUTION.altEvidenceId
    setAccusation(pick)
    setVerdict(okS && okM && okE ? 'correct' : 'wrong')
    next()
  }

  return (
    <div className="screen">
      <div className="screen__inner">
        <ScreenHeader step={5} title="Обвинение">
          Соберите обвинение из трёх частей. Не угадывайте — опирайтесь на улики, показания и
          хронологию.
        </ScreenHeader>

        <div className="warrant">
          {/* 1. Подозреваемый */}
          <section className="warrant__sec">
            <h2 className="warrant__h mono">1 · Кого вы обвиняете</h2>
            <div className="pick-suspects">
              {SUSPECTS.map((s) => (
                <button
                  key={s.id}
                  className={'pick-sus' + (pick.suspectId === s.id ? ' is-picked' : '')}
                  onClick={() => setPick((p) => ({ ...p, suspectId: s.id }))}
                >
                  <span className="pick-sus__photo">
                    <SuspectPortrait id={s.id} />
                  </span>
                  <span className="pick-sus__name">{s.name}</span>
                  <span className="pick-sus__role">{s.role}</span>
                </button>
              ))}
            </div>
          </section>

          {/* 2. Мотив */}
          <section className="warrant__sec">
            <h2 className="warrant__h mono">2 · Мотив</h2>
            <div className="pick-list">
              {MOTIVES.map((m) => (
                <button
                  key={m.id}
                  className={'pick-chip' + (pick.motiveId === m.id ? ' is-picked' : '')}
                  onClick={() => setPick((p) => ({ ...p, motiveId: m.id }))}
                >
                  {m.text}
                </button>
              ))}
            </div>
          </section>

          {/* 3. Улика-доказательство */}
          <section className="warrant__sec">
            <h2 className="warrant__h mono">3 · Улика-доказательство</h2>
            <div className="pick-evidence">
              {EVIDENCE.map((e, i) => (
                <button
                  key={e.id}
                  className={'pick-ev' + (pick.evidenceId === e.id ? ' is-picked' : '')}
                  onClick={() => setPick((p) => ({ ...p, evidenceId: e.id }))}
                >
                  <span className="pick-ev__no mono">№{pad2(i + 1)}</span>
                  <span className="pick-ev__title">{e.title}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Живое обвинение */}
          <div className="warrant__statement type">
            В убийстве Аркадия Вейна я обвиняю: <mark>{suspect ? suspect.name : '…'}</mark>.
            Мотив — <mark>{motive ? motive.text : '…'}</mark>. Доказательство —{' '}
            <mark>{evidence ? evidence.title : '…'}</mark>.
          </div>
        </div>

        <div className="warrant__actions">
          <button className="btn btn--accent warrant__submit" disabled={!complete} onClick={submit}>
            Предъявить обвинение
          </button>
          {!complete && (
            <span className="warrant__need mono">Выберите все три пункта</span>
          )}
        </div>

        <ScreenNav hideNext />
      </div>
    </div>
  )
}
