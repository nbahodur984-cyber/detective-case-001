// Единый заголовок экрана: № этапа, название, подзаголовок.
export default function ScreenHeader({ step, title, children }) {
  return (
    <header className="shead">
      <span className="shead__step mono">Этап {step} из 6</span>
      <h1 className="shead__title">{title}</h1>
      {children && <p className="shead__sub">{children}</p>}
    </header>
  )
}
