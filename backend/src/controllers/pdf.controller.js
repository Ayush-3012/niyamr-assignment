import fs from "fs";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import { checkWithLLM } from "../utils/llm.js";

pdfjsLib.GlobalWorkerOptions.workerSrc = "pdfjs-dist/build/pdf.worker.mjs";

export const checkRules = async (req, res) => {
  try {
    const rules = JSON.parse(req.body.rules);
    const pdfPath = req.file.path;
    const data = new Uint8Array(fs.readFileSync(pdfPath));

    // Load PDF
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

    // SMART DETECTORS
    const detectors = {
      email: /[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/g,
      phone: /(\+?\d{1,3}[-\s]?)?\d{10}/g,
      date: /\b(20\d{2}|19\d{2})\b|\b\d{1,2}[\/.-]\d{1,2}[\/.-]\d{2,4}\b/g,
      skills: /(javascript|react|node|python|java|sql|mongodb|aws)/gi,
      education:
        /(b\.tech|btech|bachelor|master|graduation|university|college|12th|10th)/gi,
      experience: /(experience|worked|intern|role|position|company)/gi,
    };

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

    const llmResponse = await checkWithLLM(fullText, rules);
    const results = JSON.parse(llmResponse);

    // if (!llmResponse) {
    //   results = rules.map((rule) => smartCheck(rule, textLower));
    // }

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
