"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Save, X } from "lucide-react";
import api from "@/lib/api";

type Answer = {
	answer: string;
};

type Blank = {
	_id: string;
	placeholder: string;
	question?: string;
	ans_res?: { answers?: Answer[] };
	isCommon: boolean;
};

export default function CommonBlanksPage() {
	const [blanks, setBlanks] = useState<Blank[]>([]);
	const [selectedBlankId, setSelectedBlankId] = useState<string | null>(null);
	const [radioValue, setRadioValue] = useState<"default" | "select">("default");
	const [question, setQuestion] = useState<string>("");
	const [placeholder, setPlaceholder] = useState<string>("");
	const [ansResList, setAnsResList] = useState<Answer[]>([]);
	const [ansResDirty, setAnsResDirty] = useState<boolean>(false);
	const [isEditing, setIsEditing] = useState<boolean>(false);

	// Fetch blanks from backend on mount
	useEffect(() => {
		api.get("/api/commonBlank").then((res) => setBlanks(res.data));
	}, []);

	// Handle selecting a blank for editing
	const handleSelectBlank = (blank: Blank) => {
		setSelectedBlankId(blank._id);
		setRadioValue(blank.ans_res?.answers ? "select" : "default");
		setQuestion(blank.question || "");
		setPlaceholder(blank.placeholder || "");
		setAnsResList(blank.ans_res?.answers || []);
		setAnsResDirty(false);
		setIsEditing(true);
	};

	// Handle adding a new blank
	const handleAddBlank = async () => {
		const payload = {
			placeholder: "new_blank",
			question: "",
			ans_res: {},
			isCommon: true,
		};
		const res = await api.post("/api/commonBlank", payload);
		const newBlank = res.data;
		setBlanks((prev) => [...prev, newBlank]);
		setSelectedBlankId(newBlank._id);
		setRadioValue("default");
		setQuestion("");
		setPlaceholder("new_blank");
		setAnsResList([]);
		setAnsResDirty(false);
		setIsEditing(true);
	};

	// Handle radio change
	const handleRadioChange = (val: "default" | "select") => {
		setRadioValue(val);
		setAnsResDirty(true);
		if (val === "default") setAnsResList([]);
	};

	// Handle answer/response change
	const handleAnsResChange = (idx: number, field: keyof Answer, value: string) => {
		const updated = [...ansResList];
		updated[idx][field] = value;
		setAnsResList(updated);
		setAnsResDirty(true);
	};

	// Add answer/response
	const handleAddAnsRes = () => {
		setAnsResList([...ansResList, { answer: "" }]);
		setAnsResDirty(true);
	};

	// Remove answer/response
	const handleRemoveAnsRes = (idx: number) => {
		setAnsResList(ansResList.filter((_, i) => i !== idx));
		setAnsResDirty(true);
	};

	// Cancel editing/adding
	const handleCancelAnsRes = () => {
		if (isEditing && selectedBlankId) {
			const blank = blanks.find((b) => b._id === selectedBlankId);
			if (blank) handleSelectBlank(blank);
		} else {
			setSelectedBlankId(null);
			setRadioValue("default");
			setQuestion("");
			setPlaceholder("");
			setAnsResList([]);
			setAnsResDirty(false);
			setIsEditing(false);
		}
	};

	// Save changes (update on backend)
	const handleSaveAnsRes = async () => {
		if (!selectedBlankId) return;
		const payload = {
			placeholder,
			question,
			ans_res: radioValue === "select" ? { answers: ansResList } : {},
			isCommon: true,
		};
		await api.put(`/api/commonBlank/${selectedBlankId}`, payload);
		const res = await api.get("/api/commonBlank");
		setBlanks(res.data);
		setAnsResDirty(false);
		setIsEditing(false);
	};

	// Delete blank (delete on backend)
	const handleDeleteBlank = async (id: string) => {
		await api.delete(`/api/commonBlank/${id}`);
		const res = await api.get("/api/commonBlank");
		setBlanks(res.data);
		setSelectedBlankId(null);
		setRadioValue("default");
		setQuestion("");
		setPlaceholder("");
		setAnsResList([]);
		setAnsResDirty(false);
		setIsEditing(false);
	};

	const canAddAnsRes = ansResList.every((ar) => ar.answer.trim() !== "");

	return (
		<div className="flex gap-8">
			{/* List and Add Button */}
			<div className="w-[40%] border rounded-lg p-4 bg-white flex flex-col gap-4">
				<div className="flex justify-between items-center mb-2">
					<h2 className="font-semibold text-lg">Common Blanks</h2>
					<Button type="button" onClick={handleAddBlank}>
						<Plus className="w-4 h-4 mr-1" />Add
					</Button>
				</div>
				<div className="flex flex-col gap-2">
					{blanks.map((blank) => (
						<div
							key={blank._id}
							className={`flex items-center justify-between px-3 py-2 rounded cursor-pointer ${
								selectedBlankId === blank._id ? "bg-gray-100" : ""
							}`}
							onClick={() => handleSelectBlank(blank)}
						>
							<span>{blank.placeholder}</span>
							
						</div>
					))}
				</div>
			</div>

			{/* Edit/Add Form */}
			<div className="w-[60%] border rounded-lg p-4 bg-white flex flex-col gap-4">
				<Input
					value={placeholder}
					onChange={(e) => {
						setPlaceholder(e.target.value);
						setAnsResDirty(true);
					}}
					disabled={!selectedBlankId && !question}
					placeholder="Placeholder"
				/>
				<div className="flex gap-6 items-center">
					<label className="flex items-center gap-2">
						<input
							type="radio"
							checked={radioValue === "default"}
							onChange={() => handleRadioChange("default")}
							disabled={!selectedBlankId && !question}
						/>
						Input
					</label>
					<label className="flex items-center gap-2">
						<input
							type="radio"
							checked={radioValue === "select"}
							onChange={() => handleRadioChange("select")}
							disabled={!selectedBlankId && !question}
						/>
						Select
					</label>
				</div>
				<Input
					value={question}
					onChange={(e) => {
						setQuestion(e.target.value);
						setAnsResDirty(true);
					}}
					disabled={!selectedBlankId && !question}
					placeholder="Question"
				/>
				{radioValue === "select" && (
					<div className="flex flex-col gap-2">
						{ansResList.map((ar, idx) => (
							<div key={idx} className="flex gap-2 items-center">
								<Input
									value={ar.answer}
									placeholder="Answer"
									onChange={(e) =>
										handleAnsResChange(idx, "answer", e.target.value)
									}
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
						disabled={!ansResDirty}
					>
						<X className="w-4 h-4" />
					</Button>
					<Button
						type="button"
						variant="destructive"
						onClick={() => selectedBlankId && handleDeleteBlank(selectedBlankId)}
						disabled={!selectedBlankId}
					>
						<Trash2 className="w-4 h-4" />
					</Button>
					<Button
						type="button"
						onClick={handleSaveAnsRes}
						disabled={!ansResDirty}
					>
						<Save className="w-4 h-4" />
					</Button>
				</div>
			</div>
		</div>
	);
}