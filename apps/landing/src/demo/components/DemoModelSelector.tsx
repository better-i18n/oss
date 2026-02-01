import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@better-i18n/ui/components/popover";
import { cn } from "@better-i18n/ui/lib/utils";
import {
  IconClaudeai as Claude,
  IconGemini as Gemini,
  IconOpenai as OpenAI,
} from "@central-icons-react/round-outlined-radius-2-stroke-2";
import {
  AI_MODELS,
  type AIModelConfig,
  type ModelIcon,
} from "@better-i18n/schemas";

// Strip dark: classes for landing (light mode only)
const stripDarkClasses = (className: string) => {
  return className.replace(/\s*dark:[^\s]*/g, "");
};

// Icon mapping function (from production apps/app/lib/ai-models.ts)
export const getModelIcon = (
  iconClassName: string,
): Record<ModelIcon, React.ReactNode> => {
  // Strip dark classes from icon className
  const lightIconClass = stripDarkClasses(iconClassName);

  return {
    BetterAI: (
      <img
        src="https://better-i18n.com/cdn-cgi/image/width=48/logo.png"
        alt="Better AI"
        className={cn("h-4 w-4", lightIconClass)}
      />
    ),
    OpenAI: <OpenAI className={cn("h-4 w-4 text-white", lightIconClass)} />,
    Gemini: <Gemini className={cn("h-4 w-4 text-white", lightIconClass)} />,
    Claude: <Claude className={cn("h-4 w-4 text-white", lightIconClass)} />,
  };
};

interface DemoModelSelectorProps {
  selectedModel: AIModelConfig;
  onModelChange: (modelId: string) => void;
  disabled?: boolean;
}

export function DemoModelSelector({
  selectedModel,
  onModelChange,
  disabled = false,
}: DemoModelSelectorProps) {
  const [open, setOpen] = useState(false);

  const handleModelChange = (modelId: string) => {
    onModelChange(modelId);
    setOpen(false);
  };

  // Strip dark classes for landing
  const lightBg = stripDarkClasses(selectedModel.colors.background);
  const lightHover = stripDarkClasses(selectedModel.colors.hover);
  const lightIcon = stripDarkClasses(selectedModel.colors.icon);

  return (
    <Popover
      open={open && !disabled}
      onOpenChange={(o) => !disabled && setOpen(o)}
    >
      <PopoverTrigger asChild>
        <button
          disabled={disabled}
          className={cn(
            "flex items-center gap-1.5 h-8 px-3 rounded-2xl text-xs font-medium transition-all outline-none focus-visible:ring-1 focus-visible:ring-slate-300 border border-transparent",
            lightBg,
            disabled
              ? "opacity-50 cursor-default"
              : cn("cursor-pointer", lightHover),
          )}
        >
          <div className="shrink-0 flex items-center justify-center">
            {getModelIcon(lightIcon)[selectedModel.icon]}
          </div>
          <span className={cn("font-medium text-sm", lightIcon)}>
            {selectedModel.name}
          </span>
        </button>
      </PopoverTrigger>

      <PopoverContent
        className="w-[200px] p-1 overflow-hidden bg-white border-gray-200/60 shadow-lg rounded-lg pointer-events-auto"
        align="start"
        side="top"
        sideOffset={6}
        style={{ zIndex: 99999 }}
      >
        <div className="flex flex-col gap-0.5">
          {AI_MODELS.map((model: AIModelConfig) => {
            const isSelected = selectedModel.id === model.id;
            const modelLightIcon = stripDarkClasses(model.colors.icon);

            return (
              <button
                key={model.id}
                onClick={() => handleModelChange(model.id)}
                className={cn(
                  "group w-full flex items-center gap-2.5 px-2.5 py-2 text-left rounded-md transition-colors outline-none",
                  "hover:bg-gray-100",
                )}
              >
                {/* Provider Icon */}
                <div className="shrink-0 flex items-center justify-center w-5 h-5">
                  {getModelIcon(modelLightIcon)[model.icon]}
                </div>

                {/* Model Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm text-gray-900 truncate">
                      {model.name}
                    </span>
                  </div>
                </div>

                {/* Selection Dot */}
                {isSelected && (
                  <div className="shrink-0 h-2 w-2 rounded-full bg-slate-600" />
                )}
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
