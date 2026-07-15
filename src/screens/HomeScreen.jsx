import { Link } from 'react-router-dom'
import DeskScene from '../components/DeskScene.jsx'
import { CASES } from '../cases/index.js'
import { solvedCount } from '../state/progress.js'
import './HomeScreen.css'

// Как ведётся расследование — четыре шага, по одному на экран игры.
const STEPS = [
  {
    n: '01',
    title: 'Доска улик',
    text: 'Рассмотрите каждую улику вблизи и протяните нить к тому, на кого она, по-вашему, указывает.',
    icon: (
      <>
        <circle cx="10.5" cy="10.5" r="6.5" />
        <path d="M15.4 15.4 21 21" />
      </>
    ),
  },
  {
    n: '02',
    title: 'Допрос',
    text: 'Задавайте вопросы. Показания сверяются с уликами: ложь выдаёт себя противоречием.',
    icon: (
      <>
        <path d="M3 6.5A2.5 2.5 0 0 1 5.5 4h13A2.5 2.5 0 0 1 21 6.5v7a2.5 2.5 0 0 1-2.5 2.5H9l-5 4v-4h-.5" />
        <path d="M8 8.5h8M8 12h5" />
      </>
    ),
  },
  {
    n: '03',
    title: 'Хронология',
    text: 'Восстановите порядок событий той ночи. Время скрыто — опереться можно только на логику.',
    icon: (
      <>
        <path d="M3 12h18" />
        <circle cx="6.5" cy="12" r="2.2" />
        <circle cx="12" cy="12" r="2.2" />
        <circle cx="17.5" cy="12" r="2.2" />
      </>
    ),
  },
  {
    n: '04',
    title: 'Обвинение',
    text: 'Назовите виновного, мотив и решающую улику. Ошибётесь — вернётесь к уликам.',
    icon: (
      <>
        <circle cx="12" cy="12" r="8.2" />
        <circle cx="12" cy="12" r="4" />
      </>
    ),
  },
]

function StepIcon({ children }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  )
}

export default function HomeScreen() {
  const solved = solvedCount()

  return (
    <div className="screen home">
      <div className="home__inner">
        {/* ── Кто мы и что здесь происходит ──────────────────────────── */}
        <header className="home__hero">
          <p className="home__eyebrow mono">Архив нераскрытых дел</p>
          <h1 className="home__title">Картотека</h1>
          <p className="home__lead">Здесь не угадывают. Здесь исключают.</p>

          <p className="home__intro">
            Интерактивные детективные дела, которые вы расследуете сами. Не читаете чужое
            расследование — ведёте своё: рассматриваете улики, ловите подозреваемых на лжи,
            восстанавливаете ход той ночи и называете виновного.
          </p>

          <div className="home__actions">
            <Link className="btn btn--accent home__cta" to="/cases">
              Открыть картотеку →
            </Link>
          </div>

          <div className="home__stats mono">
            <span>
              Дел в архиве: <b>{CASES.length}</b>
            </span>
            <span className="home__sep">·</span>
            <span>
              Раскрыто вами: <b>{solved}</b>
            </span>
          </div>
        </header>

        {/* ── Стол детектива ─────────────────────────────────────────── */}
        <figure className="home__desk">
          <DeskScene />
          <figcaption className="home__desk-cap mono">
            Ваш стол. Лампа горит, папка раскрыта — дальше думать вам.
          </figcaption>
        </figure>

        {/* ── Как это работает ───────────────────────────────────────── */}
        <section className="home__section">
          <h2 className="home__h2">Как ведётся расследование</h2>
          <ol className="steps">
            {STEPS.map((s) => (
              <li className="step" key={s.n}>
                <span className="step__icon">
                  <StepIcon>{s.icon}</StepIcon>
                </span>
                <span className="step__n mono">{s.n}</span>
                <h3 className="step__title">{s.title}</h3>
                <p className="step__text">{s.text}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* ── Обещание: почему это честно ────────────────────────────── */}
        <section className="promise">
          <span className="promise__label mono">Правила честной игры</span>
          <p className="promise__text type">
            Улики ведут к одному виновному через исключение: у троих алиби подтверждается твёрдым
            фактом, у одного — рассыпается. Ложные следы есть, но каждый опровергается другой
            уликой. Ни одна деталь не требует догадки.
          </p>
          <p className="promise__sub">
            Разгадка откроется только за верное обвинение. Ошиблись — ответа не будет,
            возвращайтесь к уликам.
          </p>
        </section>

        <p className="home__foot">
          Архив пополняется — новые дела появляются здесь.
        </p>
      </div>
    </div>
  )
}
