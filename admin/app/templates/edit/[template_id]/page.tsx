"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Trash2, Loader2 } from "lucide-react"
import api from "@/lib/api"
import Link from "next/link"

type Blank = {
  _id: string,
  placeholder: string,
  ans_res?: { answer: string; result: string }[],
  section_id?: string,
  isDel?: boolean,
  question?: string
}

type Section = {
  _id: string
  title: string
}

export default function TemplateEditPage() {
  const params = useParams()
  const template_id = params?.template_id as string

  const [blanks, setBlanks] = useState<Blank[]>([])
  const [sections, setSections] = useState<Section[]>([])
  const [selectedBlankId, setSelectedBlankId] = useState<string | null>(null)
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null)
  const [radioValue, setRadioValue] = useState<"default" | "select">("default")
  const [ansResList, setAnsResList] = useState<{ answer: string; result: string }[]>([])
  const [originalAnsResList, setOriginalAnsResList] = useState<{ answer: string; result: string }[]>([])
  const [originalRadioValue, setOriginalRadioValue] = useState<"default" | "select">("default")
  const [addingSection, setAddingSection] = useState(false)
  const [newSectionTitle, setNewSectionTitle] = useState("")
  const [loading, setLoading] = useState(false)
  const [ansResDirty, setAnsResDirty] = useState(false)
  const [apiLoading, setApiLoading] = useState(false)
  const [question, setQuestion] = useState("")
  const [originalQuestion, setOriginalQuestion] = useState("")

  // Fetch blanks and sections
  useEffect(() => {
    if (!template_id) return
    api.get(`/api/admin/blank/${template_id}`).then(res => setBlanks(res.data))
    api.get(`/api/admin/section/${template_id}`).then(res => setSections(res.data))
  }, [template_id])

  // When blank is selected, update ansResList and radio
  useEffect(() => {
    const blank = blanks.find(b => b._id === selectedBlankId)
    if (blank) {
      if (blank.ans_res && blank.ans_res.length > 0) {
        setRadioValue("select")
        setAnsResList(blank.ans_res.map(ar => ({ ...ar })))
        setOriginalAnsResList(blank.ans_res.map(ar => ({ ...ar })))
        setOriginalRadioValue("select")
      } else {
        setRadioValue("default")
        setAnsResList([])
        setOriginalAnsResList([])
        setOriginalRadioValue("default")
      }
      setQuestion(blank.question || "")
      setOriginalQuestion(blank.question || "")
      setSelectedSectionId(blank.section_id || null)
      setAnsResDirty(false)
    } else {
      setRadioValue("default")
      setAnsResList([])
      setOriginalAnsResList([])
      setOriginalRadioValue("default")
      setSelectedSectionId(null)
      setAnsResDirty(false)
    }
  }, [selectedBlankId, blanks])

  // Handle radio change
  const handleRadioChange = (value: "default" | "select") => {
    setRadioValue(value)
    setAnsResDirty(true)
    if (value === "default") {
      setAnsResList([])
    } else if (value === "select" && ansResList.length === 0) {
      setAnsResList([{ answer: "", result: "" }])
    }
  }

  // Handle ans_res change
  const handleAnsResChange = (idx: number, field: "answer" | "result", value: string) => {
    setAnsResList(list =>
      list.map((ar, i) =>
        i === idx ? { ...ar, [field]: value, result: value } : ar
      )
    )
    setAnsResDirty(true)
  }

  // Add ans_res item
  const handleAddAnsRes = () => {
    setAnsResList(list => [...list, { answer: "", result: "" }])
    setAnsResDirty(true)
  }

  // Remove ans_res item
  const handleRemoveAnsRes = (idx: number) => {
    setAnsResList(list => list.filter((_, i) => i !== idx))
    setAnsResDirty(true)
  }

  // Save ans_res changes
  const handleSaveAnsRes = async () => {
    if (!selectedBlankId) return
    setApiLoading(true)
    const update: Partial<Blank> = radioValue === "default"
      ? { ans_res: undefined }
      : { ans_res: ansResList }
    await api.put(`/api/admin/blank/${selectedBlankId}`, { question, ...update })
    // Refresh blanks
    const res = await api.get(`/api/admin/blank/${template_id}`)
    setBlanks(res.data)
    setAnsResDirty(false)
    setApiLoading(false)
  }

  // Cancel ans_res changes
  const handleCancelAnsRes = () => {
    setRadioValue(originalRadioValue)
    setAnsResList(originalAnsResList.map(ar => ({ ...ar })))
    setQuestion(originalQuestion)
    setAnsResDirty(false)
  }

  // Section add
  const handleAddSection = async () => {
    if (!newSectionTitle.trim()) return
    setLoading(true)
    setApiLoading(true)
    await api.post(`/api/admin/section/${template_id}`, { title: newSectionTitle })
    setNewSectionTitle("")
    setAddingSection(false)
    const res = await api.get(`/api/admin/section/${template_id}`)
    setSections(res.data)
    setLoading(false)
    setApiLoading(false)
  }

  // Section click
  const handleSectionClick = async (sectionId: string) => {
    setSelectedSectionId(sectionId)
    if (selectedBlankId && !ansResDirty) {
      setApiLoading(true)
      await api.put(`/api/admin/blank/${selectedBlankId}`, { section_id: sectionId })
      // Refresh blanks to reflect section_id change
      const res = await api.get(`/api/admin/blank/${template_id}`)
      setBlanks(res.data)
      setApiLoading(false)
    }
  }

  // Blank click
  const handleBlankClick = (blankId: string) => {
    if (ansResDirty) return // Prevent changing blank if unsaved changes
    setSelectedBlankId(blankId)
  }

  // Highlight section if blank has section_id
  useEffect(() => {
    if (selectedBlankId) {
      const blank = blanks.find(b => b._id === selectedBlankId)
      if (blank && blank.section_id) setSelectedSectionId(blank.section_id)
    }
  }, [selectedBlankId, blanks])

  // Section tick logic
  const isSectionSelected = (sectionId: string) => selectedSectionId === sectionId

  // + button enable logic
  const canAddAnsRes = radioValue === "select" && ansResList.every(ar => ar.answer && ar.result)

  // Utility function
  function formatQuestion(q?: string) {
    if (!q) return ""
    let str = q.replace(/_/g, " ")
    if (str.endsWith("Q")) {
      str = str.slice(0, -1) + "?"
    } else if (str.endsWith("P")) {
      str = str.slice(0, -1) + "."
    }
    return str
  }

  return (
    <div className="flex flex-col w-full min-h-[100vh] gap-4 relative">
      {/* Back to Templates Button */}
      <div className="w-full flex justify-start mb-6 mt-4 px-2">
        <Link href="/templates">
          <Button variant="outline" className="text-base px-4 py-2">
            &larr; Back to Templates
          </Button>
        </Link>
      </div>
      <div className="flex flex-1 gap-4">
        {/* 1st div: Blank List */}
        <div className="w-[30%] border rounded-lg p-4 bg-white flex flex-col gap-2">
          <h2 className="font-bold mb-2">Blanks</h2>
          {blanks.map(blank => (
            <div
              key={blank._id}
              className={`p-2 rounded cursor-pointer ${selectedBlankId === blank._id ? "bg-blue-100 font-semibold" : "hover:bg-gray-100"} ${ansResDirty ? "pointer-events-none opacity-60" : ""}`}
              onClick={() => handleBlankClick(blank._id)}
            >
              {formatQuestion(blank.placeholder)}
            </div>
          ))}
        </div>

        {/* 2nd div: Blank Detail */}
        <div className="w-[40%] border rounded-lg p-4 bg-white flex flex-col gap-4">
          <div className="flex gap-6 items-center">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={radioValue === "default"}
                onChange={() => handleRadioChange("default")}
                disabled={!selectedBlankId}
              />
              Input
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                checked={radioValue === "select"}
                onChange={() => handleRadioChange("select")}
                disabled={!selectedBlankId}
              />
              Select
            </label>
          </div>
          <Input
            value={question}
            onChange={e => setQuestion(e.target.value)}
            disabled={!selectedBlankId}
            placeholder="Question"
          />
          {radioValue === "select" && (
            <div className="flex flex-col gap-2">
              {ansResList.map((ar, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <Input
                    value={ar.answer}
                    placeholder="Answer"
                    onChange={e => handleAnsResChange(idx, "answer", e.target.value)}
                    className="w-2/3"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => handleRemoveAnsRes(idx)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                className="mt-2 w-fit"
                onClick={handleAddAnsRes}
                disabled={!canAddAnsRes}
              >
                <Plus className="w-4 h-4 mr-1" /> Add
              </Button>
            </div>
          )}
          {/* Save/Cancel Buttons */}
          <div className="flex gap-2 justify-end mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancelAnsRes}
              disabled={!ansResDirty && question.length === 0}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSaveAnsRes}
              disabled={!ansResDirty && question.length === 0}
            >
              Save Changes
            </Button>
          </div>
        </div>

        {/* 3rd div: Section List */}
        <div className="w-[30%] border rounded-lg p-4 bg-white flex flex-col gap-2">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-bold">Sections</h2>
            <Button size="sm" onClick={() => setAddingSection(true)}>
              <Plus className="w-4 h-4 mr-1" /> Section
            </Button>
          </div>
          {sections.map(section => (
            <div
              key={section._id}
              className={`p-2 rounded cursor-pointer flex items-center gap-2 ${isSectionSelected(section._id) && selectedBlankId ? "bg-blue-100 font-semibold" : "hover:bg-gray-100"}`}
              onClick={() => selectedBlankId && !ansResDirty && handleSectionClick(section._id)}
            >
              <input
                type="radio"
                checked={!!(isSectionSelected(section._id) && selectedBlankId)}
                readOnly
              />
              {section.title}
            </div>
          ))}
          {/* Add Section Modal */}
          {addingSection && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
              <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6 relative">
                <h3 className="font-bold mb-2">Add Section</h3>
                <Input
                  value={newSectionTitle}
                  onChange={e => setNewSectionTitle(e.target.value)}
                  placeholder="Section title"
                  className="mb-4"
                />
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setAddingSection(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddSection} disabled={loading || !newSectionTitle.trim()}>
                    Add
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {apiLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="flex flex-col items-center">
            <Loader2 className="animate-spin w-12 h-12 text-blue-600 mb-4" />
            <span className="text-lg font-semibold text-blue-700">Loading...</span>
          </div>
        </div>
      )}
    </div>
  )
}