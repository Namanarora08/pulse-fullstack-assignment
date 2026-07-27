import { NextRequest } from "next/server";

import {
  derivePatientProfile,
  logAndFail,
  patientKeywordFilter,
  successResponse
} from "@/lib/api";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

interface PatientWithCheckIns {
  id: string;
  name: string;
  email: string;
  dailyCheckIns: Array<{
    date: Date;
    answers: Array<{ id: string }>;
  }>;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";

    const patients: PatientWithCheckIns[] = await prisma.patient.findMany({
      where: query ? patientKeywordFilter(query) : {},
      include: {
        dailyCheckIns: {
          take: 1,
          orderBy: { date: "desc" },
          include: { answers: true }
        }
      },
      orderBy: { name: "asc" }
    });

    if (patients.length > 0) {
      const formatted = patients.map((patient: PatientWithCheckIns) => {
        const { status, condition } = derivePatientProfile(patient);

        const latestCheckIn = patient.dailyCheckIns[0];
        const checkInsFormatted = latestCheckIn
          ? [
              {
                completed: latestCheckIn.answers.length > 0,
                date: latestCheckIn.date.toISOString()
              }
            ]
          : [];

        return {
          id: patient.id,
          name: patient.name,
          email: patient.email,
          status,
          condition,
          checkIns: checkInsFormatted
        };
      });

      return successResponse(formatted);
    }

    // Fallback mock patients if DB empty
    const fallbackPatients = [
      {
        id: "demo",
        name: "Avery Stone",
        email: "avery.stone@example.com",
        status: "Stable",
        condition: "Hypertension",
        checkIns: [{ completed: true, date: new Date().toISOString() }]
      },
      {
        id: "mira",
        name: "Mira Patel",
        email: "mira.patel@example.com",
        status: "Watch",
        condition: "Post-op Recovery",
        checkIns: [{ completed: false, date: new Date().toISOString() }]
      },
      {
        id: "jordan",
        name: "Jordan Lee",
        email: "jordan.lee@example.com",
        status: "Improving",
        condition: "Asthma Management",
        checkIns: [{ completed: true, date: new Date().toISOString() }]
      }
    ];

    return successResponse(fallbackPatients);
  } catch (error) {
    return logAndFail(error, {
      log: "Error fetching patient roster",
      message: "Failed to fetch patients"
    });
  }
}
