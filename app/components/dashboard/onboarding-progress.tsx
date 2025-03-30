import { CheckCircle2, Circle } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface OnboardingStep {
  id: string
  title: string
  description: string
  completed: boolean
}

interface OnboardingProgressProps {
  steps: OnboardingStep[]
  userType: "client" | "photographer"
}

export function OnboardingProgress({ steps, userType }: OnboardingProgressProps) {
  const completedSteps = steps.filter((step) => step.completed).length
  const progressPercentage = (completedSteps / steps.length) * 100

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Getting Started</h3>
        <span className="text-sm text-muted-foreground">
          {completedSteps} of {steps.length} completed
        </span>
      </div>

      <Progress value={progressPercentage} className="h-2" />

      <div className="space-y-4 mt-4">
        {steps.map((step) => (
          <div key={step.id} className="flex items-start gap-3">
            {step.completed ? (
              <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            ) : (
              <Circle className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
            )}
            <div>
              <h4 className="text-sm font-medium">{step.title}</h4>
              <p className="text-sm text-muted-foreground">{step.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-2">
        <a
          href={userType === "client" ? "/dashboard/find-photographers" : "/dashboard/portfolio/create"}
          className="text-sm font-medium text-primary hover:underline"
        >
          {userType === "client" ? "Find photographers now →" : "Complete your profile →"}
        </a>
      </div>
    </div>
  )
}

