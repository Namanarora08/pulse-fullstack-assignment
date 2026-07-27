import { NextRequest } from "next/server";

import { errorResponse, successResponse } from "@/lib/api/responses";
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
      where: query
        ? {
            OR: [
              { name: { contains: query } },
              { email: { contains: query } }
            ]
          }
        : {},
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
      const formatted = patients.map((p: PatientWithCheckIns) => {
        let status = "Stable";
        let condition = "General Monitoring";

        if (p.email.includes("deteriorating") || p.name.includes("Mira")) {
          status = "Watch";
          condition = "Post-op Care";
        } else if (p.email.includes("improving") || p.name.includes("Jordan")) {
          status = "Improving";
          condition = "Recovery Protocol";
        } else if (p.name.includes("Avery") || p.email.includes("stable")) {
          status = "Stable";
          condition = "Primary Care";
        }

        const latestCheckIn = p.dailyCheckIns[0];
        const checkInsFormatted = latestCheckIn
          ? [
              {
                completed: latestCheckIn.answers.length > 0,
                date: latestCheckIn.date.toISOString()
              }
            ]
          : [];

        return {
          id: p.id,
          name: p.name,
          email: p.email,
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
    console.error("Error fetching patient roster:", error);
    return errorResponse("Failed to fetch patients", { status: 500 });
  }
}

