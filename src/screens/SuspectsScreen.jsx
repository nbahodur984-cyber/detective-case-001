import ScreenHeader from '../components/ScreenHeader.jsx'
import ScreenNav from '../components/ScreenNav.jsx'
import SuspectPortrait from '../components/SuspectPortrait.jsx'
import { SUSPECTS } from '../state/caseData.js'
import './SuspectsScreen.css'

// Первичные досье. Портреты, «прикалывание» карточек и связь с доской — этап 6.
export default function SuspectsScreen() {
  return (
    <div className="screen">
      <div className="screen__inner">
        <ScreenHeader step={2} title="Подозреваемые">
          Четыре досье. У каждого есть мотив и алиби — но одно алиби противоречит уликам.
        </ScreenHeader>

        <div className="suspects">
          {SUSPECTS.map((s) => (
            <article className="dossier" key={s.id}>
              <div className="dossier__photo">
                <SuspectPortrait id={s.id} />
              </div>
              <div className="dossier__body">
                <h3 className="dossier__name">{s.name}</h3>
                <p className="dossier__role">
                  {s.age} · {s.role}
                </p>
                <p className="dossier__row">
                  <span className="dossier__k">Мотив</span>
                  {s.motive}
                </p>
                <p className="dossier__row">
                  <span className="dossier__k">Алиби</span>
                  {s.alibi}
                </p>
              </div>
            </article>
          ))}
        </div>

        <ScreenNav />
      </div>
    </div>
  )
}
