import ScreenHeader from '../components/ScreenHeader.jsx'
import { useGame } from '../state/GameContext.jsx'
import { EVIDENCE, MOTIVES, SOLUTION, SUSPECTS } from '../state/caseData.js'
import './SolutionScreen.css'

const susById = Object.fromEntries(SUSPECTS.map((s) => [s.id, s]))
const evById = Object.fromEntries(EVIDENCE.map((e) => [e.id, e]))
const motiveById = Object.fromEntries(MOTIVES.map((m) => [m.id, m]))
const initials = (name) => name.split(' ').map((w) => w[0]).join('')

function Row({ label, value }) {
  return (
    <div className="cmp-row">
      <span className="cmp-row__label mono">{label}</span>
      <span className="cmp-row__your is-ok">✓ {value}</span>
    </div>
  )
}

export default function SolutionScreen() {
  const { state, reset, goTo } = useGame()
  const culprit = susById[SOLUTION.culpritId]
  const acc = state.accusation
  const made = !!(acc.suspectId || acc.motiveId || acc.evidenceId)
  const solved = state.verdict === 'correct'

  const restart = () => {
    reset()
    goTo('splash')
  }

  // ── Разгадка закрыта: обвинение неверно или ещё не предъявлено ──────────
  // Правильный ответ не раскрываем — игрок доводит расследование сам.
  if (!solved) {
    return (
      <div className="screen">
        <div className="screen__inner solution">
          <ScreenHeader step={6} title="Разгадка" />
          <div className="locked">
            <span className="locked__label mono">
              {made ? 'Обвинение отклонено' : 'Дело не раскрыто'}
            </span>
            <h2 className="locked__title">
              {made ? 'Обвинение не подтвердилось.' : 'Дело ещё не раскрыто.'}
            </h2>
            <p className="locked__text">
              {made
                ? 'Что-то в вашей версии не сходится. Разгадка откроется только тогда, когда ' +
                  'обвинение будет верным. Вернитесь к уликам, показаниям и хронологии — и ' +
                  'предъявите обвинение снова.'
                : 'Сначала соберите обвинение: подозреваемый, мотив и улика-доказательство. ' +
                  'Разгадка откроется, когда версия сойдётся.'}
            </p>
            <div className="locked__actions">
              <button className="btn btn--accent" onClick={() => goTo('accusation')}>
                {made ? 'Предъявить заново' : 'К обвинению'}
              </button>
              <button className="btn btn--ghost" onClick={() => goTo('board')}>
                Вернуться к уликам
              </button>
            </div>
            <button className="locked__restart" onClick={restart}>
              Начать дело заново
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── Разгадка открыта: обвинение верно ──────────────────────────────────
  return (
    <div className="screen">
      <div className="screen__inner solution">
        <ScreenHeader step={6} title="Разгадка" />

        <div className="verdict is-correct">
          <h2 className="verdict__title">Дело раскрыто.</h2>
          <p className="verdict__sub">
            Вы верно назвали виновного, мотив и решающую улику. Чистая работа.
          </p>
        </div>

        {/* Подтверждение выбора игрока */}
        <div className="cmp">
          <Row label="Подозреваемый" value={susById[acc.suspectId]?.name || culprit.name} />
          <Row label="Мотив" value={motiveById[SOLUTION.motiveId].text} />
          <Row label="Улика" value={evById[acc.evidenceId]?.title} />
        </div>

        {/* Виновный */}
        <div className="guilty">
          <div className="guilty__photo">{initials(culprit.name)}</div>
          <div>
            <span className="guilty__tag mono">Виновен</span>
            <h3 className="guilty__name">{culprit.name}</h3>
            <p className="guilty__role">{culprit.role}</p>
            <p className="guilty__line">{SOLUTION.summary}</p>
          </div>
        </div>

        {/* Что произошло */}
        <section className="sol-sec">
          <h3 className="sol-sec__h">Что произошло на самом деле</h3>
          {SOLUTION.how.map((p, i) => (
            <p className="sol-sec__p" key={i}>
              {p}
            </p>
          ))}
        </section>

        {/* Почему не другие */}
        <section className="sol-sec">
          <h3 className="sol-sec__h">Почему не другие — это доказано</h3>
          <div className="cleared">
            {SOLUTION.cleared.map((c) => (
              <div className="cleared__item" key={c.suspectId}>
                <span className="cleared__name">{susById[c.suspectId].name}</span>
                <span className="cleared__reason">{c.reason}</span>
                <span className="cleared__ev mono">Улика: {evById[c.evidenceId].title}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Что изобличило Марка */}
        <section className="sol-sec">
          <h3 className="sol-sec__h">Что изобличило {culprit.name.split(' ')[0]}а</h3>
          <ul className="incrim">
            {SOLUTION.incriminates.map((it) => (
              <li className="incrim__item" key={it.evidenceId}>
                <span className="incrim__ev">{evById[it.evidenceId].title}</span>
                <span className="incrim__reason">{it.reason}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Ключевая деталь */}
        <section className="keydetail">
          <span className="keydetail__label mono">Деталь, которую стоило заметить</span>
          <p className="keydetail__text type">{SOLUTION.keyDetail}</p>
        </section>

        <div className="snav">
          <span />
          <button className="btn btn--accent" onClick={restart}>
            Начать заново
          </button>
        </div>
      </div>
    </div>
  )
}
