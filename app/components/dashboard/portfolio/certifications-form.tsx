"use client"

import type React from "react"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Plus, Trash2, Upload } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent } from "@/components/ui/blog-card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"

const formSchema = z.object({
  hasFAA107: z.boolean().default(false),
  faa107Number: z.string().optional(),
  faa107ExpiryDate: z.string().optional(),
  hasInsurance: z.boolean().default(false),
  insuranceProvider: z.string().optional(),
  insurancePolicyNumber: z.string().optional(),
  insuranceCoverageAmount: z.string().optional(),
})

interface CertificationsFormProps {
  onComplete: () => void
  profileId: string
}

export function CertificationsForm({ onComplete, profileId }: CertificationsFormProps) {
  const [additionalCerts, setAdditionalCerts] = useState<
    {
      id: string
      name: string
      issuer: string
      date: string
      file?: string
    }[]
  >([])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      hasFAA107: false,
      hasInsurance: false,
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values, additionalCerts)
    onComplete()
  }

  const addCertification = () => {
    setAdditionalCerts([
      ...additionalCerts,
      {
        id: Date.now().toString(),
        name: "",
        issuer: "",
        date: "",
      },
    ])
  }

  const removeCertification = (id: string) => {
    setAdditionalCerts(additionalCerts.filter((cert) => cert.id !== id))
  }

  const updateCertification = (id: string, field: string, value: string) => {
    setAdditionalCerts(additionalCerts.map((cert) => (cert.id === id ? { ...cert, [field]: value } : cert)))
  }

  const handleFileUpload = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setAdditionalCerts(
          additionalCerts.map((cert) => (cert.id === id ? { ...cert, file: e.target?.result as string } : cert)),
        )
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Certifications</h3>
        <p className="text-sm text-muted-foreground">Add your drone pilot certifications and insurance information.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* FAA Part 107 Section */}
          <div className="space-y-4">
            <h4 className="text-md font-medium">FAA Part 107 Certification</h4>

            <FormField
              control={form.control}
              name="hasFAA107"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>I have an FAA Part 107 Remote Pilot Certificate</FormLabel>
                    <FormDescription>Required for commercial drone operations in the United States</FormDescription>
                  </div>
                </FormItem>
              )}
            />

            {form.watch("hasFAA107") && (
              <div className="grid gap-4 sm:grid-cols-2 pl-4 border-l-2 border-primary/20">
                <FormField
                  control={form.control}
                  name="faa107Number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Certificate Number</FormLabel>
                      <FormControl>
                        <Input placeholder="4012345" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="faa107ExpiryDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expiration Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
          </div>

          {/* Insurance Section */}
          <div className="space-y-4">
            <h4 className="text-md font-medium">Liability Insurance</h4>

            <FormField
              control={form.control}
              name="hasInsurance"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>I have liability insurance for my drone operations</FormLabel>
                    <FormDescription>Recommended for all commercial drone services</FormDescription>
                  </div>
                </FormItem>
              )}
            />

            {form.watch("hasInsurance") && (
              <div className="grid gap-4 sm:grid-cols-3 pl-4 border-l-2 border-primary/20">
                <FormField
                  control={form.control}
                  name="insuranceProvider"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Insurance Provider</FormLabel>
                      <FormControl>
                        <Input placeholder="SkyWatch" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="insurancePolicyNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Policy Number</FormLabel>
                      <FormControl>
                        <Input placeholder="POL-12345" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="insuranceCoverageAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Coverage Amount</FormLabel>
                      <FormControl>
                        <Input placeholder="$1,000,000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
          </div>

          {/* Additional Certifications Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-md font-medium">Additional Certifications</h4>
              <Button type="button" variant="outline" size="sm" onClick={addCertification}>
                <Plus className="h-4 w-4 mr-2" />
                Add Certification
              </Button>
            </div>

            {additionalCerts.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No additional certifications added. Click the button above to add one.
              </p>
            ) : (
              <div className="space-y-4">
                {additionalCerts.map((cert, index) => (
                  <Card key={cert.id}>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start mb-4">
                        <Badge variant="outline">Certification {index + 1}</Badge>
                        <Button type="button" variant="ghost" size="sm" onClick={() => removeCertification(cert.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-3">
                        <div>
                          <Label htmlFor={`cert-name-${cert.id}`}>Certification Name</Label>
                          <Input
                            id={`cert-name-${cert.id}`}
                            placeholder="e.g., Drone Mapping Specialist"
                            value={cert.name}
                            onChange={(e) => updateCertification(cert.id, "name", e.target.value)}
                          />
                        </div>

                        <div>
                          <Label htmlFor={`cert-issuer-${cert.id}`}>Issuing Organization</Label>
                          <Input
                            id={`cert-issuer-${cert.id}`}
                            placeholder="e.g., DJI Academy"
                            value={cert.issuer}
                            onChange={(e) => updateCertification(cert.id, "issuer", e.target.value)}
                          />
                        </div>

                        <div>
                          <Label htmlFor={`cert-date-${cert.id}`}>Date Obtained</Label>
                          <Input
                            id={`cert-date-${cert.id}`}
                            type="date"
                            value={cert.date}
                            onChange={(e) => updateCertification(cert.id, "date", e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="mt-4">
                        <Label htmlFor={`cert-file-${cert.id}`}>Upload Certificate (Optional)</Label>
                        <div className="flex items-center gap-2 mt-1">
                          <Button type="button" variant="outline" size="sm" className="relative overflow-hidden">
                            <Upload className="h-4 w-4 mr-2" />
                            {cert.file ? "Change File" : "Upload File"}
                            <input
                              id={`cert-file-${cert.id}`}
                              type="file"
                              accept=".pdf,.jpg,.jpeg,.png"
                              className="absolute inset-0 opacity-0 cursor-pointer"
                              onChange={(e) => handleFileUpload(cert.id, e)}
                            />
                          </Button>
                          {cert.file && <span className="text-sm text-muted-foreground">File uploaded</span>}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <Button type="submit">Save & Continue</Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

