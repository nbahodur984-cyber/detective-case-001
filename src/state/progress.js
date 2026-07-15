// ─────────────────────────────────────────────────────────────────────────
//  Прогресс игрока по всем делам. Хранится в браузере — без регистрации.
//  Форма: { v, unlockAll, cases: { '001': {...}, '002': {...} } }
// ─────────────────────────────────────────────────────────────────────────
import { CASES, caseIndex } from '../cases/index.js'

const KEY = 'kartoteka-progress-v1'
const LEGACY_KEY = 'delo-001-progress' // до появления картотеки

export const emptyCaseProgress = () => ({
  screen: 'splash',
  visited: ['splash'],
  openedEvidence: [],
  threads: [],
  dialogue: {},
  timelineOrder: null,
  timelineSolved: false,
  accusation: { suspectId: null, motiveId: null, evidenceId: null },
  verdict: null,
})

const emptyRoot = () => ({ v: 1, unlockAll: false, cases: {} })

export function loadAll() {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return { ...emptyRoot(), ...JSON.parse(raw) }

    // Перенос прогресса тех, кто играл до картотеки: было одно дело — №001.
    const legacy = localStorage.getItem(LEGACY_KEY)
    if (legacy) {
      const root = emptyRoot()
      root.cases['001'] = { ...emptyCaseProgress(), ...JSON.parse(legacy) }
      saveAll(root)
      localStorage.removeItem(LEGACY_KEY)
      return root
    }
  } catch {
    /* повреждённое сохранение — начинаем с чистого листа */
  }
  return emptyRoot()
}

export function saveAll(root) {
  try {
    localStorage.setItem(KEY, JSON.stringify(root))
  } catch {
    /* приватный режим и т.п. — молча пропускаем */
  }
}

export function getCaseProgress(caseId) {
  const root = loadAll()
  return { ...emptyCaseProgress(), ...(root.cases[caseId] || {}) }
}

export function saveCaseProgress(caseId, progress) {
  const root = loadAll()
  root.cases[caseId] = progress
  saveAll(root)
}

export const isSolved = (caseId) => getCaseProgress(caseId).verdict === 'correct'

export const isStarted = (caseId) => {
  const p = loadAll().cases[caseId]
  return !!p && (p.openedEvidence?.length > 0 || p.visited?.length > 1)
}

// Первое дело открыто всегда; следующее — после раскрытия предыдущего.
// Плюс общий рубильник «открыть все» для тех, кто не хочет идти по порядку.
export function isUnlocked(caseId) {
  if (loadAll().unlockAll) return true
  const i = caseIndex(caseId)
  if (i <= 0) return true
  return isSolved(CASES[i - 1].id)
}

export const getUnlockAll = () => loadAll().unlockAll === true

export function setUnlockAll(on) {
  const root = loadAll()
  root.unlockAll = !!on
  saveAll(root)
}

export function resetCase(caseId) {
  const root = loadAll()
  delete root.cases[caseId]
  saveAll(root)
}

export function resetAll() {
  saveAll(emptyRoot())
}

export const solvedCount = () => CASES.filter((c) => isSolved(c.id)).length
