interface Step {
  id: string
  label: string
}

interface ProgressIndicatorProps {
  steps: Step[]
  current: number
}

export function ProgressIndicator({ steps, current }: ProgressIndicatorProps) {
  return (
    <nav aria-label="Form progress" className="w-full">
      <ol className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {steps.map((step, index) => {
          const done = index < current
          const active = index === current
          return (
            <li key={step.id} className="flex flex-1 items-center gap-2">
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                  done
                    ? 'bg-success text-white'
                    : active
                      ? 'bg-brand text-white'
                      : 'bg-slate-200 text-slate-600'
                }`}
                aria-current={active ? 'step' : undefined}
              >
                {done ? '✓' : index + 1}
              </span>
              <span
                className={`text-sm font-medium ${active ? 'text-navy' : 'text-muted'}`}
              >
                {step.label}
              </span>
              {index < steps.length - 1 && (
                <span className="mx-2 hidden h-px flex-1 bg-border sm:block" aria-hidden />
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
