import { useGame } from '../state/GameContext.jsx'
import { SCREENS } from '../engine/screens.js'
import './ScreenNav.css'

// Подвал экрана: «Назад» / «Далее». nextLabel и onNext можно переопределить.
export default function ScreenNav({ nextLabel = 'Далее', onNext, hideNext = false }) {
  const { state, next, prev } = useGame()
  const i = SCREENS.indexOf(state.screen)
  const isFirstAfterSplash = i <= 1

  return (
    <div className="snav">
      <button
        className="btn btn--ghost"
        onClick={prev}
        disabled={isFirstAfterSplash}
        style={isFirstAfterSplash ? { visibility: 'hidden' } : undefined}
      >
        ← Назад
      </button>
      {!hideNext && (
        <button className="btn btn--accent" onClick={onNext || next}>
          {nextLabel} →
        </button>
      )}
    </div>
  )
}
