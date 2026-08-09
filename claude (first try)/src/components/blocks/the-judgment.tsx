import { JudgmentList } from "./judgment-list"

export function TheJudgment() {
  return (
    <section id="the-ai" className="section-y">
      <div className="shell judgment-layout">
        <h2 className="t-display-xl max-w-[15ch] text-ink">
          <span className="block">Routine work runs.</span>
          <span className="block text-primary">You stay in control.</span>
        </h2>

        <JudgmentList />
      </div>
    </section>
  )
}
