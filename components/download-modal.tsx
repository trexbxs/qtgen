"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "@/hooks/use-toast"

interface DownloadModalProps {
  isOpen: boolean
  onClose: () => void
  onDownload: (clientName: string, projectLocation: string, template: string) => void
  format: string
}

export default function DownloadModal({ isOpen, onClose, onDownload, format }: DownloadModalProps) {
  const [clientName, setClientName] = useState("")
  const [projectLocation, setProjectLocation] = useState("")
  const [template, setTemplate] = useState("capitalD")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!clientName || !projectLocation) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      onDownload(clientName, projectLocation, template)
      onClose()
    } catch (error) {
      toast({
        title: "Download failed",
        description: "There was an error generating your download",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Enter Client Information</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="clientName" className="text-right">
              Client Name
            </Label>
            <Input
              id="clientName"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="col-span-3"
              placeholder="Enter client name"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="projectLocation" className="text-right">
              Project Location
            </Label>
            <Input
              id="projectLocation"
              value={projectLocation}
              onChange={(e) => setProjectLocation(e.target.value)}
              className="col-span-3"
              placeholder="Enter project location"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Template</Label>
            <RadioGroup value={template} onValueChange={setTemplate} className="col-span-3 flex gap-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="template1" id="template1" />
                <Label htmlFor="template1">Template 1</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="capitalD" id="capitalD" />
                <Label htmlFor="capitalD">Capital D</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Processing..." : `Download ${format.toUpperCase()}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

