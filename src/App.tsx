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
import { ScrollReveal } from "./components/ScrollReveal";
import { Threads } from "./components/Threads";
import { SpotlightCard } from "./components/SpotlightCard";
import { motion } from "motion/react";
import { Cpu, HeartPulse, History, WifiOff } from "lucide-react";

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
    <div className="min-h-screen bg-black font-sans text-white flex flex-col relative overflow-hidden">
      <Threads color="#10b981" />
      <Header />

      <main className="flex-1 max-w-5xl w-full mx-auto p-4 md:p-8 flex flex-col items-center justify-center">
        {error && (
          <div className="mb-6 w-full max-w-2xl bg-red-900/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        {step === "upload" && (
          <div className="flex flex-col items-center w-full gap-32">
            <UploadView onImageSelected={handleImageSelected} />
            
            <div className="w-full max-w-5xl px-8 md:px-12 py-32 border-y border-zinc-900/50 bg-zinc-950/20 rounded-[4rem]">
              <motion.h2 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                className="text-emerald-500 text-center font-black uppercase tracking-[0.4em] text-xs mb-16 opacity-50"
              >
                Project Overview
              </motion.h2>
              <ScrollReveal 
                className="text-2xl md:text-5xl font-black leading-[1.4] tracking-tight"
                text="AgriScan AI is an intelligent agriculture technology project designed to help farmers detect crop diseases quickly and accurately using Artificial Intelligence. By simply capturing or uploading a photo of a plant leaf, the system analyzes the image using advanced machine learning models and identifies potential diseases affecting the crop. The platform provides farmers with instant insights, including the disease name, possible causes, and recommended treatment or preventive measures. This helps farmers take timely action, reduce crop losses, and improve overall agricultural productivity."
              />
            </div>

            <div className="w-full max-w-6xl px-4 py-32">
              <motion.h2 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                className="text-emerald-500 text-center font-black uppercase tracking-[0.4em] text-xs mb-16 opacity-50"
              >
                Key Features
              </motion.h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { 
                    icon: Cpu, 
                    title: "AI Precision Diagnosis", 
                    desc: "State-of-the-art vision models trained on millions of plant images for pinpoint accuracy." 
                  },
                  { 
                    icon: HeartPulse, 
                    title: "Expert Treatment Plans", 
                    desc: "Scientific-grade recovery steps and organic alternatives to restore your crop's health." 
                  },
                  { 
                    icon: History, 
                    title: "Historical Insights", 
                    desc: "Monitor pattern outbreaks and disease cycles across seasons to stay one step ahead." 
                  },
                  { 
                    icon: WifiOff, 
                    title: "Edge Capability", 
                    desc: "Designed for the field. High-speed analysis that works even in satellite-challenging zones." 
                  }
                ].map((feature, idx) => (
                  <SpotlightCard key={idx} className="group">
                    <div className="flex flex-col gap-4">
                      <div className="text-emerald-500 bg-emerald-500/10 w-fit p-3 rounded-2xl group-hover:bg-emerald-500/20 transition-colors">
                        <feature.icon size={28} />
                      </div>
                      <h3 className="text-xl font-bold text-white tracking-tight">
                        {feature.title}
                      </h3>
                      <p className="text-zinc-400 text-sm leading-relaxed">
                        {feature.desc}
                      </p>
                    </div>
                  </SpotlightCard>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === "analyzing" && <AnalysisView image={image} />}
        
        {step === "results" && diagnosis && (
          <ResultsView diagnosis={diagnosis} onReset={handleReset} />
        )}

        <footer className="w-full py-12 flex flex-col items-center justify-center border-t border-zinc-900/50 mt-auto">
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-sm font-medium tracking-widest text-zinc-500 uppercase flex items-center gap-2"
          >
            Created with <span className="text-red-500 animate-pulse">❤️</span> by 
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent font-black">
              Flame X Thunder
            </span>
          </motion.p>
        </footer>
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
