import type { Stage } from "./data";

interface StageStyle {
  text: string;
  dot: string;
  bar: string;
}

export const stageStyle: Record<Stage, StageStyle> = {
  Applied: { text: "text-stone", dot: "bg-stone", bar: "bg-stone" },
  Reviewed: { text: "text-gold", dot: "bg-gold", bar: "bg-gold" },
  "Call scheduled": { text: "text-gold", dot: "bg-gold", bar: "bg-gold" },
  Selected: { text: "text-forest-600", dot: "bg-forest-600", bar: "bg-forest-600" },
};
