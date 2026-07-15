import { useParams } from 'react-router-dom'
import { CaseProvider, useGame } from '../state/GameContext.jsx'
import ProgressNav from '../components/ProgressNav.jsx'

import SplashScreen from './SplashScreen.jsx'
import BoardScreen from './BoardScreen.jsx'
import SuspectsScreen from './SuspectsScreen.jsx'
import InterrogationScreen from './InterrogationScreen.jsx'
import TimelineScreen from './TimelineScreen.jsx'
import AccusationScreen from './AccusationScreen.jsx'
import SolutionScreen from './SolutionScreen.jsx'

const SCREEN_COMPONENTS = {
  splash: SplashScreen,
  board: BoardScreen,
  suspects: SuspectsScreen,
  interrogation: InterrogationScreen,
  timeline: TimelineScreen,
  accusation: AccusationScreen,
  solution: SolutionScreen,
}

function CaseBody() {
  const { state } = useGame()
  const Current = SCREEN_COMPONENTS[state.screen] ?? SplashScreen
  return (
    <>
      <ProgressNav />
      {/* key заставляет экран пере-монтироваться → срабатывает анимация входа */}
      <Current key={state.screen} />
    </>
  )
}

export default function CaseScreen() {
  const { caseId } = useParams()
  // key={caseId} — при переходе между делами нужен свежий монтаж провайдера
  return (
    <CaseProvider caseId={caseId} key={caseId}>
      <CaseBody />
    </CaseProvider>
  )
}
