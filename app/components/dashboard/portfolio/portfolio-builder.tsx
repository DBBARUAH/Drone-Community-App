"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { User, Award, Clock, Camera, Image, FileText, LinkIcon, CheckCircle2, Sparkles } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/blog-card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent } from "@/components/ui/tabs"

import { BasicProfileForm } from "@/components/dashboard/portfolio/basic-profile-form"
import { CertificationsForm } from "@/components/dashboard/portfolio/certifications-form"
import { ExperienceForm } from "@/components/dashboard/portfolio/experience-form"
import { EquipmentForm } from "@/components/dashboard/portfolio/equipment-form"
import { PortfolioGalleryForm } from "@/components/dashboard/portfolio/portfolio-gallery-form"
import { AdditionalInfoForm } from "@/components/dashboard/portfolio/additional-info-form"

const steps = [
  { id: "basic-profile", label: "Basic Profile", icon: User },
  { id: "certifications", label: "Certifications", icon: Award },
  { id: "experience", label: "Experience", icon: Clock },
  { id: "equipment", label: "Equipment", icon: Camera },
  { id: "portfolio-gallery", label: "Portfolio Gallery", icon: Image },
  { id: "additional-info", label: "Additional Info", icon: FileText },
]

export function PortfolioBuilder() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState("basic-profile")
  const [completedSteps, setCompletedSteps] = useState<string[]>([])

  const currentStepIndex = steps.findIndex((step) => step.id === currentStep)
  const progress = (completedSteps.length / steps.length) * 100

  const handleStepComplete = (stepId: string) => {
    if (!completedSteps.includes(stepId)) {
      setCompletedSteps([...completedSteps, stepId])
    }

    // Move to next step if available
    const nextStepIndex = currentStepIndex + 1
    if (nextStepIndex < steps.length) {
      setCurrentStep(steps[nextStepIndex].id)
    }
  }

  const handleSubmit = () => {
    // In a real app, you would save all data here
    alert("Portfolio information saved successfully!")
    router.push("/dashboard")
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Build Your Portfolio</h2>
        <p className="text-muted-foreground">
          Complete your professional profile to attract clients and showcase your expertise.
        </p>
      </div>

      {/* Progress indicator */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Progress</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Step navigation */}
      <div className="flex flex-wrap gap-2">
        {steps.map((step, index) => {
          const isCompleted = completedSteps.includes(step.id)
          const isCurrent = currentStep === step.id

          return (
            <Button
              key={step.id}
              variant={isCurrent ? "default" : isCompleted ? "outline" : "ghost"}
              className="flex items-center gap-2 h-auto py-2"
              onClick={() => setCurrentStep(step.id)}
            >
              <div className="flex items-center gap-1.5">
                {isCompleted ? <CheckCircle2 className="h-4 w-4 text-primary" /> : <step.icon className="h-4 w-4" />}
                <span className="hidden sm:inline">{step.label}</span>
                <span className="sm:hidden">{index + 1}</span>
              </div>
            </Button>
          )
        })}
      </div>

      {/* Step content */}
      <Card>
        <CardContent className="pt-6">
          <Tabs value={currentStep} onValueChange={setCurrentStep}>
            <TabsContent value="basic-profile">
              <BasicProfileForm onComplete={() => handleStepComplete("basic-profile")} />
            </TabsContent>

            <TabsContent value="certifications">
              <CertificationsForm onComplete={() => handleStepComplete("certifications")} />
            </TabsContent>

            <TabsContent value="experience">
              <ExperienceForm onComplete={() => handleStepComplete("experience")} />
            </TabsContent>

            <TabsContent value="equipment">
              <EquipmentForm onComplete={() => handleStepComplete("equipment")} />
            </TabsContent>

            <TabsContent value="portfolio-gallery">
              <PortfolioGalleryForm onComplete={() => handleStepComplete("portfolio-gallery")} />
            </TabsContent>

            <TabsContent value="additional-info">
              <AdditionalInfoForm onComplete={handleSubmit} isLastStep={true} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Admin note about service offerings */}
      <Card className="bg-muted/50 border-dashed">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="rounded-full bg-primary/10 p-2">
              <LinkIcon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-medium mb-1">Service Offerings</h3>
              <p className="text-sm text-muted-foreground mb-2">
                Your service offerings, packages, and pricing will be managed by our admin team. Once your portfolio is
                approved, an admin will contact you to discuss your services and set up your pricing structure on the
                platform.
              </p>
              <p className="text-sm font-medium">
                Please complete your profile first, and we'll handle the service setup for you.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Development Mode Quick Submit */}
      <Card className="mt-6 bg-primary/5 border-primary/20 border-dashed">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-start gap-4">
              <div className="rounded-full bg-primary/10 p-2">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-medium mb-1">Development Mode</h3>
                <p className="text-sm text-muted-foreground">
                  For development purposes only. This button simulates completing the portfolio creation process.
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              className="border-primary/30 hover:bg-primary/10"
              onClick={() => {
                // Mark portfolio as completed in localStorage
                localStorage.setItem("portfolioCompleted", "true")

                // Show success toast
                toast({
                  title: "Portfolio Completed",
                  description: "Portfolio marked as completed for development purposes.",
                  duration: 3000,
                })

                // Redirect to photographer dashboard
                router.push("/dashboard/photographer")
              }}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Dev: Mark Portfolio as Complete
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
