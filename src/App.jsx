import { useGame } from './state/GameContext.jsx'
import ProgressNav from './components/ProgressNav.jsx'

import SplashScreen from './screens/SplashScreen.jsx'
import BoardScreen from './screens/BoardScreen.jsx'
import SuspectsScreen from './screens/SuspectsScreen.jsx'
import InterrogationScreen from './screens/InterrogationScreen.jsx'
import TimelineScreen from './screens/TimelineScreen.jsx'
import AccusationScreen from './screens/AccusationScreen.jsx'
import SolutionScreen from './screens/SolutionScreen.jsx'

const SCREEN_COMPONENTS = {
  splash: SplashScreen,
  board: BoardScreen,
  suspects: SuspectsScreen,
  interrogation: InterrogationScreen,
  timeline: TimelineScreen,
  accusation: AccusationScreen,
  solution: SolutionScreen,
}

export default function App() {
  const { state } = useGame()
  const Current = SCREEN_COMPONENTS[state.screen] ?? SplashScreen

  return (
    <div className="app">
      {/* Тёплый мерцающий свет лампы поверх сцены */}
      <div className="lamp" aria-hidden="true" />
      <ProgressNav />
      {/* key заставляет экран пере-монтироваться → срабатывает анимация входа */}
      <Current key={state.screen} />
    </div>
  )
}
