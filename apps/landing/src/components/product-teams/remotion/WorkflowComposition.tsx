import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  spring,
  Sequence,
} from "remotion";

interface WorkflowCompositionProps {
  text: string;
}

// Step data with colors
const steps = [
  { icon: "📝", title: "Code", color: "#6b7280", bg: "#f3f4f6" },
  { icon: "🔄", title: "Sync", color: "#3b82f6", bg: "#eff6ff" },
  { icon: "🤖", title: "AI", color: "#8b5cf6", bg: "#f5f3ff" },
  { icon: "👀", title: "Review", color: "#f59e0b", bg: "#fffbeb" },
  { icon: "🚀", title: "Live", color: "#10b981", bg: "#ecfdf5" },
];

// Animated string that travels through steps
function TravelingString({
  text,
  progress,
}: {
  text: string;
  progress: number;
}) {
  const stepIndex = Math.min(Math.floor(progress * 5), 4);

  // Calculate x position (0 to 100% of container width)
  const xPercent = interpolate(progress, [0, 1], [10, 90]);

  // Translations for current step
  const translations: Record<number, string> = {
    0: text, // English
    1: text, // Syncing...
    2: "Änderungen speichern", // German
    3: "Änderungen speichern", // Reviewing
    4: "Änderungen speichern", // Published
  };

  const displayText = translations[stepIndex] || text;
  const currentStep = steps[stepIndex];

  return (
    <div
      style={{
        position: "absolute",
        left: `${xPercent}%`,
        top: "50%",
        transform: "translate(-50%, -50%)",
        padding: "12px 24px",
        borderRadius: "12px",
        backgroundColor: currentStep.bg,
        border: `2px solid ${currentStep.color}`,
        boxShadow: `0 4px 20px ${currentStep.color}33`,
        transition: "all 0.3s ease",
      }}
    >
      <span
        style={{
          fontFamily: "system-ui, sans-serif",
          fontSize: "18px",
          fontWeight: 600,
          color: currentStep.color,
        }}
      >
        {displayText}
      </span>
    </div>
  );
}

// Individual step node
function StepNode({
  step,
  isActive,
  isCompleted,
}: {
  step: (typeof steps)[0];
  isActive: boolean;
  isCompleted: boolean;
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({
    frame: isActive ? frame : 0,
    fps,
    config: { damping: 12, stiffness: 200 },
  });

  const activeScale = isActive ? 1 + scale * 0.1 : 1;
  const opacity = isCompleted || isActive ? 1 : 0.5;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "12px",
        opacity,
        transform: `scale(${activeScale})`,
      }}
    >
      <div
        style={{
          width: "80px",
          height: "80px",
          borderRadius: "20px",
          backgroundColor: isActive || isCompleted ? step.bg : "#f9fafb",
          border: `3px solid ${isActive || isCompleted ? step.color : "#e5e7eb"}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "36px",
          boxShadow: isActive ? `0 8px 30px ${step.color}40` : "none",
          transition: "all 0.3s ease",
        }}
      >
        {step.icon}
      </div>
      <span
        style={{
          fontFamily: "system-ui, sans-serif",
          fontSize: "14px",
          fontWeight: 600,
          color: isActive || isCompleted ? step.color : "#9ca3af",
        }}
      >
        {step.title}
      </span>
    </div>
  );
}

// Connector line between steps
function Connector({
  isActive,
  progress,
}: {
  isActive: boolean;
  progress: number;
}) {
  return (
    <div
      style={{
        width: "80px",
        height: "4px",
        backgroundColor: "#e5e7eb",
        borderRadius: "2px",
        overflow: "hidden",
        margin: "0 8px",
      }}
    >
      <div
        style={{
          width: `${isActive ? progress * 100 : isActive ? 100 : 0}%`,
          height: "100%",
          backgroundColor: "#3b82f6",
          borderRadius: "2px",
          transition: "width 0.1s linear",
        }}
      />
    </div>
  );
}

export function WorkflowComposition({ text }: WorkflowCompositionProps) {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Overall progress (0 to 1)
  const progress = interpolate(frame, [30, durationInFrames - 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Current active step (0-4)
  const activeStep = Math.min(Math.floor(progress * 5), 4);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#ffffff",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      {/* Steps Row */}
      <div
        style={{
          position: "absolute",
          top: "35%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          display: "flex",
          alignItems: "center",
        }}
      >
        {steps.map((step, index) => (
          <div key={index} style={{ display: "flex", alignItems: "center" }}>
            <StepNode
              step={step}
              isActive={index === activeStep}
              isCompleted={index < activeStep}
            />
            {index < steps.length - 1 && (
              <Connector
                isActive={index < activeStep}
                progress={index === activeStep ? (progress * 5) % 1 : 0}
              />
            )}
          </div>
        ))}
      </div>

      {/* Traveling String */}
      <Sequence from={30}>
        <div
          style={{
            position: "absolute",
            top: "70%",
            left: "10%",
            right: "10%",
            height: "80px",
          }}
        >
          <TravelingString text={text} progress={progress} />
        </div>
      </Sequence>

      {/* Status Text */}
      <div
        style={{
          position: "absolute",
          bottom: "40px",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: "32px",
          fontSize: "13px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              backgroundColor: "#6b7280",
            }}
          />
          <span style={{ color: "#6b7280" }}>Developer</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              backgroundColor: "#3b82f6",
            }}
          />
          <span style={{ color: "#6b7280" }}>Automated</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              backgroundColor: "#10b981",
            }}
          />
          <span style={{ color: "#6b7280" }}>Product Team</span>
        </div>
      </div>
    </AbsoluteFill>
  );
}
