"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";

export default function CommonPolicyPage() {
	const [questions, setQuestions] = useState<any[]>([]);
	const [currentIdx, setCurrentIdx] = useState(0);

	useEffect(() => {
		api.get("/api/commonBlank").then((res) => {
			// Filter for isCommon === true if not already filtered by backend
			const blanks = Array.isArray(res.data)
				? res.data.filter((b: any) => b.isCommon)
				: [];
			setQuestions(blanks);
		});
	}, []);

	const currentQuestion = questions[currentIdx];

	const handleAnswerChange = (val: string) => {
		setQuestions((prev) =>
			prev.map((q, idx) => (idx === currentIdx ? { ...q, answer: val } : q))
		);
	};

	const handleDefaultChange = (checked: boolean) => {
		setQuestions((prev) =>
			prev.map((q, idx) => (idx === currentIdx ? { ...q, isDefault: checked } : q))
		);
	};

	const handlePrev = () => {
		if (currentIdx > 0) setCurrentIdx((i) => i - 1);
	};

	const handleNext = () => {
		if (currentIdx < questions.length - 1) setCurrentIdx((i) => i + 1);
	};

	if (!questions.length || !currentQuestion) {
		return <div className="p-8 text-center">Loading...</div>;
	}

	return (
		<div className="flex flex-col w-full min-h-[50vh] gap-4 relative items-center justify-cente mb-8 mt-8">
			<div className="flex gap-4 flex-1 w-full max-w-2xl justify-center">
				{/* Question Area */}
				<div className="flex-1 border rounded-lg p-8 bg-white min-h-[70vh]">
					<div className="mb-2 font-semibold">
						Question {currentIdx + 1} of {questions.length}
					</div>
					<div className="mb-3 text-lg font-bold">
						{currentQuestion.question}
					</div>
					<Input
						value={currentQuestion.answer || ""}
						onChange={(e) => handleAnswerChange(e.target.value)}
						className="mb-2"
					/>
					<div className="flex justify-between mt-4">
						<Button
							variant="outline"
							disabled={currentIdx === 0}
							onClick={handlePrev}
						>
							Prev
						</Button>
						{currentIdx === questions.length - 1 ? (
							<Button
								className="bg-blue-600 text-white"
								disabled={!currentQuestion.answer || currentQuestion.answer.trim() === ""}
							>
								Save
							</Button>
						) : (
							<Button
								onClick={handleNext}
								disabled={
									currentIdx === questions.length - 1 ||
									!currentQuestion.answer ||
									currentQuestion.answer.trim() === ""
								}
							>
								Next
							</Button>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
