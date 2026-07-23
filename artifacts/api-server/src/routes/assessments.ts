import { Router, type IRouter } from "express";
import { insertAssessment, getAssessmentById } from "@workspace/db";
import {
  SubmitAssessmentBody,
  SubmitAssessmentResponse,
  GetAssessmentParams,
  GetAssessmentResponse,
} from "@workspace/api-zod";
import { score } from "../lib/scoring.js";

const router: IRouter = Router();

router.post("/assessments", async (req, res): Promise<void> => {
  const parsed = SubmitAssessmentBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const input = parsed.data;
  const { focusScore, mineralScore, recommendation } = score({
    activityLevel: input.activityLevel,
    focusDifficulty: input.focusDifficulty,
    hyperactivity: input.hyperactivity,
    homework: input.homework,
    diet: input.diet,
    vegetables: input.vegetables,
    supplements: input.supplements,
  });

  const assessment = await insertAssessment({
    parentName: input.parentName,
    email: input.email,
    phone: input.phone ?? null,
    childName: input.childName,
    age: input.age,
    gender: input.gender,
    activityLevel: input.activityLevel,
    focusDifficulty: input.focusDifficulty,
    hyperactivity: input.hyperactivity,
    homework: input.homework,
    diet: input.diet,
    vegetables: input.vegetables,
    supplements: input.supplements,
    allergies: input.allergies ?? null,
    medications: input.medications ?? null,
    notes: input.notes ?? null,
    focusScore,
    mineralScore,
    recommendation,
  });

  res.status(201).json(SubmitAssessmentResponse.parse(assessment));
});

router.get("/assessments/:id", async (req, res): Promise<void> => {
  const params = GetAssessmentParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const assessment = await getAssessmentById(params.data.id);

  if (!assessment) {
    res.status(404).json({ error: "Assessment not found" });
    return;
  }

  res.json(GetAssessmentResponse.parse(assessment));
});

export default router;
