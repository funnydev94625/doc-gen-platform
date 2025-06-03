"use client";

import React, { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import WordEditor from "@/components/WordEditor";
import api from "@/lib/api";

type AnswerSet = { answer: string; result: string };
type Element = {
  template_id: string;
  placeholder: string;
  question: string;
  type: number;
  answer_result: object;
};

type Template = {
  desccription: string;
  title: string;
  type: number;
  docx: string;
}

const regexStrict = /\{\{[^}]+\}\}/;

export default function PolicySectionEditorPage() {
  const [questionType, setQuestionType] = useState<"input" | "select">("input");
  const [question, setQuestion] = useState("");
  const [answerSets, setAnswerSets] = useState<AnswerSet[]>([{ answer: "", result: "" }]);
  const { id } = useParams();
  const [selected, setSelected] = useState("");
  const [elementList, setElementList] = useState<Element[]>([]);
  const [showQuestionEdit, setShowQuestionEdit] = useState(false);
  const [edited, setEdited] = useState(false);
  const wordEditorRef = useRef<any>(null);
  const fileRef = useRef<HTMLInputElement>(null!);
  const [template, setTemplate] = useState<Template | null>(null);

  const elementShow = regexStrict.test(selected);
  const idString = Array.isArray(id) ? id[0] : id ?? "";

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const response = await api.get(`/api/admin/template/${id}`);
        setElementList(response.data.elements);
        setTemplate(response.data.template);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTemplate();
  }, [id]);

  useEffect(() => {
    if (questionType === "input") {
      setEdited(question.trim() !== "");
    } else {
      setEdited(
        question.trim() !== "" &&
        answerSets.every(set => set.answer.trim() !== "" && set.result.trim() !== "")
      );
    }
  }, [question, answerSets, questionType]);

  const handleAddClick = () => {
    if (!elementShow) return;
    setShowQuestionEdit(true);
  };

  const handleAddAnswerSet = () => {
    setAnswerSets(prev => [...prev, { answer: "", result: "" }]);
  };

  const handleAnswerSetChange = (idx: number, field: "answer" | "result", value: string) => {
    setAnswerSets(prev => prev.map((set, i) => i === idx ? { ...set, [field]: value } : set));
  };

  const handleRemoveAnswerSet = (idx: number) => {
    setAnswerSets(prev => prev.filter((_, i) => i !== idx));
  };

  const handleElementSaveButton = async () => {
    const payload: Element = {
      placeholder: selected,
      template_id: idString,
      question,
      type: questionType === "select" ? 1 : 0,
      answer_result: questionType === "select" 
        ? Object.fromEntries(answerSets.map(item => [item.answer, item.result]))
        : {}
    };

    try {
      await api.post('/api/admin/template/element', payload);
      setElementList([payload, ...elementList]);
      setShowQuestionEdit(false);
    } catch (error) {
      console.error('Failed to save element:', error);
    }
  };

  const handlePolicySave = async () => {
    if (!wordEditorRef.current) return;
    
    try {
      const docxBlob = await wordEditorRef.current.getEditedDocx();
      if (!docxBlob) throw new Error("Failed to get the edited document");

      const formData = new FormData();
      formData.append("file", docxBlob, "policy.docx");
      formData.append("template_id", idString);

      await api.post("/api/admin/policies/upload-docx", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      
      window.location.href = `/policies/elements/${idString}`;
    } catch (error) {
      console.error("Failed to upload policy document:", error);
      alert("Failed to upload policy document.");
    }
  };

  return (
    <div className="flex flex-col md:flex-row max-h-screen bg-gray-50">
      <div className="md:w-2/3 w-full border-b md:border-b-0 md:border-r border-gray-200 p-4 md:p-8 flex flex-col min-h-screen">
        <div className="flex items-center justify-between mb-4">
          <button
            className="text-blue-700 hover:underline font-medium"
            onClick={() => window.location.href = "/policies"}
            type="button"
          >
            &#8592; Back to Policy List
          </button>
          <div className="flex items-center gap-4">
            <button 
              className="px-4 py-2 rounded font-semibold cursor-pointer transition bg-gray-200 text-gray-800 hover:bg-gray-300" 
              onClick={() => fileRef.current?.click()}
            >
              Open Word File
              <input
                type="file"
                accept=".docx"
                ref={fileRef}
                className="hidden"
              />
            </button>
            <button
              className="px-4 py-2 rounded font-semibold transition bg-blue-600 text-white hover:bg-blue-700"
              onClick={handlePolicySave}
              type="button"
            >
              Next Step →
            </button>
          </div>
        </div>
        <div className="flex-1" style={{ height: "calc(100vh - 100px)" }}>
          <WordEditor 
            ref={wordEditorRef} 
            setSelected={setSelected} 
            fileRef={fileRef} 
            fileUrl={template?.docx || ""} 
          />
        </div>
      </div>

      <div className="md:w-1/3 w-full flex flex-col p-4 md:p-8 bg-white">
        {showQuestionEdit ? (
          <div className="md:pl-8">
            <h2 className="text-xl font-semibold mb-4">Question Edit</h2>
            <div className="flex gap-4 mb-4">
              <div className="flex gap-4">
                <button
                  type="button"
                  className={`px-4 py-2 rounded border text-sm font-medium transition ${
                    questionType === "input"
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-blue-50"
                  }`}
                  onClick={() => setQuestionType("input")}
                >
                  Input
                </button>
                <button
                  type="button"
                  className={`px-4 py-2 rounded border text-sm font-medium transition ${
                    questionType === "select"
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-blue-50"
                  }`}
                  onClick={() => setQuestionType("select")}
                >
                  Select
                </button>
              </div>
              <div className="flex-1">
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2 bg-gray-100 text-gray-500"
                  value={selected}
                  readOnly
                  placeholder="Preview will appear here"
                />
              </div>
            </div>
            <hr className="my-4" />
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Question</label>
              <input
                type="text"
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Enter your question"
              />
            </div>
            {questionType === 'select' && (
              <div className="mb-8">
                <label className="block text-sm font-medium mb-2">Answers & Results</label>
                <div className="space-y-4">
                  {answerSets.map((set, idx) => (
                    <div key={idx} className="flex flex-col gap-2 w-full">
                      <input
                        type="text"
                        className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={set.answer}
                        onChange={(e) => handleAnswerSetChange(idx, "answer", e.target.value)}
                        placeholder="Answer"
                      />
                      <input
                        type="text"
                        className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={set.result}
                        onChange={(e) => handleAnswerSetChange(idx, "result", e.target.value)}
                        placeholder="Result"
                      />
                      {answerSets.length > 1 && (
                        <button
                          type="button"
                          className="self-end text-red-500 hover:text-red-700"
                          onClick={() => handleRemoveAnswerSet(idx)}
                          title="Remove"
                        >
                          &times;
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    className="mt-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 transition text-lg"
                    onClick={handleAddAnswerSet}
                    title="Add Answer/Result"
                  >
                    +
                  </button>
                </div>
              </div>
            )}
            <div className="flex flex-col sm:flex-row gap-4 mt-auto">
              <button
                className={`flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition ${
                  edited ? "" : "opacity-50 cursor-not-allowed"
                }`}
                onClick={handleElementSaveButton}
                disabled={!edited}
              >
                Save
              </button>
              <button 
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
                onClick={() => setShowQuestionEdit(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-1 items-center justify-center">
            <button
              className={`px-6 py-3 bg-blue-600 text-white rounded-lg text-lg font-semibold shadow transition ${
                elementShow ? "hover:bg-blue-700 cursor-pointer" : "opacity-50 cursor-not-allowed"
              }`}
              onClick={handleAddClick}
              disabled={!elementShow}
            >
              + Add
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

