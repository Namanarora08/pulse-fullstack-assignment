import { NextRequest } from "next/server";

import {
  logAndFail,
  resolveDemoPatientId,
  successResponse,
  toDateKey
} from "@/lib/api";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

interface CheckInItemForStreak {
  id: string;
  date: Date;
  answers: Array<{ id: string }>;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const patientId = await resolveDemoPatientId(searchParams.get("patientId"));

    const checkIns: CheckInItemForStreak[] = await prisma.dailyCheckIn.findMany(
      {
        where: { patientId },
        select: { id: true, date: true, answers: { select: { id: true } } },
        orderBy: { date: "desc" }
      }
    );

    // A check-in counts as completed if it has at least one answer recorded
    const completedCheckIns = checkIns.filter(
      (checkIn: CheckInItemForStreak) => checkIn.answers.length > 0
    );

    let streakCount = 0;
    if (completedCheckIns.length > 0) {
      const dates = completedCheckIns.map((checkIn: CheckInItemForStreak) =>
        toDateKey(checkIn.date)
      );

      const uniqueDates: string[] = Array.from(new Set<string>(dates)).sort(
        (a: string, b: string) => (a < b ? 1 : -1)
      );

      const today = toDateKey(new Date());
      const yesterdayDate = new Date();
      yesterdayDate.setDate(yesterdayDate.getDate() - 1);
      const yesterday = toDateKey(yesterdayDate);

      const checkDate = uniqueDates.includes(today)
        ? new Date(today)
        : uniqueDates.includes(yesterday)
          ? new Date(yesterday)
          : null;

      if (checkDate) {
        while (uniqueDates.includes(toDateKey(checkDate))) {
          streakCount++;
          checkDate.setDate(checkDate.getDate() - 1);
        }
      }
    }

    return successResponse({
      patientId,
      currentStreak: streakCount,
      totalCompleted: completedCheckIns.length,
      history: completedCheckIns.map(
        (checkIn: CheckInItemForStreak) => checkIn.date
      )
    });
  } catch (error) {
    return logAndFail(error, {
      log: "Error calculating streak",
      message: "Failed to calculate streak"
    });
  }
}
