import { createContext, useContext, useEffect, useMemo, useReducer, useState } from 'react'
import { SCREENS } from '../engine/screens.js'
import { loadCase } from '../cases/index.js'
import { emptyCaseProgress, getCaseProgress, saveCaseProgress } from './progress.js'

// ── Редьюсер прогресса одного дела ────────────────────────────────────────
function reducer(state, action) {
  switch (action.type) {
    case 'GO': {
      if (!SCREENS.includes(action.screen)) return state
      const visited = state.visited.includes(action.screen)
        ? state.visited
        : [...state.visited, action.screen]
      return { ...state, screen: action.screen, visited }
    }
    case 'NEXT': {
      const i = SCREENS.indexOf(state.screen)
      const screen = SCREENS[Math.min(i + 1, SCREENS.length - 1)]
      const visited = state.visited.includes(screen)
        ? state.visited
        : [...state.visited, screen]
      return { ...state, screen, visited }
    }
    case 'PREV': {
      const i = SCREENS.indexOf(state.screen)
      return { ...state, screen: SCREENS[Math.max(i - 1, 0)] }
    }
    case 'OPEN_EVIDENCE':
      if (state.openedEvidence.includes(action.id)) return state
      return { ...state, openedEvidence: [...state.openedEvidence, action.id] }
    case 'TOGGLE_THREAD': {
      const { evidenceId, suspectId } = action
      const exists = state.threads.some(
        (t) => t.evidenceId === evidenceId && t.suspectId === suspectId,
      )
      return {
        ...state,
        threads: exists
          ? state.threads.filter(
              (t) => !(t.evidenceId === evidenceId && t.suspectId === suspectId),
            )
          : [...state.threads, { evidenceId, suspectId }],
      }
    }
    case 'SEE_REPLY': {
      const seen = state.dialogue[action.suspectId] || []
      if (seen.includes(action.replyId)) return state
      return {
        ...state,
        dialogue: { ...state.dialogue, [action.suspectId]: [...seen, action.replyId] },
      }
    }
    case 'SET_TIMELINE':
      return { ...state, timelineOrder: action.order, timelineSolved: action.solved }
    case 'SET_ACCUSATION':
      return { ...state, accusation: { ...state.accusation, ...action.patch } }
    case 'SET_VERDICT':
      return { ...state, verdict: action.verdict }
    case 'RESET':
      return emptyCaseProgress()
    default:
      return state
  }
}

const GameContext = createContext(null)

// Провайдер одного дела. Ставь ему key={caseId} — при смене дела нужен
// свежий монтаж, иначе прогресс прошлого дела утечёт в новое.
export function CaseProvider({ caseId, children }) {
  const [caseData, setCaseData] = useState(null)
  const [failed, setFailed] = useState(false)
  const [state, dispatch] = useReducer(reducer, caseId, getCaseProgress)

  useEffect(() => {
    let alive = true
    loadCase(caseId)
      .then((c) => alive && (c ? setCaseData(c) : setFailed(true)))
      .catch(() => alive && setFailed(true))
    return () => {
      alive = false
    }
  }, [caseId])

  useEffect(() => {
    saveCaseProgress(caseId, state)
  }, [caseId, state])

  const api = useMemo(
    () => ({
      caseData,
      caseId,
      state,
      goTo: (screen) => dispatch({ type: 'GO', screen }),
      next: () => dispatch({ type: 'NEXT' }),
      prev: () => dispatch({ type: 'PREV' }),
      openEvidence: (id) => dispatch({ type: 'OPEN_EVIDENCE', id }),
      toggleThread: (evidenceId, suspectId) =>
        dispatch({ type: 'TOGGLE_THREAD', evidenceId, suspectId }),
      seeReply: (suspectId, replyId) => dispatch({ type: 'SEE_REPLY', suspectId, replyId }),
      setTimeline: (order, solved) => dispatch({ type: 'SET_TIMELINE', order, solved }),
      setAccusation: (patch) => dispatch({ type: 'SET_ACCUSATION', patch }),
      setVerdict: (verdict) => dispatch({ type: 'SET_VERDICT', verdict }),
      reset: () => dispatch({ type: 'RESET' }),
    }),
    [caseData, caseId, state],
  )

  if (failed) {
    return (
      <div className="screen case-fallback">
        <p>Такого дела нет в картотеке.</p>
      </div>
    )
  }
  if (!caseData) {
    return (
      <div className="screen case-fallback">
        <p className="mono">Достаём папку из архива…</p>
      </div>
    )
  }

  return <GameContext.Provider value={api}>{children}</GameContext.Provider>
}

export function useGame() {
  const ctx = useContext(GameContext)
  if (!ctx) throw new Error('useGame должен вызываться внутри <CaseProvider>')
  return ctx
}
