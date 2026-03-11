import { motion } from "motion/react";
import { ScanLine } from "lucide-react";

interface AnalysisViewProps {
  image: string | null;
}

export function AnalysisView({ image }: AnalysisViewProps) {
  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center py-12">
      <div className="relative w-64 h-64 rounded-3xl overflow-hidden shadow-2xl mb-8 border-4 border-zinc-800">
        {image && (
          <img
            src={image}
            alt="Analyzing"
            className="w-full h-full object-cover"
          />
        )}

        {/* Scanning animation overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-400/30 to-transparent"
          animate={{
            y: ["-100%", "100%"],
          }}
          transition={{
            repeat: Infinity,
            duration: 2,
            ease: "linear",
          }}
        />

        <div className="absolute inset-0 border-2 border-emerald-400/50 rounded-3xl m-2" />
      </div>

      <div className="flex flex-col items-center text-center">
        <div className="flex items-center gap-3 mb-4 text-emerald-600">
          <ScanLine size={28} className="animate-pulse" />
          <h2 className="text-2xl font-bold tracking-tight">
            Analyzing Image...
          </h2>
        </div>
        <p className="text-zinc-400 max-w-md">
          Our AI is examining the plant for signs of disease, pests, or nutrient
          deficiencies. This usually takes just a few seconds.
        </p>
      </div>
    </div>
  );
}
