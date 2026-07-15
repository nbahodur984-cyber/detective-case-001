import { Link } from 'react-router-dom'
import { useGame } from '../state/GameContext.jsx'
import './SplashScreen.css'

export default function SplashScreen() {
  const { next, reset, state, caseData: CASE_META } = useGame()
  const hasProgress = state.visited.length > 1 || state.openedEvidence.length > 0

  return (
    <div className="screen splash">
      {/* Сцена с перспективой: крышка папки откидывается, открывая дело */}
      <div className="splash__stage">
        <div className="splash__folder">
          <div className="splash__stamp">Строго конфиденциально</div>

          <p className="splash__number type">{CASE_META.number}</p>
          <h1 className="splash__title">«{CASE_META.title}»</h1>
          <p className="splash__tagline">{CASE_META.tagline}</p>

          <div className="splash__meta">
            <div>
              <span className="splash__k">Жертва</span>
              <span className="splash__v">
                {CASE_META.victim.name}, {CASE_META.victim.age}
              </span>
            </div>
            <div>
              <span className="splash__k">Должность</span>
              <span className="splash__v">{CASE_META.victim.role}</span>
            </div>
            <div>
              <span className="splash__k">Причина смерти</span>
              <span className="splash__v">{CASE_META.victim.cause}</span>
            </div>
          </div>

          <div className="splash__actions">
            <button className="btn btn--accent" onClick={next}>
              Открыть дело →
            </button>
            {hasProgress && (
              <button className="btn btn--ghost" onClick={reset}>
                Начать заново
              </button>
            )}
          </div>
        </div>

        {/* Крышка папки — откидывается на петле сверху */}
        <div className="splash__cover" aria-hidden="true">
          <span className="splash__cover-no type">{CASE_META.number}</span>
          <span className="splash__cover-line" />
        </div>
      </div>

      <p className="splash__hint">
        Улики честны: они логически ведут к одному виновному. Не угадывайте — исключайте.
      </p>
      <Link className="splash__back" to="/cases">
        ← Ко всем делам
      </Link>
    </div>
  )
}
