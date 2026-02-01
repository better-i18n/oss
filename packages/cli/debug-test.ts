import { analyzeSourceText } from "./src/analyzer/index.js";

const source = `
  const getMenu = (t) => [
    {
      title: "home",
      items: [
        { label: "dashboard" },
        { label: "profile" },
      ],
    },
  ];
`;

const result = analyzeSourceText(source, "test.tsx");

console.log("Detected issues:");
result.issues.forEach((issue) => {
  console.log(`  - ${issue.text} (key: ${issue.key})`);
});

console.log("\nStats:", result.stats);
console.log("Total data structure keys:", result.stats.dataStructureKeys);
