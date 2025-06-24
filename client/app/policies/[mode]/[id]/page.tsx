"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import api from "@/lib/api"
import { useEffect, useRef, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog"

type AnsRes = { answer: string; result: string }
type Blank = {
    _id: string
    question: string
    ans_res?: AnsRes[]
    answer: string
    placeholder?: string
}
type Section = {
    _id: string
    title: string
    isDel?: boolean
    blanks: Blank[]
}
type Policy = {
    _id: string
    template_id: {
        _id: string
        title: string
        description: string
        docx: string
        created_at: string
        updated_at: string
    }
    user_id: string
    created_at: string
    updated_at: string
    sections: Section[]
}

export default function PolicyEditOrViewPage() {
    const { mode, id } = useParams()
    const router = useRouter()
    const [policy, setPolicy] = useState<Policy | null>(null)
    const [loading, setLoading] = useState(true)
    const [selectedSection, setSelectedSection] = useState<string | null>(null)
    const [blankStep, setBlankStep] = useState(0)
    const [answers, setAnswers] = useState<{ blank_id: string; answer: string }[]>([])
    const [saving, setSaving] = useState(false)
    const [showPreviewConfirm, setShowPreviewConfirm] = useState(false)
    const [pendingPreview, setPendingPreview] = useState(false)
    const [defaultChecked, setDefaultChecked] = useState<{ [blankId: string]: boolean }>({})
    const [message, setMessage] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)
    const messageTimeout = useRef<NodeJS.Timeout | null>(null)

    // Auto-hide messages after 5 seconds
    useEffect(() => {
        if (message || error) {
            if (messageTimeout.current) clearTimeout(messageTimeout.current)
            messageTimeout.current = setTimeout(() => {
                setMessage(null)
                setError(null)
            }, 5000)
        }
        return () => {
            if (messageTimeout.current) clearTimeout(messageTimeout.current)
        }
    }, [message, error])

    useEffect(() => {
        const fetchPolicy = async () => {
            setLoading(true)
            const res = await api.get(`/api/policy/${id}`)
            const data = res.data
            setPolicy(data)
            const firstSection = data.sections.find((s: Section) => !s.isDel)
            setSelectedSection(firstSection?._id || null)
            setBlankStep(0)
            const blanks = data.sections.map((s: Section) => s.blanks).flat()
            const userAnswers = data.userAnswers || []
            const answersArr: { blank_id: string; answer: string; checked?: boolean }[] = blanks
                .filter((blank: Blank) => blank.answer || userAnswers.find((ua: any) => ua.question === blank.question))
                .map((blank: Blank) => {
                    if (blank.answer) {
                        return { blank_id: blank._id, answer: blank.answer }
                    }
                    const userAns = userAnswers.find((ua: any) => ua.question === blank.question)
                    if (userAns) {
                        return { blank_id: blank._id, answer: userAns.answer, checked: true }
                    }
                })
                .filter(Boolean) as { blank_id: string; answer: string; checked?: boolean }[]
            setAnswers(answersArr)
            const checkedMap: { [blankId: string]: boolean } = {}
            answersArr.forEach(ans => {
                if (ans.checked) checkedMap[ans.blank_id] = true
            })
            setDefaultChecked(checkedMap)
            setLoading(false)
        }
        fetchPolicy()
    }, [id])

    // Section/blank helpers
    const sectionList = policy?.sections?.filter(s => !s.isDel) || []
    const currentSection = sectionList.find(s => s._id === selectedSection)
    const blanks = currentSection?.blanks || []
    const allBlanks = sectionList.flatMap(section => section?.blanks)
    const currentBlank = blanks[blankStep] || null
    const selectOptions = currentBlank?.ans_res?.filter(opt => opt.answer) || []

    const getCurrentAnswer = () => {
        const found = answers.find(a => a.blank_id === currentBlank?._id)
        return found ? found.answer : ""
    }

    // Handlers
    const handleSectionClick = (sid: string) => {
        setSelectedSection(sid)
        setBlankStep(0)
    }
    const handlePrev = () => setBlankStep(s => Math.max(0, s - 1))
    const handleNext = () => setBlankStep(s => Math.min(blanks.length - 1, s + 1))

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value
        if (!currentBlank) return
        setAnswers(prev => {
            const others = prev.filter(a => a.blank_id !== currentBlank._id)
            return [...others, { blank_id: currentBlank._id, answer: val }]
        })
    }

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedAnswer = e.target.value
        if (!currentBlank) return
        const found = currentBlank.ans_res?.find(opt => opt.answer === selectedAnswer)
        setAnswers(prev => {
            const others = prev.filter(a => a.blank_id !== currentBlank._id)
            return [...others, { blank_id: currentBlank._id, answer: found?.result || "" }]
        })
    }

    const handleSave = async () => {
        setSaving(true)
        setMessage(null)
        setError(null)
        const payload = answers.map(ans => ({
            ...ans,
            isDefault: defaultChecked[ans.blank_id]
        }))
        try {
            await api.put(`/api/policy/${id}`, { answers: payload })
            setMessage("Answers saved successfully.")
        } catch {
            setError("Failed to save answers.")
        }
        setSaving(false)
    }

    const handleBack = () => router.push("/policies/mine")

    function renderQuestion(q?: string) {
        if (!q) return ""
        return q.replace(/\$\{([^\}]+)\}/g, (match, word) => {
            const refBlank = allBlanks.find(b => b.placeholder === word)
            if (!refBlank) return match
            const ansObj = answers.find(a => a.blank_id === refBlank._id)
            return ansObj ? ansObj.answer : match
        })
    }

    const handlePreview = async (policyId: string, saveFirst = false) => {
        setMessage(null)
        setError(null)
        if (saveFirst) {
            setSaving(true)
            try {
                await api.put(`/api/policy/${id}`, { answers })
                setMessage("Answers saved. Generating preview...")
            } catch {
                setError("Failed to save answers before preview.")
                setSaving(false)
                return
            }
            setSaving(false)
        }
        const url = `/api/policy/preview/${policyId}`
        const newWindow = window.open("", "_blank")
        try {
            const res = await api.get(url, { responseType: "blob" })
            const blob = new Blob([res.data], { type: "application/pdf" })
            const blobUrl = window.URL.createObjectURL(blob)
            if (newWindow) {
                newWindow.location.href = blobUrl
                setTimeout(() => window.URL.revokeObjectURL(blobUrl), 1000)
            }
            setMessage("Preview generated.")
        } catch {
            if (newWindow) newWindow.close()
            setError("Failed to generate preview.")
        }
    }

    const handlePreviewClick = () => setShowPreviewConfirm(true)

    const handlePreviewConfirm = async (action: "yes" | "no" | "cancel") => {
        setShowPreviewConfirm(false)
        if (action === "yes") {
            setPendingPreview(true)
            await handlePreview(policy!._id, true)
            setPendingPreview(false)
        } else if (action === "no") {
            await handlePreview(policy!._id, false)
        }
    }

    const handleDefaultCheckbox = (checked: boolean) => {
        if (!currentBlank) return
        setDefaultChecked(prev => ({
            ...prev,
            [currentBlank._id]: checked
        }))
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <span className="text-lg font-semibold">Loading...</span>
            </div>
        )
    }

    if (!policy) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <span className="text-lg font-semibold text-red-600">Policy not found</span>
            </div>
        )
    }

    return (
        <div className="flex flex-col w-full min-h-[100vh] gap-4 p-4">
            {/* Header */}
            <div className="flex items-center justify-between w-full px-2 py-4 border-b bg-white">
                <Button variant="outline" onClick={handleBack}>
                    &larr; Back to the list
                </Button>
                <Button onClick={handleSave} disabled={saving}>
                    {saving ? "Saving..." : "Save"}
                </Button>
            </div>
            {message && (
                <div className="w-full flex justify-center mt-2">
                    <span className="text-green-600 font-medium">{message}</span>
                </div>
            )}
            {error && (
                <div className="w-full flex justify-center mt-2">
                    <span className="text-red-600 font-medium">{error}</span>
                </div>
            )}
            <div className="flex w-full flex-1 gap-4">
                {/* Left: Section List */}
                <div className="w-[30%] border rounded-lg p-4 bg-white flex flex-col justify-between">
                    <div>
                        <h2 className="font-bold mb-2">Sections</h2>
                        <div className="flex flex-col gap-2">
                            {sectionList.map(section => (
                                <div
                                    key={section._id}
                                    className={`p-2 rounded cursor-pointer ${selectedSection === section._id ? "bg-blue-100 font-semibold" : "hover:bg-gray-100"}`}
                                    onClick={() => handleSectionClick(section._id)}
                                >
                                    {section.title}
                                </div>
                            ))}
                        </div>
                    </div>
                    <Button
                        className="mt-8"
                        variant="outline"
                        onClick={handlePreviewClick}
                    >
                        Preview
                    </Button>
                </div>

                {/* Right: Blanks of selected section */}
                <div className="w-[85%] border rounded-lg p-4 bg-white flex flex-col">
                    {blanks.length === 0 ? (
                        <div className="text-gray-500">No blanks in this section.</div>
                    ) : (
                        <div className="w-full max-w-xl flex flex-col gap-6">
                            <div className="flex flex-col gap-2">
                                <div className="text-base font-semibold mb-1">
                                    Question {blankStep + 1} of {blanks.length}
                                </div>
                                <div className="text-lg font-bold mb-2">{renderQuestion(currentBlank?.question)}</div>
                                {currentBlank?.ans_res && currentBlank.ans_res.length > 0 ? (
                                    <select
                                        className="border rounded px-3 py-2"
                                        value={
                                            (() => {
                                                const found = answers.find(a => a.blank_id === currentBlank._id)
                                                if (!found) return ""
                                                const ansRes = currentBlank.ans_res?.find(opt => opt.result === found.answer)
                                                return ansRes?.answer || ""
                                            })()
                                        }
                                        onChange={handleSelectChange}
                                    >
                                        <option value="">Select an answer</option>
                                        {selectOptions.map((opt, idx) => (
                                            <option key={idx} value={opt.answer}>
                                                {opt.answer}
                                            </option>
                                        ))}
                                    </select>
                                ) : (
                                    <>
                                        <Input
                                            value={getCurrentAnswer()}
                                            onChange={handleInputChange}
                                            placeholder="Your answer..."
                                        />
                                    </>
                                )}
                            </div>
                            <div className="flex justify-between mt-4">
                                <Button
                                    variant="outline"
                                    onClick={handlePrev}
                                    disabled={blankStep === 0}
                                >
                                    Prev
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={handleNext}
                                    disabled={blankStep === blanks.length - 1 || getCurrentAnswer() === ""}
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <Dialog open={showPreviewConfirm} onOpenChange={setShowPreviewConfirm}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Do you want to save answers now and preview?</DialogTitle>
                    </DialogHeader>
                    <DialogFooter className="flex flex-row gap-2 justify-end">
                        <Button
                            variant="default"
                            onClick={() => handlePreviewConfirm("yes")}
                            disabled={pendingPreview}
                        >
                            Yes
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => handlePreviewConfirm("no")}
                            disabled={pendingPreview}
                        >
                            No
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={() => handlePreviewConfirm("cancel")}
                            disabled={pendingPreview}
                        >
                            Cancel
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}