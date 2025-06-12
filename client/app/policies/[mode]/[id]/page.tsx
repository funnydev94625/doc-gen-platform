"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import api from "@/lib/api"
import { Document, Page, pdfjs } from "react-pdf"
import "react-pdf/dist/esm/Page/AnnotationLayer.css"
import "react-pdf/dist/esm/Page/TextLayer.css"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog"

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`

type AnsRes = { answer: string; result: string }
type Blank = {
    _id: string
    question: string
    ans_res?: AnsRes[],
    answer: string
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
    const [pdfUrl, setPdfUrl] = useState<string | null>(null)
    const [numPages, setNumPages] = useState<number | null>(null)
    const [pageNumber, setPageNumber] = useState(1)
    const [showPreviewConfirm, setShowPreviewConfirm] = useState(false)
    const [pendingPreview, setPendingPreview] = useState(false)

    useEffect(() => {
        const fetchPolicy = async () => {
            setLoading(true)
            const res = await api.get(`/api/policy/${id}`)
            const data = res.data
            setPolicy(data)
            // Select first non-deleted section by default
            const firstSection = data.sections.find((s: Section) => !s.isDel)
            setSelectedSection(firstSection?._id || null)
            setBlankStep(0)
            const blanks = data.sections.map((s: Section) => s.blanks).flat()
            setAnswers(
                blanks
                    .filter((b: Blank): b is Blank & { ans_res: AnsRes[] } => !!b.answer)
                    .map(
                        (blank: Blank & { ans_res: AnsRes[] }): { blank_id: string; answer: string } => ({
                            blank_id: blank._id,
                            answer: blank.answer,
                        })
                    )
            )
            console.log(
                blanks
                    .filter((b: Blank): b is Blank & { ans_res: AnsRes[] } => !!b.answer)
                    .map(
                        (blank: Blank & { ans_res: AnsRes[] }): { blank_id: string; answer: string } => ({
                            blank_id: blank._id,
                            answer: blank.answer,
                        })
                    )
            )
            setLoading(false)
        }
        fetchPolicy()
    }, [id])

    useEffect(() => {
        if (mode === "view" && id) {
            const fetchPdf = async () => {
                try {
                    const res = await api.get(`/api/policy/preview/${id}`, { responseType: "blob" });
                    const blob = new Blob([res.data], { type: "application/pdf" });
                    const url = window.URL.createObjectURL(blob);
                    setPdfUrl(url);
                } catch (err) {
                    setPdfUrl(null);
                }
            };
            fetchPdf();
        }
    }, [mode, id])

    // Get current section and blanks
    const sectionList = policy?.sections?.filter(s => !s.isDel) || []
    const currentSection = sectionList.find(s => s._id === selectedSection)
    const blanks = currentSection?.blanks || []
    const currentBlank = blanks[blankStep] || null

    // For select element, get options from ans_res
    const selectOptions = currentBlank?.ans_res?.filter(opt => opt.answer) || []

    // Find current answer value from answers state
    const getCurrentAnswer = () => {
        console.log(answers)
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

    // Input change handler for blanks without ans_res
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value
        if (!currentBlank) return
        setAnswers(prev => {
            const others = prev.filter(a => a.blank_id !== currentBlank._id)
            return [...others, { blank_id: currentBlank._id, answer: val }]
        })
    }

    // Select change handler for blanks with ans_res
    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedAnswer = e.target.value
        if (!currentBlank) return
        // Find the result for the selected answer
        const found = currentBlank.ans_res?.find(opt => opt.answer === selectedAnswer)
        setAnswers(prev => {
            const others = prev.filter(a => a.blank_id !== currentBlank._id)
            return [...others, { blank_id: currentBlank._id, answer: found?.result || "" }]
        })
    }

    // Save handler
    const handleSave = async () => {
        setSaving(true)
        try {
            await api.put(`/api/policy/${id}`, { answers })
            // Optionally, refetch or show a success message
        } catch (err) {
            // Optionally, show error
        }
        setSaving(false)
    }

    // Header handlers
    const handleBack = () => router.push("/policies/mine")

    // Utility to format question string
    function formatQuestion(q?: string) {
        if (!q) return "";
        let str = q.replace(/_/g, " ");
        if (str.endsWith("Q")) {
            str = str.slice(0, -1) + "?";
        } else if (str.endsWith("P")) {
            str = str.slice(0, -1) + ".";
        }
        return str;
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

    const handlePreview = async (policyId: string, saveFirst = false) => {
        if (saveFirst) {
            setSaving(true)
            try {
                await api.put(`/api/policy/${id}`, { answers })
            } catch (err) {
                // Optionally, show error
            }
            setSaving(false)
        }
        const url = `/api/policy/preview/${policyId}`;
        const newWindow = window.open("", "_blank");
        try {
            const res = await api.get(url, { responseType: "blob" });
            const blob = new Blob([res.data], { type: "application/pdf" });
            const blobUrl = window.URL.createObjectURL(blob);
            if (newWindow) {
                newWindow.location.href = blobUrl;
                setTimeout(() => window.URL.revokeObjectURL(blobUrl), 1000);
            }
        } catch (err) {
            if (newWindow) newWindow.close();
            console.error('Error previewing template:', err);
        }
    };

    // Handler for preview button click
    const handlePreviewClick = () => {
        setShowPreviewConfirm(true)
    }

    // Handler for modal actions
    const handlePreviewConfirm = async (action: "yes" | "no" | "cancel") => {
        setShowPreviewConfirm(false)
        if (action === "yes") {
            setPendingPreview(true)
            await handlePreview(policy._id, true)
            setPendingPreview(false)
        } else if (action === "no") {
            await handlePreview(policy._id, false)
        }
        // cancel does nothing
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
                                <div className="text-lg font-bold mb-2">{currentBlank?.question}</div>
                                {currentBlank?.ans_res && currentBlank.ans_res.length > 0 ? (
                                    <select
                                        className="border rounded px-3 py-2"
                                        value={
                                            // Find the answer in answers, then find the corresponding answer in ans_res
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
                                    <Input
                                        value={getCurrentAnswer()}
                                        onChange={handleInputChange}
                                        placeholder="Your answer..."
                                    />
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