import { Link } from 'react-router-dom'
import { useGame } from '../state/GameContext.jsx'
import { SCREENS, SCREEN_TITLES } from '../engine/screens.js'
import './ProgressNav.css'

// Верхний стеклянный степпер: показывает 7 этапов расследования,
// подсвечивает текущий и позволяет вернуться к уже открытым.
export default function ProgressNav() {
  const { state, goTo, caseData } = useGame()
  const currentIndex = SCREENS.indexOf(state.screen)

  // На заставке навигацию прячем — она появляется, когда расследование началось.
  if (state.screen === 'splash') return null

  return (
    <nav className="pnav" aria-label="Этапы расследования">
      <div className="pnav__inner">
        <Link className="pnav__case type" to="/cases" title="Вернуться в картотеку">
          №{caseData.id}
        </Link>
        <ol className="pnav__steps">
          {SCREENS.filter((s) => s !== 'splash').map((screen) => {
            const idx = SCREENS.indexOf(screen)
            const unlocked = state.visited.includes(screen)
            const isCurrent = screen === state.screen
            const isDone = unlocked && idx < currentIndex
            return (
              <li key={screen}>
                <button
                  className={
                    'pnav__step' +
                    (isCurrent ? ' is-current' : '') +
                    (isDone ? ' is-done' : '') +
                    (unlocked ? '' : ' is-locked')
                  }
                  onClick={() => unlocked && goTo(screen)}
                  disabled={!unlocked}
                  aria-current={isCurrent ? 'step' : undefined}
                >
                  <span className="pnav__dot" />
                  <span className="pnav__label">{SCREEN_TITLES[screen]}</span>
                </button>
              </li>
            )
          })}
        </ol>
      </div>
    </nav>
  )
}
