"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Plus, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/blog-card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

const formSchema = z.object({
  equipmentSummary: z.string().min(10, "Please provide a summary of your equipment"),
})

interface EquipmentFormProps {
  onComplete: () => void
}

export function EquipmentForm({ onComplete }: EquipmentFormProps) {
  const [drones, setDrones] = useState<
    {
      id: string
      model: string
      manufacturer: string
      yearPurchased: string
      features: string
    }[]
  >([])

  const [cameras, setCameras] = useState<
    {
      id: string
      model: string
      manufacturer: string
      resolution: string
      features: string
    }[]
  >([])

  const [accessories, setAccessories] = useState<
    {
      id: string
      name: string
      type: string
      description: string
    }[]
  >([])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      equipmentSummary: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values, drones, cameras, accessories)
    onComplete()
  }

  // Drone handlers
  const addDrone = () => {
    setDrones([
      ...drones,
      {
        id: Date.now().toString(),
        model: "",
        manufacturer: "",
        yearPurchased: new Date().getFullYear().toString(),
        features: "",
      },
    ])
  }

  const removeDrone = (id: string) => {
    setDrones(drones.filter((drone) => drone.id !== id))
  }

  const updateDrone = (id: string, field: string, value: string) => {
    setDrones(drones.map((drone) => (drone.id === id ? { ...drone, [field]: value } : drone)))
  }

  // Camera handlers
  const addCamera = () => {
    setCameras([
      ...cameras,
      {
        id: Date.now().toString(),
        model: "",
        manufacturer: "",
        resolution: "",
        features: "",
      },
    ])
  }

  const removeCamera = (id: string) => {
    setCameras(cameras.filter((camera) => camera.id !== id))
  }

  const updateCamera = (id: string, field: string, value: string) => {
    setCameras(cameras.map((camera) => (camera.id === id ? { ...camera, [field]: value } : camera)))
  }

  // Accessory handlers
  const addAccessory = () => {
    setAccessories([
      ...accessories,
      {
        id: Date.now().toString(),
        name: "",
        type: "",
        description: "",
      },
    ])
  }

  const removeAccessory = (id: string) => {
    setAccessories(accessories.filter((accessory) => accessory.id !== id))
  }

  const updateAccessory = (id: string, field: string, value: string) => {
    setAccessories(accessories.map((accessory) => (accessory.id === id ? { ...accessory, [field]: value } : accessory)))
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Equipment</h3>
        <p className="text-sm text-muted-foreground">List your drone equipment, cameras, and accessories.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="equipmentSummary"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Equipment Summary</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Provide a brief overview of your equipment setup"
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>This will be displayed at the top of your equipment section</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Drones Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-md font-medium">Drones</h4>
              <Button type="button" variant="outline" size="sm" onClick={addDrone}>
                <Plus className="h-4 w-4 mr-2" />
                Add Drone
              </Button>
            </div>

            {drones.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No drones added. Click the button above to add your drone equipment.
              </p>
            ) : (
              <div className="space-y-4">
                {drones.map((drone, index) => (
                  <Card key={drone.id}>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start mb-4">
                        <Badge variant="outline">Drone {index + 1}</Badge>
                        <Button type="button" variant="ghost" size="sm" onClick={() => removeDrone(drone.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <Label htmlFor={`drone-model-${drone.id}`}>Drone Model</Label>
                          <Input
                            id={`drone-model-${drone.id}`}
                            placeholder="e.g., Mavic 3 Pro"
                            value={drone.model}
                            onChange={(e) => updateDrone(drone.id, "model", e.target.value)}
                          />
                        </div>

                        <div>
                          <Label htmlFor={`drone-manufacturer-${drone.id}`}>Manufacturer</Label>
                          <Input
                            id={`drone-manufacturer-${drone.id}`}
                            placeholder="e.g., DJI"
                            value={drone.manufacturer}
                            onChange={(e) => updateDrone(drone.id, "manufacturer", e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="mt-4">
                        <Label htmlFor={`drone-year-${drone.id}`}>Year Purchased</Label>
                        <Input
                          id={`drone-year-${drone.id}`}
                          type="number"
                          placeholder="2023"
                          value={drone.yearPurchased}
                          onChange={(e) => updateDrone(drone.id, "yearPurchased", e.target.value)}
                        />
                      </div>

                      <div className="mt-4">
                        <Label htmlFor={`drone-features-${drone.id}`}>Key Features</Label>
                        <Textarea
                          id={`drone-features-${drone.id}`}
                          placeholder="e.g., 4/3 CMOS Hasselblad camera, 5.1K video, 46-minute flight time"
                          className="min-h-[80px]"
                          value={drone.features}
                          onChange={(e) => updateDrone(drone.id, "features", e.target.value)}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Cameras Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-md font-medium">Cameras</h4>
              <Button type="button" variant="outline" size="sm" onClick={addCamera}>
                <Plus className="h-4 w-4 mr-2" />
                Add Camera
              </Button>
            </div>

            {cameras.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No cameras added. Click the button above to add your camera equipment.
              </p>
            ) : (
              <div className="space-y-4">
                {cameras.map((camera, index) => (
                  <Card key={camera.id}>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start mb-4">
                        <Badge variant="outline">Camera {index + 1}</Badge>
                        <Button type="button" variant="ghost" size="sm" onClick={() => removeCamera(camera.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <Label htmlFor={`camera-model-${camera.id}`}>Camera Model</Label>
                          <Input
                            id={`camera-model-${camera.id}`}
                            placeholder="e.g., Hasselblad L2D-20c"
                            value={camera.model}
                            onChange={(e) => updateCamera(camera.id, "model", e.target.value)}
                          />
                        </div>

                        <div>
                          <Label htmlFor={`camera-manufacturer-${camera.id}`}>Manufacturer</Label>
                          <Input
                            id={`camera-manufacturer-${camera.id}`}
                            placeholder="e.g., Hasselblad"
                            value={camera.manufacturer}
                            onChange={(e) => updateCamera(camera.id, "manufacturer", e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="mt-4">
                        <Label htmlFor={`camera-resolution-${camera.id}`}>Resolution</Label>
                        <Input
                          id={`camera-resolution-${camera.id}`}
                          placeholder="e.g., 20MP, 5.1K video"
                          value={camera.resolution}
                          onChange={(e) => updateCamera(camera.id, "resolution", e.target.value)}
                        />
                      </div>

                      <div className="mt-4">
                        <Label htmlFor={`camera-features-${camera.id}`}>Key Features</Label>
                        <Textarea
                          id={`camera-features-${camera.id}`}
                          placeholder="e.g., 4/3 CMOS sensor, adjustable aperture f/2.8-f/11"
                          className="min-h-[80px]"
                          value={camera.features}
                          onChange={(e) => updateCamera(camera.id, "features", e.target.value)}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Accessories Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-md font-medium">Accessories & Additional Equipment</h4>
              <Button type="button" variant="outline" size="sm" onClick={addAccessory}>
                <Plus className="h-4 w-4 mr-2" />
                Add Accessory
              </Button>
            </div>

            {accessories.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No accessories added. Click the button above to add your additional equipment.
              </p>
            ) : (
              <div className="space-y-4">
                {accessories.map((accessory, index) => (
                  <Card key={accessory.id}>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start mb-4">
                        <Badge variant="outline">Accessory {index + 1}</Badge>
                        <Button type="button" variant="ghost" size="sm" onClick={() => removeAccessory(accessory.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <Label htmlFor={`accessory-name-${accessory.id}`}>Accessory Name</Label>
                          <Input
                            id={`accessory-name-${accessory.id}`}
                            placeholder="e.g., ND Filter Set"
                            value={accessory.name}
                            onChange={(e) => updateAccessory(accessory.id, "name", e.target.value)}
                          />
                        </div>

                        <div>
                          <Label htmlFor={`accessory-type-${accessory.id}`}>Type</Label>
                          <Select
                            value={accessory.type}
                            onValueChange={(value) => updateAccessory(accessory.id, "type", value)}
                          >
                            <SelectTrigger id={`accessory-type-${accessory.id}`}>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="filters">Filters</SelectItem>
                              <SelectItem value="batteries">Batteries/Power</SelectItem>
                              <SelectItem value="storage">Storage/Memory</SelectItem>
                              <SelectItem value="gimbal">Gimbal/Stabilization</SelectItem>
                              <SelectItem value="controller">Controller/Remote</SelectItem>
                              <SelectItem value="software">Software</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="mt-4">
                        <Label htmlFor={`accessory-description-${accessory.id}`}>Description</Label>
                        <Textarea
                          id={`accessory-description-${accessory.id}`}
                          placeholder="Describe the accessory and how you use it"
                          className="min-h-[80px]"
                          value={accessory.description}
                          onChange={(e) => updateAccessory(accessory.id, "description", e.target.value)}
                        />
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

