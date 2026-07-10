import { STAGES, stageIndex, type Stage } from "@/lib/data";
import { stageStyle } from "@/lib/stage";

export function PipelineBar({ stage }: { stage: Stage }) {
  const current = stageIndex(stage);

  return (
    <div>
      <div className="flex gap-1.5">
        {STAGES.map((s, i) => {
          let color = "bg-line";
          if (i < current) color = "bg-forest";
          else if (i === current) color = s === "Selected" ? "bg-forest-600" : "bg-gold";
          return <div key={s} className={`h-1.5 flex-1 rounded-full ${color}`} />;
        })}
      </div>
      <div className="mt-2 flex text-xs">
        {STAGES.map((s, i) => {
          const done = i < current;
          const isCurrent = i === current;
          const align = i === 0 ? "text-left" : i === STAGES.length - 1 ? "text-right" : "text-center";
          const tone = isCurrent
            ? `${stageStyle[stage].text} font-medium`
            : done
              ? "text-forest"
              : "text-faint";
          return (
            <div key={s} className={`flex-1 ${align} ${tone}`}>
              {s}
            </div>
          );
        })}
      </div>
    </div>
  );
}
