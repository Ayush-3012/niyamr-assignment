import fs from "fs";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import { checkWithLLM } from "../utils/llm.js";

pdfjsLib.GlobalWorkerOptions.workerSrc = "pdfjs-dist/build/pdf.worker.mjs";

export const checkRules = async (req, res) => {
  try {
    const rules = JSON.parse(req.body.rules);
    const pdfPath = req.file.path;

    // Load PDF
    const data = new Uint8Array(fs.readFileSync(pdfPath));
    const loadingTask = pdfjsLib.getDocument({ data });
    const pdf = await loadingTask.promise;

    let fullText = "";

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const content = await page.getTextContent();
      const text = content.items.map((item) => item.str).join(" ");
      fullText += text + "\n\n";
    }

    const textLower = fullText.toLowerCase();

    function smartCheck(rule, text) {
      const ruleLower = rule.toLowerCase();

      // 1) Try regex-based smart detection
      for (let key in detectors) {
        if (ruleLower.includes(key)) {
          const match = text.match(detectors[key]);
          if (match) {
            return {
              status: "pass",
              evidence: `Found: ${match[0]}`,
              reasoning: `Detected ${key} information in the document.`,
              confidence: 90,
            };
          }
        }
      }

      // 2) Try keyword matching
      const keywords = ruleLower.split(" ").filter((w) => w.length > 3);

      for (let key of keywords) {
        if (text.includes(key)) {
          return {
            status: "pass",
            evidence: `Matched keyword: ${key}`,
            reasoning: `Document text contains relevant keyword.`,
            confidence: 75,
          };
        }
      }

      // 3) Fail fallback
      return {
        status: "fail",
        evidence: "No relevant information found",
        reasoning: "Could not detect anything related to the rule.",
        confidence: 40,
      };
    }

    const safeText = fullText.slice(0, 10000);
    const llmResponse = await checkWithLLM(safeText, rules);
    const results = JSON.parse(llmResponse);

    if (!llmResponse)
      results = rules.map((rule) => smartCheck(rule, textLower));

    // Delete temporary PDF
    fs.unlink(pdfPath, () => {});

    return res.json({ success: true, results });
  } catch (err) {
    console.error("Rule check error:", err);
    return res.status(500).json({
      success: false,
      message: "Error checking rules",
    });
  }
};
