import { useEffect } from 'react'
import { useGame } from '../state/GameContext.jsx'
import { SUSPECTS } from '../state/caseData.js'
import EvidenceIcon from './EvidenceIcon.jsx'
import './EvidenceModal.css'

// Крупный план улики: игрок «берёт в руки» экспонат, читает деталь
// и решает, к кому протянуть нить. Тип улики (прямая/ложная) НЕ раскрывается —
// это игрок должен вывести сам.
export default function EvidenceModal({ evidence, exhibitNo, onClose }) {
  const { state, toggleThread } = useGame()

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  if (!evidence) return null

  return (
    <div className="emodal" role="dialog" aria-modal="true" aria-label={evidence.title}>
      <div className="emodal__backdrop" onClick={onClose} />
      <div className="emodal__card">
        <button className="emodal__close" onClick={onClose} aria-label="Закрыть">
          ×
        </button>

        <div className="emodal__exhibit mono">Экспонат №{exhibitNo}</div>

        <div className="emodal__figure">
          <EvidenceIcon id={evidence.id} size={54} />
        </div>

        <h2 className="emodal__title">{evidence.title}</h2>
        <p className="emodal__detail">{evidence.detail}</p>

        <div className="emodal__link">
          <span className="emodal__link-label mono">Протянуть нить к:</span>
          <div className="emodal__chips">
            {SUSPECTS.map((s) => {
              const linked = state.threads.some(
                (t) => t.evidenceId === evidence.id && t.suspectId === s.id,
              )
              return (
                <button
                  key={s.id}
                  className={'chip' + (linked ? ' is-linked' : '')}
                  onClick={() => toggleThread(evidence.id, s.id)}
                  aria-pressed={linked}
                >
                  <span className="chip__dot" />
                  {s.name}
                </button>
              )
            })}
          </div>
          <p className="emodal__hint">
            Нить — это ваша гипотеза, а не подсказка. Свяжите улику с тем, на кого она, по-вашему,
            указывает.
          </p>
        </div>
      </div>
    </div>
  )
}
