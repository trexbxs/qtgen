"use client"

import { useState } from "react"
import type { ClientInfo } from "@/lib/types"
import { formatDate, capitalizeWords } from "@/lib/download-utils"

interface ClientInfoModalProps {
  show: boolean
  onClose: () => void
  onSubmit: (clientInfo: ClientInfo) => void
}

export default function ClientInfoModal({ show, onClose, onSubmit }: ClientInfoModalProps) {
  const [clientName, setClientName] = useState("")
  const [projectLocation, setProjectLocation] = useState("")
  const [template, setTemplate] = useState("capitalD")

  const handleSubmit = () => {
    if (!clientName) {
      document.getElementById("clientName")?.style.setProperty("border-color", "red")
      return
    }

    if (!projectLocation) {
      document.getElementById("projectLocation")?.style.setProperty("border-color", "red")
      return
    }

    document.getElementById("clientName")?.style.removeProperty("border-color")
    document.getElementById("projectLocation")?.style.removeProperty("border-color")

    if (clientName && projectLocation) {
      const currentDate = formatDate(new Date())
      onSubmit({
        clientName: capitalizeWords(clientName),
        projectLocation: capitalizeWords(projectLocation),
        currentDate,
        template,
      })
    }
  }

  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.removeProperty("border-color")
  }

  return show ? (
    <div className="slide-modal">
      <div className="slide-modal-content">
        <div className="slide-modal-header">
          <h4>Client Information</h4>
        </div>
        <div className="slide-modal-body">
          <div className="mb-3">
            <label htmlFor="clientName" className="form-label">
              Client Name
            </label>
            <input
              type="text"
              id="clientName"
              className="form-control"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              onFocus={(e) => e.target.classList.remove("is-invalid")}
              placeholder="Enter client name"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="projectLocation" className="form-label">
              Project Location
            </label>
            <input
              type="text"
              id="projectLocation"
              className="form-control"
              value={projectLocation}
              onChange={(e) => setProjectLocation(e.target.value)}
              onFocus={(e) => e.target.classList.remove("is-invalid")}
              placeholder="Enter project location"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Template</label>
            <div className="template-selector">
              <button
                type="button"
                className={`template-btn ${template === "template1" ? "active" : ""}`}
                onClick={() => setTemplate("template1")}
              >
                Template 1
              </button>
              <button
                type="button"
                className={`template-btn ${template === "capitalD" ? "active" : ""}`}
                onClick={() => setTemplate("capitalD")}
              >
                Capital D
              </button>
            </div>
          </div>
        </div>
        <div className="slide-modal-footer">
          <button
            type="button"
            className="slide-modal-btn cancel"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className="slide-modal-btn download"
            onClick={handleSubmit}
          >
            Download PDF
          </button>
        </div>
      </div>
    </div>
  ) : null
}

