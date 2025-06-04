'use client'

import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import api from '@/lib/api' // Assuming you have a shared API utility
import PDFViewer from '@/components/PDFViewer'
import { toast } from "sonner"
import { Toaster } from "@/components/ui/sonner"

type Template = {
    desccription: string;
    title: string;
    type: number;
    docx: string;
}

type Element = {
    _id: string;
    template_id: string;
    type: number; // 0 for input, 1 for select
    question: string;
    placeholder: string;
    isDel: boolean;
    section_id?: string;
    answer_result?: Record<string, string> | string[]; // For select options
    answer_value?: string | string[]; // To store the user's answer
};

type Section = {
    _id: string;
    title: string;
    template_id: string;
    isDel: boolean;
};

export default function PolicyPage() {
    const [activeTab, setActiveTab] = useState('preview')
    const [sections, setSections] = useState<Section[]>([])
    const [elements, setElements] = useState<Element[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null)
    const [elementAnswers, setElementAnswers] = useState<Record<string, string | string[]>>({});
    const [tempAnswers, setTempAnswers] = useState<Record<string, string | string[]>>({});
    const [currentPage, setCurrentPage] = useState(1);
    const [isSaving, setIsSaving] = useState(false);
    const [template, setTemplate] = useState<Template | null>(null)

    const router = useRouter()
    const { id } = useParams()
    const policyId = id

    useEffect(() => {
        const fetchData = async () => {
            try {
                // First fetch policy information to get template_id
                const policyRes = await api.get(`/api/policies/${policyId}`);
                const templateId = policyRes.data.template_id;

                // Then fetch all required data using the template_id
                const [sectionsRes, elementsRes, templateRes] = await Promise.all([
                    api.get(`/api/admin/section/${templateId}`),
                    api.get(`/api/admin/template/element/${templateId}`),
                    api.get(`/api/templates/${templateId}`)
                ]);
                setTemplate(templateRes.data)
                const sortedSections = sectionsRes.data
                    .filter((section: Section) => !section.isDel)
                    .sort((a: Section, b: Section) => a.title.localeCompare(b.title));

                const activeElements = elementsRes.data.filter((element: Element) => !element.isDel);

                setSections(sortedSections);
                setElements(activeElements);

                // Initialize answers state with fetched answers
                const initialAnswers: Record<string, string | string[]> = {};
                activeElements.forEach((element: Element) => {
                    // Find if there's an existing answer for this element
                    // Initialize with default value based on element type
                    if (element.type === 0) {
                        initialAnswers[element._id] = '';
                    } else if (element.type === 1 && Array.isArray(element.answer_result) && element.answer_result.length > 0) {
                        initialAnswers[element._id] = element.answer_result[0];
                    } else if (element.type === 1 && typeof element.answer_result === 'object' && element.answer_result !== null) {
                        const options = Object.values(element.answer_result);
                        if (options.length > 0) {
                            initialAnswers[element._id] = options[0];
                        }
                    } else {
                        initialAnswers[element._id] = '';
                    }
                });
                setElementAnswers(initialAnswers);

            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [policyId]);

    const handleElementAnswerChange = (elementId: string, value: string | string[]) => {
        // Update temporary answers
        setTempAnswers(prev => ({ ...prev, [elementId]: value }));
    };

    const handleSaveChanges = async () => {
        try {
            setIsSaving(true);
            // Convert tempAnswers to array format for API
            const answersToSave = Object.entries(tempAnswers).map(([element_id, answer]) => ({
                element_id,
                answer
            }));

            // Save to backend using policyId
            await api.post(`/api/answers/policy/${policyId}`, answersToSave);

            // Update main answers state with temp answers
            setElementAnswers(prev => ({ ...prev, ...tempAnswers }));

            // Clear temp answers
            setTempAnswers({});

            // Show success toast
            toast.success("Answers saved successfully!", {
                description: "Your changes have been saved.",
                duration: 3000,
            });
        } catch (error) {
            console.error('Error saving answers:', error);
            toast.error("Failed to save answers", {
                description: "Please try again later.",
                duration: 3000,
            });
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        // Clear temporary changes
        setTempAnswers({});
    };

    // Get the current value for an element (either temp or saved)
    const getElementValue = (elementId: string) => {
        return tempAnswers[elementId] !== undefined ? tempAnswers[elementId] : elementAnswers[elementId];
    };

    const getElementsForSelectedSection = () => {
        if (!selectedSectionId) return [];
        return elements.filter(element => element.section_id === selectedSectionId);
    };

    const getCurrentElement = () => {
        const sectionElements = getElementsForSelectedSection();
        const index = currentPage - 1;
        return sectionElements[index] || null;
    };

    const totalPages = () => {
        const sectionElements = getElementsForSelectedSection();
        return Math.max(1, sectionElements.length);
    };

    const handlePreviousPage = () => {
        setCurrentPage(prev => Math.max(1, prev - 1));
    };

    const handleNextPage = () => {
        setCurrentPage(prev => Math.min(totalPages(), prev + 1));
    };

    // Reset current page when section changes
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedSectionId]);

    const renderElementInput = (element: Element) => {
        const value = getElementValue(element._id);

        switch (element.type) {
            case 0: // Text Input
                return (
                    <div key={element._id} className="mb-4">
                        <h3 className="text-lg font-semibold mb-2">{element.question}</h3>
                        <Input
                            type="text"
                            placeholder={element.placeholder}
                            value={typeof value === 'string' ? value : ''}
                            onChange={(e) => handleElementAnswerChange(element._id, e.target.value)}
                            className="w-full"
                        />
                    </div>
                );
            case 1: // Radio Select
                const options = Array.isArray(element.answer_result)
                    ? element.answer_result
                    : (typeof element.answer_result === 'object' && element.answer_result !== null
                        ? Object.values(element.answer_result)
                        : []);
                return (
                    <div key={element._id} className="mb-4">
                        <h3 className="text-lg font-semibold mb-2">{element.question}</h3>
                        <div className="flex flex-col gap-2 mt-2">
                            {options.map((option, idx) => (
                                <label key={idx} className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name={`element-${element._id}`}
                                        value={option}
                                        checked={value === option}
                                        onChange={(e) => handleElementAnswerChange(element._id, e.target.value)}
                                        className="text-blue-600 focus:ring-blue-500"
                                    />
                                    <span className="text-gray-700">{option}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                );
            default:
                return null; // Or a message indicating unsupported type
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Toaster />
            {/* Back Button */}
            <div className="p-4">
                <Button
                    variant="ghost"
                    onClick={() => router.push('/policies')}
                    className="flex items-center gap-2"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Policies
                </Button>
            </div>

            {/* Tabs */}
            <div className="px-4 h-[calc(100vh-80px)] flex flex-col">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex-1 flex flex-col">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="preview">Preview</TabsTrigger>
                        <TabsTrigger value="customize">Customize</TabsTrigger>
                    </TabsList>

                    <TabsContent value="preview" className="mt-4 flex-1">
                        {/* Your preview rendering logic here */}
                        <div className="p-4 h-[calc(100vh-180px)]">
                            {loading ? (
                                <p>Loading preview...</p>
                            ) : (
                                <div className="h-full">
                                    <PDFViewer policyId={(Array.isArray(policyId) ? policyId[0] : policyId) || ''} fileUrl={template?.docx || ""} />
                                </div>
                            )}
                        </div>
                    </TabsContent>

                    <TabsContent value="customize" className="mt-4 flex-1 flex overflow-hidden">
                        <div className="flex gap-4 w-full h-full">
                            {/* Sections List (20%) */}
                            <div className="w-[20%] bg-white rounded-lg shadow-sm overflow-hidden flex flex-col">
                                <div className="p-4 border-b">
                                    <h2 className="font-semibold">Sections</h2>
                                </div>
                                <div className="flex-1 overflow-y-auto">
                                    {loading ? (
                                        <div className="p-4 text-gray-500">Loading sections...</div>
                                    ) : (
                                        sections.map(section => (
                                            <div
                                                key={section._id}
                                                onClick={() => setSelectedSectionId(section._id)}
                                                className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${selectedSectionId === section._id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                                                    }`}
                                            >
                                                <h3 className="font-medium">{section.title}</h3>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            {/* Elements Editor (80%) */}
                            <div className="w-[80%] bg-white rounded-lg shadow-sm overflow-hidden flex flex-col">
                                <CardHeader>
                                    <CardTitle>Customize Section: {sections.find(s => s._id === selectedSectionId)?.title || 'Select a Section'}</CardTitle>
                                </CardHeader>
                                <CardContent className="flex-1 overflow-y-auto">
                                    {selectedSectionId ? (
                                        loading ? (
                                            <div className="text-gray-500">Loading elements for section...</div>
                                        ) : (
                                            <div className="h-full flex flex-col">
                                                <div className="flex-1">
                                                    {getCurrentElement() && renderElementInput(getCurrentElement())}
                                                </div>
                                            </div>
                                        )
                                    ) : (
                                        <div className="h-full flex items-center justify-center text-gray-500">
                                            Select a section to customize its elements
                                        </div>
                                    )}
                                </CardContent>
                                {selectedSectionId && !loading && (
                                    <>
                                        <div className="flex justify-between items-center px-6 py-4 border-t">
                                            <Button
                                                variant="outline"
                                                onClick={handlePreviousPage}
                                                disabled={currentPage === 1}
                                            >
                                                Previous
                                            </Button>
                                            <span className="text-sm text-gray-600">
                                                Page {currentPage} of {totalPages()}
                                            </span>
                                            <Button
                                                variant="outline"
                                                onClick={handleNextPage}
                                                disabled={currentPage === totalPages()}
                                            >
                                                Next
                                            </Button>
                                        </div>
                                        <CardFooter className="flex justify-end gap-2 border-t p-4">
                                            <Button
                                                variant="outline"
                                                onClick={handleCancel}
                                                disabled={Object.keys(tempAnswers).length === 0}
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                onClick={handleSaveChanges}
                                                disabled={Object.keys(tempAnswers).length === 0 || isSaving}
                                            >
                                                {isSaving ? 'Saving...' : 'Save Changes'}
                                            </Button>
                                        </CardFooter>
                                    </>
                                )}
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}

