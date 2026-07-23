import { Router, type IRouter } from "express";
import {
  getAllAssessments,
  getAllAssessmentsSortedByDateDesc,
  getAssessmentById,
  deleteAssessmentById,
  listAssessments,
} from "@workspace/db";
import {
  AdminLoginBody,
  AdminLoginResponse,
  GetAdminMeResponse,
  GetAdminStatsResponse,
  ListAdminAssessmentsQueryParams,
  ListAdminAssessmentsResponse,
  GetAdminAssessmentParams,
  GetAdminAssessmentResponse,
  DeleteAdminAssessmentParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

const ADMIN_PASSWORD =
  process.env["ADMIN_PASSWORD"] ?? "purebotanica2024";

// ── Auth middleware ──────────────────────────────────────────────────────────

function requireAdmin(
  req: Parameters<typeof router.use>[0] extends never ? never : any,
  res: any,
  next: any,
) {
  if ((req.session as any)?.isAdmin === true) {
    next();
  } else {
    res.status(401).json({ error: "Not authenticated" });
  }
}

// ── Auth routes ──────────────────────────────────────────────────────────────

router.post("/admin/login", async (req, res): Promise<void> => {
  const parsed = AdminLoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  if (parsed.data.password !== ADMIN_PASSWORD) {
    res.status(401).json({ error: "Invalid password" });
    return;
  }

  (req.session as any).isAdmin = true;
  res.json(AdminLoginResponse.parse({ authenticated: true }));
});

router.post("/admin/logout", (req, res): void => {
  req.session.destroy(() => {
    res.json({ authenticated: false });
  });
});

router.get("/admin/me", (req, res): void => {
  const authenticated = (req.session as any)?.isAdmin === true;
  res.json(GetAdminMeResponse.parse({ authenticated }));
});

// ── Protected routes ─────────────────────────────────────────────────────────

router.get("/admin/stats", requireAdmin, async (req, res): Promise<void> => {
  const all = await getAllAssessments();

  const totalAssessments = all.length;
  const focusCount = all.filter((a) => a.recommendation === "focus").length;
  const mineralCount = all.filter((a) => a.recommendation === "mineral").length;
  const bothCount = all.filter((a) => a.recommendation === "both").length;

  // Age distribution
  const ageCounts: Record<number, number> = {};
  for (const a of all) {
    ageCounts[a.age] = (ageCounts[a.age] ?? 0) + 1;
  }
  const ageDistribution = Object.entries(ageCounts)
    .map(([age, cnt]) => ({ age: Number(age), count: cnt }))
    .sort((a, b) => a.age - b.age);

  // Gender distribution
  const genderCounts: Record<string, number> = {};
  for (const a of all) {
    genderCounts[a.gender] = (genderCounts[a.gender] ?? 0) + 1;
  }
  const genderDistribution = Object.entries(genderCounts).map(
    ([gender, cnt]) => ({ gender, count: cnt }),
  );

  // Recommendation distribution
  const recCounts: Record<string, number> = {};
  for (const a of all) {
    recCounts[a.recommendation] = (recCounts[a.recommendation] ?? 0) + 1;
  }
  const recommendationDistribution = Object.entries(recCounts).map(
    ([recommendation, cnt]) => ({ recommendation, count: cnt }),
  );

  // Common symptoms
  const symptoms: Record<string, number> = {};
  for (const a of all) {
    if (a.focusDifficulty === "often" || a.focusDifficulty === "sometimes") {
      const label = "Difficulty Focusing";
      symptoms[label] = (symptoms[label] ?? 0) + 1;
    }
    if (a.hyperactivity === "often" || a.hyperactivity === "sometimes") {
      const label = "Hyperactivity";
      symptoms[label] = (symptoms[label] ?? 0) + 1;
    }
    if (a.activityLevel === "very_active") {
      const label = "Very Active";
      symptoms[label] = (symptoms[label] ?? 0) + 1;
    }
    if (a.homework === "no" || a.homework === "sometimes") {
      const label = "Homework Difficulty";
      symptoms[label] = (symptoms[label] ?? 0) + 1;
    }
    if (a.diet === "poor" || a.diet === "average") {
      const label = "Poor Diet";
      symptoms[label] = (symptoms[label] ?? 0) + 1;
    }
    if (a.vegetables === "0" || a.vegetables === "1") {
      const label = "Low Vegetable Intake";
      symptoms[label] = (symptoms[label] ?? 0) + 1;
    }
  }
  const commonSymptoms = Object.entries(symptoms)
    .map(([symptom, cnt]) => ({ symptom, count: cnt }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  res.json(
    GetAdminStatsResponse.parse({
      totalAssessments,
      focusCount,
      mineralCount,
      bothCount,
      ageDistribution,
      genderDistribution,
      recommendationDistribution,
      commonSymptoms,
    }),
  );
});

router.get(
  "/admin/assessments",
  requireAdmin,
  async (req, res): Promise<void> => {
    const qp = ListAdminAssessmentsQueryParams.safeParse(req.query);
    if (!qp.success) {
      res.status(400).json({ error: qp.error.message });
      return;
    }

    const { search, recommendation, page = 1, limit = 20 } = qp.data;
    const offset = (page - 1) * limit;

    const { total, rows } = await listAssessments({
      search,
      recommendation,
      page,
      limit,
    });

    res.json(
      ListAdminAssessmentsResponse.parse({
        data: rows,
        total,
        page,
        limit,
      }),
    );
  },
);

router.get(
  "/admin/assessments/export",
  requireAdmin,
  async (req, res): Promise<void> => {
    const format = req.query["format"] === "xlsx" ? "xlsx" : "csv";
    const rows = await getAllAssessmentsSortedByDateDesc();

    const headers = [
      "ID",
      "Parent Name",
      "Email",
      "Phone",
      "Child Name",
      "Age",
      "Gender",
      "Activity Level",
      "Focus Difficulty",
      "Hyperactivity",
      "Homework",
      "Diet",
      "Vegetables",
      "Supplements",
      "Allergies",
      "Medications",
      "Notes",
      "Focus Score",
      "Mineral Score",
      "Recommendation",
      "Created At",
    ];

    const csvRows = rows.map((r) => [
      r.id,
      r.parentName,
      r.email,
      r.phone ?? "",
      r.childName,
      r.age,
      r.gender,
      r.activityLevel,
      r.focusDifficulty,
      r.hyperactivity,
      r.homework,
      r.diet,
      r.vegetables,
      r.supplements,
      r.allergies ?? "",
      r.medications ?? "",
      r.notes ?? "",
      r.focusScore,
      r.mineralScore,
      r.recommendation,
      r.createdAt.toISOString(),
    ]);

    const escape = (v: unknown) => {
      const s = String(v);
      return s.includes(",") || s.includes('"') || s.includes("\n")
        ? `"${s.replace(/"/g, '""')}"`
        : s;
    };

    const csv = [headers, ...csvRows]
      .map((row) => row.map(escape).join(","))
      .join("\n");

    const filename = format === "xlsx" ? "assessments.xlsx" : "assessments.csv";
    const contentType =
      format === "xlsx"
        ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        : "text/csv";
    res.setHeader("Content-Type", contentType);
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${filename}"`,
    );
    res.send(csv);
  },
);

router.get(
  "/admin/assessments/:id",
  requireAdmin,
  async (req, res): Promise<void> => {
    const params = GetAdminAssessmentParams.safeParse(req.params);
    if (!params.success) {
      res.status(400).json({ error: params.error.message });
      return;
    }

    const assessment = await getAssessmentById(params.data.id);

    if (!assessment) {
      res.status(404).json({ error: "Assessment not found" });
      return;
    }

    res.json(GetAdminAssessmentResponse.parse(assessment));
  },
);

router.delete(
  "/admin/assessments/:id",
  requireAdmin,
  async (req, res): Promise<void> => {
    const params = DeleteAdminAssessmentParams.safeParse(req.params);
    if (!params.success) {
      res.status(400).json({ error: params.error.message });
      return;
    }

    const deleted = await deleteAssessmentById(params.data.id);

    if (!deleted) {
      res.status(404).json({ error: "Assessment not found" });
      return;
    }

    res.sendStatus(204);
  },
);

export default router;
