import { createContext, useContext, useEffect, useMemo, useReducer } from 'react'
import { SCREENS } from './caseData.js'

const STORAGE_KEY = 'delo-001-progress'

// ── Начальное состояние ───────────────────────────────────────────────────
const initialState = {
  screen: 'splash',
  visited: ['splash'],       // какие экраны уже открывались (для навигации)
  openedEvidence: [],        // id улик, раскрытых на доске
  threads: [],               // связи доски: [{ evidenceId, suspectId }]
  dialogue: {},              // прогресс допроса: { suspectId: [repliesSeen...] }
  timelineOrder: null,       // порядок хронологии, когда игрок его подтвердит
  timelineSolved: false,
  accusation: { suspectId: null, motiveId: null, evidenceId: null },
  verdict: null,             // 'correct' | 'wrong' — итог обвинения
}

// ── Редьюсер ──────────────────────────────────────────────────────────────
function reducer(state, action) {
  switch (action.type) {
    case 'GO': {
      const screen = action.screen
      if (!SCREENS.includes(screen)) return state
      const visited = state.visited.includes(screen)
        ? state.visited
        : [...state.visited, screen]
      return { ...state, screen, visited }
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
      const screen = SCREENS[Math.max(i - 1, 0)]
      return { ...state, screen }
    }
    case 'OPEN_EVIDENCE': {
      if (state.openedEvidence.includes(action.id)) return state
      return { ...state, openedEvidence: [...state.openedEvidence, action.id] }
    }
    case 'TOGGLE_THREAD': {
      const { evidenceId, suspectId } = action
      const exists = state.threads.some(
        (t) => t.evidenceId === evidenceId && t.suspectId === suspectId,
      )
      const threads = exists
        ? state.threads.filter(
            (t) => !(t.evidenceId === evidenceId && t.suspectId === suspectId),
          )
        : [...state.threads, { evidenceId, suspectId }]
      return { ...state, threads }
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
      return { ...initialState, visited: ['splash'] }
    default:
      return state
  }
}

// Ленивая инициализация из localStorage
function init(fallback) {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) return { ...fallback, ...JSON.parse(saved) }
  } catch {
    /* повреждённое сохранение — игнорируем */
  }
  return fallback
}

const GameContext = createContext(null)

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState, init)

  // Сохраняем прогресс
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      /* приватный режим и т.п. — молча пропускаем */
    }
  }, [state])

  const api = useMemo(
    () => ({
      state,
      goTo: (screen) => dispatch({ type: 'GO', screen }),
      next: () => dispatch({ type: 'NEXT' }),
      prev: () => dispatch({ type: 'PREV' }),
      openEvidence: (id) => dispatch({ type: 'OPEN_EVIDENCE', id }),
      toggleThread: (evidenceId, suspectId) =>
        dispatch({ type: 'TOGGLE_THREAD', evidenceId, suspectId }),
      seeReply: (suspectId, replyId) =>
        dispatch({ type: 'SEE_REPLY', suspectId, replyId }),
      setTimeline: (order, solved) => dispatch({ type: 'SET_TIMELINE', order, solved }),
      setAccusation: (patch) => dispatch({ type: 'SET_ACCUSATION', patch }),
      setVerdict: (verdict) => dispatch({ type: 'SET_VERDICT', verdict }),
      reset: () => dispatch({ type: 'RESET' }),
    }),
    [state],
  )

  return <GameContext.Provider value={api}>{children}</GameContext.Provider>
}

export function useGame() {
  const ctx = useContext(GameContext)
  if (!ctx) throw new Error('useGame должен вызываться внутри <GameProvider>')
  return ctx
}
