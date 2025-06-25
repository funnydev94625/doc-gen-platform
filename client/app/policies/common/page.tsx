"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

type AnsRes = { answer: string };
type Blank = {
  _id: string;
  question: string;
  ans_res?: { answers: AnsRes[] };
  answer?: string;
  placeholder?: string;
  isCommon?: boolean;
};
type Common = {
  blank_id: string;
  answer: string;
};

export default function CommonBlanksPage() {
  const { user } = useAuth();
  const [blanks, setBlanks] = useState<Blank[]>([]);
  const [answers, setAnswers] = useState<Common[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // Get blanks
      const blanksRes = await api.get("/api/commonBlank");
      const blanksData: Blank[] = blanksRes.data.filter(
        (b: Blank) => b.isCommon
      );
      setBlanks(blanksData);
      // Get initial common answers
      const commonsRes = await api.get(`/api/policy/common/${user?.id}`);
      const commons: Common[] = commonsRes.data;
      setAnswers(commons);
      setLoading(false);
    };
    fetchData();
  }, []);

  const getCurrentAnswer = (blankId: string) => {
    const found = answers.find((a) => a.blank_id === blankId);
    return found ? found.answer : "";
  };

  const handleInputChange = (blankId: string, val: string) => {
    setAnswers((prev) => {
      const others = prev.filter((a) => a.blank_id !== blankId);
      return [
        ...others,
        { blank_id: blankId, answer: val },
      ];
    });
  };

  const handleSelectChange = (blankId: string, selectedAnswer: string) => {
    setAnswers((prev) => {
      const others = prev.filter((a) => a.blank_id !== blankId);
      return [
        ...others,
        { blank_id: blankId, answer: selectedAnswer },
      ];
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const payload = answers
        .filter((a) => a.blank_id && a.answer !== undefined && a.answer !== null)
        .map((a) => ({
          blank_id: a.blank_id,
          answer: a.answer,
        }));
      await api.post("/api/policy/common/create", payload);
      setMessage("Answers saved successfully.");
    } catch {
      setMessage("Failed to save answers.");
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <span className="text-lg font-semibold">Loading...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full min-h-[100vh] gap-4 p-4 items-center">
      {message && (
        <div className="w-full flex justify-center mt-2">
          <span className="text-green-600 font-medium">{message}</span>
        </div>
      )}
      <div className="w-full max-w-2xl border rounded-lg p-8 bg-white flex flex-col gap-6 mt-8">
        <div className="flex flex-col gap-6">
          {blanks.map((blank, idx) => (
            <div
              key={blank._id}
              className="flex flex-col gap-2 border-b pb-4 mb-4 last:border-b-0 last:pb-0 last:mb-0"
            >
              <div className="text-base font-semibold mb-1">
                Question {idx + 1} of {blanks.length}
              </div>
              <div className="text-lg font-bold mb-2">{blank.question}</div>
              {blank.ans_res && blank.ans_res.answers && blank.ans_res.answers.length > 0 ? (
                <select
                  className="border rounded px-3 py-2"
                  value={getCurrentAnswer(blank._id)}
                  onChange={(e) => handleSelectChange(blank._id, e.target.value)}
                >
                  <option value="">Select an answer</option>
                  {blank.ans_res.answers.map((opt, i) => (
                    <option key={i} value={opt.answer}>
                      {opt.answer}
                    </option>
                  ))}
                </select>
              ) : (
                <Input
                  value={getCurrentAnswer(blank._id)}
                  onChange={(e) => handleInputChange(blank._id, e.target.value)}
                  placeholder="Your answer..."
                />
              )}
            </div>
          ))}
        </div>
        <Button
          className="mt-8"
          onClick={handleSave}
          disabled={saving || blanks.some((b) => !getCurrentAnswer(b._id))}
        >
          {saving ? "Saving..." : "Save"}
        </Button>
      </div>
    </div>
  );
}
