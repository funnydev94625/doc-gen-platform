"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

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
  isDefault?: boolean;
};

export default function CommonBlanksPage() {
  const [blanks, setBlanks] = useState<Blank[]>([]);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Common[]>([]);
  const [defaultChecked, setDefaultChecked] = useState<{
    [blankId: string]: boolean;
  }>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const { user, setUser } = useAuth();
  const router = useRouter()

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
      // Set defaultChecked from commons
      const defaultMap: { [blankId: string]: boolean } = {};
      commons.forEach((c) => {
        if (c.isDefault) defaultMap[c.blank_id] = true;
      });
      setDefaultChecked(defaultMap);
      setLoading(false);
    };
    if (user?.id) fetchData();
  }, [user]);

  const currentBlank = blanks[step];

  const getCurrentAnswer = () => {
    const found = answers.find((a) => a.blank_id === currentBlank?._id);
    return found ? found.answer : "";
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (!currentBlank) return;
    setAnswers((prev) => {
      const others = prev.filter((a) => a.blank_id !== currentBlank._id);
      return [
        ...others,
        {
          blank_id: currentBlank._id,
          answer: val,
          isDefault: defaultChecked[currentBlank._id],
        },
      ];
    });
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedAnswer = e.target.value;
    if (!currentBlank) return;
    setAnswers((prev) => {
      const others = prev.filter((a) => a.blank_id !== currentBlank._id);
      return [
        ...others,
        {
          blank_id: currentBlank._id,
          answer: selectedAnswer,
          isDefault: defaultChecked[currentBlank._id],
        },
      ];
    });
  };

  const handleDefaultCheckbox = (checked: boolean) => {
    if (!currentBlank) return;
    setDefaultChecked((prev) => ({
      ...prev,
      [currentBlank._id]: checked,
    }));
    setAnswers((prev) =>
      prev.map((a) =>
        a.blank_id === currentBlank._id ? { ...a, isDefault: checked } : a
      )
    );
  };

  const handlePrev = () => setStep((s) => Math.max(0, s - 1));
  const handleNext = () => setStep((s) => Math.min(blanks.length - 1, s + 1));

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const payload = answers
        .filter(
          (a) => a.blank_id && a.answer !== undefined && a.answer !== null
        )
        .map((a) => ({
          blank_id: a.blank_id,
          answer: a.answer,
          isDefault: a.isDefault,
        }));
      await api.post("/api/policy/common/create", payload);
      setMessage("Answers saved successfully.");
      setUser((prev: any) => ({
        ...prev,
        commonExist: true, // Update user state to reflect common questions answered
      }));
      router.push("/policies");
    } catch(error) {
      console.log(error)
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
    <div className="flex flex-col w-full gap-4 p-4 items-center">
      {message && (
        <div className="w-full flex justify-center mt-2">
          <span className="text-green-600 font-medium">{message}</span>
        </div>
      )}
      <div className="w-full max-w-2xl border rounded-lg p-8 bg-white flex flex-col gap-6 mt-8">
        <div className="flex flex-col gap-2">
          <div className="text-base font-semibold mb-1">
            Question {step + 1} of {blanks.length}
          </div>
          <div className="text-lg font-bold mb-2">{currentBlank?.question}</div>
          {currentBlank?.ans_res &&
          currentBlank.ans_res.answers &&
          currentBlank.ans_res.answers.length > 0 ? (
            <select
              className="border rounded px-3 py-2"
              value={getCurrentAnswer()}
              onChange={handleSelectChange}
            >
              <option value="">Select an answer</option>
              {currentBlank.ans_res.answers.map((opt, idx) => (
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
          <Button variant="outline" onClick={handlePrev} disabled={step === 0}>
            Prev
          </Button>
          {step === blanks.length - 1 ? (
            <Button
              onClick={handleSave}
              disabled={saving || getCurrentAnswer() === ""}
            >
              {saving ? "Saving..." : "Save"}
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={handleNext}
              disabled={getCurrentAnswer() === ""}
            >
              Next
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
