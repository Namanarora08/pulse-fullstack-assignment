import {
  PrismaClient,
  QuestionType,
  QuestionCategory,
  Direction
} from "@prisma/client";

const prisma = new PrismaClient();

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const DOCTOR_EMAIL = "dr.amara.okafor@pulsecare.dev";

type Trend = "improving" | "deteriorating" | "stable";

const PATIENTS: { email: string; name: string; trend: Trend }[] = [
  {
    email: "patient.improving@pulsecare.dev",
    name: "Jordan Lee",
    trend: "improving"
  },
  {
    email: "patient.deteriorating@pulsecare.dev",
    name: "Mira Patel",
    trend: "deteriorating"
  },
  {
    email: "patient.stable@pulsecare.dev",
    name: "Avery Stone",
    trend: "stable"
  }
];

const TOTAL_DAYS = 30;
const MISSED_DAY_PROBABILITY = 0.12; // ~3-4 missed days per patient
const SKIP_ANSWER_PROBABILITY = 0.08; // ~1 in 12 answers skipped
const STABLE_PROGRESS = 0.75; // stable patient sits in a healthy steady-state

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function randomInRange(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function startOfDay(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function daysAgo(days: number) {
  const d = startOfDay(new Date());
  d.setDate(d.getDate() - days);
  return d;
}

function lerp(start: number, end: number, t: number) {
  return start + (end - start) * t;
}

/**
 * Returns a 0..1 "how far along the trend arc" value for a given day index
 * (0 = 29 days ago, TOTAL_DAYS-1 = today). This is what makes the charts for
 * each patient visually read as improving / deteriorating / stable once the
 * scoring engine is built on top of this data.
 */
function trendProgress(trend: Trend, dayIndex: number, totalDays: number) {
  if (trend === "stable") return STABLE_PROGRESS;
  const t = dayIndex / (totalDays - 1);
  return trend === "improving" ? t : 1 - t;
}

// ---------------------------------------------------------------------------
// Seed
// ---------------------------------------------------------------------------

async function main() {
  console.log("Seeding Pulse database...");

  // 1. Doctor -------------------------------------------------------------
  const doctor = await prisma.doctor.upsert({
    where: { email: DOCTOR_EMAIL },
    update: { name: "Dr. Amara Okafor" },
    create: {
      name: "Dr. Amara Okafor",
      email: DOCTOR_EMAIL
    }
  });

  // 2. Patients -------------------------------------------------------------
  const patients: Array<{
    id: string;
    name: string;
    email: string;
    trend: Trend;
  }> = [];
  for (const p of PATIENTS) {
    const patient = await prisma.patient.upsert({
      where: { email: p.email },
      update: { name: p.name, doctorId: doctor.id },
      create: {
        name: p.name,
        email: p.email,
        doctorId: doctor.id
      }
    });
    patients.push({ ...patient, trend: p.trend });
  }

  // 3. Wipe previous check-in data for these patients so reruns don't
  //    duplicate rows (Answer rows cascade-delete with their DailyCheckIn).
  await prisma.dailyCheckIn.deleteMany({
    where: { patientId: { in: patients.map((p) => p.id) } }
  });

  // 4. Wipe any previously seeded checklist owned by this doctor.
  //    Questions cascade-delete with it; patients just lose their
  //    checklistId (onDelete: SetNull) rather than being deleted.
  await prisma.checklist.deleteMany({ where: { doctorId: doctor.id } });

  // 5. Checklist + ~6 Questions ---------------------------------------------
  const checklist = await prisma.checklist.create({
    data: {
      title: "Daily Wellness Check-in",
      description:
        "Standard daily checklist covering symptom severity and treatment adherence.",
      doctorId: doctor.id,
      questions: {
        create: [
          {
            prompt: "Did you take your prescribed medication today?",
            category: QuestionCategory.ADHERENCE,
            type: QuestionType.YES_NO,
            weight: 5,
            direction: Direction.HIGHER_BETTER,
            order: 0
          },
          {
            prompt: "Did you complete your recommended activity/exercise?",
            category: QuestionCategory.ADHERENCE,
            type: QuestionType.YES_NO,
            weight: 3,
            direction: Direction.HIGHER_BETTER,
            order: 1
          },
          {
            prompt: "Rate your overall pain level today",
            category: QuestionCategory.SYMPTOM,
            type: QuestionType.SCALE,
            weight: 5,
            direction: Direction.HIGHER_WORSE,
            order: 2
          },
          {
            prompt: "Rate your energy level today",
            category: QuestionCategory.SYMPTOM,
            type: QuestionType.SCALE,
            weight: 3,
            direction: Direction.HIGHER_BETTER,
            order: 3
          },
          {
            prompt: "Record your resting heart rate",
            category: QuestionCategory.SYMPTOM,
            type: QuestionType.NUMERIC,
            weight: 4,
            direction: Direction.HIGHER_WORSE,
            order: 4,
            rangeMin: 60,
            rangeMax: 90,
            hardMin: 40,
            hardMax: 140,
            unit: "bpm"
          },
          {
            prompt: "Record your body temperature",
            category: QuestionCategory.SYMPTOM,
            type: QuestionType.NUMERIC,
            weight: 2,
            direction: Direction.HIGHER_WORSE,
            order: 5,
            rangeMin: 97,
            rangeMax: 99,
            hardMin: 95,
            hardMax: 104,
            unit: "\u00b0F"
          }
        ]
      }
    },
    include: { questions: true }
  });

  // 6. Assign the checklist to every seeded patient -------------------------
  await prisma.patient.updateMany({
    where: { id: { in: patients.map((p) => p.id) } },
    data: { checklistId: checklist.id }
  });

  const sortedQuestions = [...checklist.questions].sort(
    (a, b) => a.order - b.order
  );
  const [medQ, exerciseQ, painQ, energyQ, heartRateQ, tempQ] = sortedQuestions;

  // 7. ~30 days of DailyCheckIns + Answers per patient ----------------------
  for (const patient of patients) {
    for (let dayIndex = 0; dayIndex < TOTAL_DAYS; dayIndex++) {
      const date = daysAgo(TOTAL_DAYS - 1 - dayIndex);
      const isMostRecentDay = dayIndex === TOTAL_DAYS - 1;

      // Missed day: no check-in at all for this date. Always keep the most
      // recent day so every patient has a current data point.
      if (!isMostRecentDay && Math.random() < MISSED_DAY_PROBABILITY) {
        continue;
      }

      const progress = trendProgress(patient.trend, dayIndex, TOTAL_DAYS);
      const noise = () => randomInRange(-0.08, 0.08);

      const checkIn = await prisma.dailyCheckIn.create({
        data: { patientId: patient.id, date }
      });

      const answers: Array<{
        questionId: string;
        boolValue?: boolean;
        scaleValue?: number;
        numericValue?: number;
      }> = [];

      // Medication adherence (yes/no): trends with progress.
      const medProbability = clamp(
        lerp(0.55, 0.97, progress) + noise(),
        0.05,
        0.99
      );
      answers.push({
        questionId: medQ.id,
        boolValue: Math.random() < medProbability
      });

      // Exercise adherence (yes/no): trends with progress, lower baseline.
      const exerciseProbability = clamp(
        lerp(0.4, 0.9, progress) + noise(),
        0.05,
        0.99
      );
      answers.push({
        questionId: exerciseQ.id,
        boolValue: Math.random() < exerciseProbability
      });

      // Pain (1-5, lower is better): improving trend goes high -> low.
      const painValue = Math.round(
        clamp(lerp(4.2, 1.3, progress) + randomInRange(-0.6, 0.6), 1, 5)
      );
      answers.push({ questionId: painQ.id, scaleValue: painValue });

      // Energy (1-5, higher is better): improving trend goes low -> high.
      const energyValue = Math.round(
        clamp(lerp(1.8, 4.5, progress) + randomInRange(-0.6, 0.6), 1, 5)
      );
      answers.push({ questionId: energyQ.id, scaleValue: energyValue });

      // Resting heart rate (bpm): improving trend goes elevated -> normal.
      const heartRateValue = Math.round(
        clamp(lerp(98, 72, progress) + randomInRange(-4, 4), 55, 135)
      );
      answers.push({ questionId: heartRateQ.id, numericValue: heartRateValue });

      // Body temperature (\u00b0F): improving trend goes elevated -> normal.
      const tempValue = Number(
        clamp(
          lerp(99.6, 98.5, progress) + randomInRange(-0.3, 0.3),
          96,
          103
        ).toFixed(1)
      );
      answers.push({ questionId: tempQ.id, numericValue: tempValue });

      // Skipped questions: randomly drop some answers from this check-in.
      const answersToCreate = answers.filter(
        () => Math.random() > SKIP_ANSWER_PROBABILITY
      );

      if (answersToCreate.length > 0) {
        await prisma.answer.createMany({
          data: answersToCreate.map((a) => ({
            dailyCheckInId: checkIn.id,
            questionId: a.questionId,
            boolValue: a.boolValue ?? null,
            scaleValue: a.scaleValue ?? null,
            numericValue: a.numericValue ?? null
          }))
        });
      }
    }
  }

  console.log("Seed complete:");
  console.log(`  Doctor:    ${doctor.name} <${doctor.email}>`);
  for (const p of patients) {
    console.log(`  Patient:   ${p.name} <${p.email}> [${p.trend}]`);
  }
  console.log(
    `  Checklist: ${checklist.title} (${sortedQuestions.length} questions)`
  );
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
