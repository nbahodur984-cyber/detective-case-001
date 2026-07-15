import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CASES, DIFFICULTY_LABEL } from '../cases/index.js'
import {
  getUnlockAll,
  isSolved,
  isStarted,
  isUnlocked,
  setUnlockAll,
  solvedCount,
} from '../state/progress.js'
import './ArchiveScreen.css'

function statusOf(id, unlocked) {
  if (isSolved(id)) return { key: 'solved', label: 'Раскрыто' }
  if (!unlocked) return { key: 'locked', label: 'Заперто' }
  if (isStarted(id)) return { key: 'started', label: 'В работе' }
  return { key: 'open', label: 'Доступно' }
}

export default function ArchiveScreen() {
  const [unlockAllOn, setOn] = useState(getUnlockAll())
  const solved = solvedCount()

  const toggleAll = () => {
    const v = !unlockAllOn
    setUnlockAll(v)
    setOn(v)
  }

  return (
    <div className="screen archive">
      <div className="archive__inner">
        <header className="archive__head">
          <Link className="archive__back" to="/">
            ← Картотека
          </Link>
          <h1 className="archive__title">Дела</h1>
          <p className="archive__sub">
            Первое дело открыто всегда. Следующее — после раскрытия предыдущего.
          </p>
          <div className="archive__meta mono">
            <span>
              Раскрыто {solved} из {CASES.length}
            </span>
            <button className="archive__toggle" onClick={toggleAll}>
              {unlockAllOn ? '✓ Все дела открыты' : 'Открыть все дела'}
            </button>
          </div>
        </header>

        <div className="archive__list">
          {CASES.map((c) => {
            const unlocked = unlockAllOn || isUnlocked(c.id)
            const st = statusOf(c.id, unlocked)
            const Card = unlocked ? Link : 'div'
            const props = unlocked ? { to: `/case/${c.id}` } : {}

            return (
              <Card key={c.id} className={`cfile is-${st.key}`} {...props}>
                <span className="cfile__tab" aria-hidden="true" />
                <div className="cfile__top">
                  <span className="cfile__no mono">{c.number}</span>
                  <span className={`cfile__status cfile__status--${st.key}`}>{st.label}</span>
                </div>

                <h2 className="cfile__title">
                  {unlocked ? `«${c.title}»` : 'Дело под замком'}
                </h2>
                <p className="cfile__tagline">
                  {unlocked
                    ? c.tagline
                    : 'Раскройте предыдущее дело — или откройте все разом кнопкой выше.'}
                </p>

                {unlocked && (
                  <dl className="cfile__facts">
                    <div>
                      <dt>Жертва</dt>
                      <dd>
                        {c.victim.name}, {c.victim.age}
                      </dd>
                    </div>
                    <div>
                      <dt>Сложность</dt>
                      <dd>{DIFFICULTY_LABEL[c.difficulty]}</dd>
                    </div>
                  </dl>
                )}

                {unlocked && (
                  <span className="cfile__go">
                    {st.key === 'solved'
                      ? 'Открыть разбор →'
                      : st.key === 'started'
                        ? 'Продолжить →'
                        : 'Взяться за дело →'}
                  </span>
                )}
              </Card>
            )
          })}

          {/* Задел на будущее — чтобы архив не выглядел законченным */}
          <div className="cfile is-soon" aria-hidden="true">
            <span className="cfile__tab" />
            <div className="cfile__top">
              <span className="cfile__no mono">Дело №{String(CASES.length + 1).padStart(3, '0')}</span>
            </div>
            <h2 className="cfile__title">В работе</h2>
            <p className="cfile__tagline">
              Новое дело готовится. Загляните позже — архив пополняется.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
