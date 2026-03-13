import { UserRole } from "@prisma/client";
import {
  getLanguageId,
  pollBatchResults,
  submitBatch,
} from "../lib/probelm.lib.js";
import axios from "axios";
import { prisma } from "../lib/db.js";

export const createProblem = async (req, res) => {
  const {
    title,
    description,
    difficulty,
    tags,
    examples,
    constraints,
    hints,
    editorial,
    testCases,
    codeSnippets,
    referenceSolutions,
  } = req.body;

  if (req.user.role !== UserRole.ADMIN) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  [];
  try {
    for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
      const languageId = getLanguageId(language);

      if (!languageId) {
        return res
          .status(400)
          .json({ error: `Unsupported language: ${language}` });
      }

      const submissions = testCases.map(({ input, output }) => ({
        source_code: solutionCode,
        language_id: languageId,
        stdin: input,
        expected_output: output,
      }));

      const submissionResults = await submitBatch(submissions);

      const tokens = submissionResults.map((res) => res.token); // [token , token , token]

      const results = await pollBatchResults(tokens);

      for (let i = 0; i < results.length; i++) {
        const result = results[i];

        if (result.status.id !== 3) {
          return res.status(400).json({
            error: `Validation failed for ${language} on input: ${submissions[i].stdin}`,
            details: result,
          });
        }
      }
    }

    const newProblem = await prisma.problem.create({
      data: {
        title,
        description,
        difficulty,
        tags,
        examples,
        constraints,
        hints,
        editorial,
        testCases,
        codeSnippets,
        referenceSolutions, // ✅ ADD THIS
        userId: req.user.id,
      },
    });

    res.status(201).json({
      success: true,
      message: "Problem created successfully",
      problem: newProblem,
    });
  } catch (error) {
    console.error("Error creating problem:", error);
    res.status(500).json({ error: "Failed to create problem" });
  }
};
