import {
  CheckCircle2,
  AlertCircle,
  Info,
  ShieldAlert,
  XCircle,
  ArrowLeft,
  MessageSquare,
} from "lucide-react";
import { DiagnosisResult } from "../App";
import { cn } from "../lib/utils";

interface ResultsViewProps {
  diagnosis: DiagnosisResult;
  onReset: () => void;
}

export function ResultsView({ diagnosis, onReset }: ResultsViewProps) {
  const isHealthy = diagnosis.diseaseName.toLowerCase() === "healthy";

  const getActionIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "remove":
        return <XCircle size={20} className="text-red-500" />;
      case "treat":
        return <ShieldAlert size={20} className="text-amber-500" />;
      case "prevent":
        return <CheckCircle2 size={20} className="text-emerald-500" />;
      case "info":
      default:
        return <Info size={20} className="text-blue-500" />;
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100">
        <h2 className="text-2xl font-bold text-slate-900">
          {diagnosis.isPlant ? "Diagnosis Results" : "Analysis Results"}
        </h2>
        <div className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase">
          Analysis Active
        </div>
      </div>

      {/* Main Result Card */}
      <div className="p-8">
        {!diagnosis.isPlant ? (
          <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-2xl mb-8">
            <div className="flex items-center gap-3 mb-2">
              <AlertCircle className="text-amber-500" size={24} />
              <h3 className="text-xl font-bold text-slate-900">Plant Not Detected</h3>
            </div>
            <p className="text-slate-700 mb-4">
              Please make sure you upload the right image. We couldn't detect a plant, leaf, or crop in this photo.
            </p>
            <div className="pt-4 border-t border-amber-200/60">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Image Information</p>
              <p className="text-slate-600 leading-relaxed">{diagnosis.description}</p>
            </div>
          </div>
        ) : (
          <>
            <div
              className={cn(
                "rounded-2xl p-6 mb-8 flex justify-between items-start border-l-4",
                isHealthy
                  ? "bg-emerald-50 border-emerald-500"
                  : "bg-slate-50 border-red-500",
              )}
            >
              <div>
                <p className="text-xs font-bold tracking-widest text-slate-500 uppercase mb-1">
                  {isHealthy ? "Status" : "Detected Disease"}
                </p>
                <h3 className="text-3xl font-bold text-slate-900 mb-1">
                  {diagnosis.diseaseName}
                </h3>
                {diagnosis.scientificName && diagnosis.scientificName !== "N/A" && (
                  <p className="text-slate-500 italic">
                    {diagnosis.scientificName}
                  </p>
                )}
              </div>
              <div className="text-right">
                <div
                  className={cn(
                    "text-4xl font-black tracking-tighter",
                    isHealthy ? "text-emerald-500" : "text-emerald-500", // Keep green for confidence
                  )}
                >
                  {diagnosis.confidence}%
                </div>
                <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                  Confidence
                </p>
              </div>
            </div>

            {/* About Condition */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Info size={20} className="text-emerald-500" />
                <h4 className="text-lg font-bold text-slate-900">
                  About this condition
                </h4>
              </div>
              <p className="text-slate-600 leading-relaxed">
                {diagnosis.description}
              </p>
            </div>

            {/* Recommended Actions */}
            {diagnosis.recommendedActions && diagnosis.recommendedActions.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <ShieldAlert size={20} className="text-emerald-500" />
                  <h4 className="text-lg font-bold text-slate-900">
                    Recommended Actions
                  </h4>
                </div>
                <ul className="space-y-4">
                  {diagnosis.recommendedActions.map((action, index) => (
                    <li key={index} className="flex gap-4 items-start">
                      <div className="mt-0.5">{getActionIcon(action.type)}</div>
                      <p className="text-slate-700 leading-relaxed">
                        {action.action}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-slate-100">
          <button
            onClick={onReset}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 transition-colors border border-slate-200"
          >
            <ArrowLeft size={20} />
            Scan Another {diagnosis.isPlant ? "Plant" : "Image"}
          </button>
          {diagnosis.isPlant && !isHealthy && (
            <button className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition-colors border border-emerald-200">
              <MessageSquare size={20} />
              Consult Local Specialist
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
