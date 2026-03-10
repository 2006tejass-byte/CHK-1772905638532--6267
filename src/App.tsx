/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { GoogleGenAI, Type } from "@google/genai";
import { Header } from "./components/Header";
import { UploadView } from "./components/UploadView";
import { AnalysisView } from "./components/AnalysisView";
import { ResultsView } from "./components/ResultsView";
import { Chatbot } from "./components/Chatbot";

export type DiagnosisResult = {
  isPlant: boolean;
  diseaseName: string;
  scientificName?: string;
  confidence: number;
  description: string;
  recommendedActions: { action: string; type: string }[];
};

export default function App() {
  const [step, setStep] = useState<"upload" | "analyzing" | "results">(
    "upload",
  );
  const [image, setImage] = useState<string | null>(null);
  const [diagnosis, setDiagnosis] = useState<DiagnosisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleImageSelected = async (base64Image: string) => {
    setImage(base64Image);
    setStep("analyzing");
    setError(null);

    try {
      const apiKey = process.env.GEMINI_API_KEY || (import.meta as any).env.VITE_GEMINI_API_KEY;
      if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
        throw new Error("Invalid API key. Please set a valid GEMINI_API_KEY in your environment variables.");
      }

      const ai = new GoogleGenAI({ apiKey });
      
      // Extract the actual mime type from the base64 string
      const mimeTypeMatch = base64Image.match(/^data:(image\/\w+);base64,/);
      const mimeType = mimeTypeMatch ? mimeTypeMatch[1] : "image/jpeg";
      const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          {
            parts: [
              {
                inlineData: {
                  mimeType: mimeType,
                  data: base64Data,
                },
              },
              {
                text: "Analyze this image. First, determine if it contains a plant, leaf, crop, or any plant-related matter. If it does NOT contain a plant, set 'isPlant' to false, provide a generic description of what you see in the 'description' field, and leave other fields empty or generic. If it DOES contain a plant, set 'isPlant' to true, identify any diseases, provide its scientific name, your confidence level (as a percentage number), a brief description of the condition, and a list of recommended actions to treat or manage it. If the plant looks healthy, state that it is healthy.",
              },
            ],
          },
        ],
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              isPlant: {
                type: Type.BOOLEAN,
                description: "True if the image contains a plant, leaf, or crop. False otherwise.",
              },
              diseaseName: {
                type: Type.STRING,
                description:
                  "The common name of the detected disease, or 'Healthy' if no disease is detected. If not a plant, put 'N/A'.",
              },
              scientificName: {
                type: Type.STRING,
                description:
                  "The scientific name of the pathogen or condition, if applicable. If not a plant, put 'N/A'.",
              },
              confidence: {
                type: Type.NUMBER,
                description: "Confidence level as a percentage (e.g., 98.4).",
              },
              description: {
                type: Type.STRING,
                description:
                  "A brief description of the condition and its symptoms. If not a plant, describe what is in the image.",
              },
              recommendedActions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    action: { type: Type.STRING },
                    type: {
                      type: Type.STRING,
                      description:
                        "Type of action: 'remove', 'treat', 'prevent', or 'info'",
                    },
                  },
                },
                description:
                  "List of recommended actions to address the issue. If not a plant, provide an empty array.",
              },
            },
            required: [
              "isPlant",
              "diseaseName",
              "confidence",
              "description",
              "recommendedActions",
            ],
          },
        },
      });

      const resultText = response.text;
      if (!resultText) {
        throw new Error("No response from AI");
      }

      const result = JSON.parse(resultText);
      setDiagnosis(result);
      setStep("results");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred during analysis.");
      setStep("upload");
    }
  };

  const handleReset = () => {
    setStep("upload");
    setImage(null);
    setDiagnosis(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#fafafa] font-sans text-slate-900 flex flex-col">
      <Header />

      <main className="flex-1 max-w-5xl w-full mx-auto p-4 md:p-8 flex flex-col items-center justify-center">
        {error && (
          <div className="mb-6 w-full max-w-2xl bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        {step === "upload" && (
          <UploadView onImageSelected={handleImageSelected} />
        )}
        {step === "analyzing" && <AnalysisView image={image} />}
        {step === "results" && diagnosis && (
          <ResultsView diagnosis={diagnosis} onReset={handleReset} />
        )}
      </main>

      {/* Floating Chat Button */}
      <button
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-6 right-6 bg-emerald-500 hover:bg-emerald-600 text-white p-4 rounded-full shadow-lg transition-transform hover:scale-105 z-40"
        aria-label="Open AI Assistant"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
      </button>

      {/* Chatbot Drawer/Modal */}
      {isChatOpen && (
        <Chatbot onClose={() => setIsChatOpen(false)} context={diagnosis} />
      )}
    </div>
  );
}
