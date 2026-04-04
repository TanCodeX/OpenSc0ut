import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { scrapeProgramArchive } from "@/lib/scrapers/programScraper";

export const runtime = "nodejs";

/** Vercel Cron invokes this path with GET; manual triggers may use POST with a JSON body. */
export const dynamic = "force-dynamic";

/** Allow long runs on supported plans (Vercel caps by tier). */
export const maxDuration = 300;

function isAuthorized(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const authHeader = req.headers.get("authorization");
  return authHeader === `Bearer ${secret}`;
}

async function parseSpecifiedYear(req: NextRequest, includeBody: boolean): Promise<number | null> {
  if (includeBody) {
    try {
      const body = await req.json();
      if (body?.year != null && body.year !== "") {
        const y = parseInt(String(body.year), 10);
        if (!Number.isNaN(y)) return y;
      }
    } catch {
      /* empty or non-JSON body */
    }
  }
  const queryYear = new URL(req.url).searchParams.get("year");
  if (queryYear) {
    const y = parseInt(queryYear, 10);
    if (!Number.isNaN(y)) return y;
  }
  return null;
}

async function runSync(req: NextRequest, includeJsonBody: boolean): Promise<NextResponse> {
  if (!process.env.CRON_SECRET) {
    console.error("CRON_SECRET is not set; cron sync cannot be authorized.");
    return NextResponse.json(
      { success: false, error: "Server misconfiguration: CRON_SECRET is not set." },
      { status: 500 }
    );
  }

  if (!isAuthorized(req)) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const specifiedYear = await parseSpecifiedYear(req, includeJsonBody);
  const currentYear = new Date().getFullYear();
  const yearsToSync = specifiedYear
    ? [specifiedYear]
    : Array.from({ length: 6 }, (_, idx) => currentYear - idx);

  let totalProcessed = 0;
  const results: { year: number; count: number; error?: string }[] = [];

  try {
    for (const year of yearsToSync) {
      try {
        console.log(`Syncing GSoC projects for year ${year}...`);
        const projects = await scrapeProgramArchive(year, "GSoC");

        for (const project of projects) {
          await prisma.programProject.upsert({
            where: {
              projectUrl_year: {
                projectUrl: project.projectUrl,
                year: project.year,
              },
            },
            update: {
              program: project.program,
              organizationName: project.organizationName,
              projectName: project.projectName,
              topics: project.topics,
              description: project.description,
            },
            create: {
              ...project,
            },
          });
          totalProcessed++;
        }

        results.push({ year, count: projects.length });
        console.log(`✓ Synced ${projects.length} projects for ${year}`);
      } catch (yearError) {
        const errorMsg = yearError instanceof Error ? yearError.message : String(yearError);
        console.error(`✗ Error syncing year ${year}:`, errorMsg);
        results.push({ year, count: 0, error: errorMsg });
      }
    }

    return NextResponse.json({
      success: true,
      message: `Sync complete. ${totalProcessed} total projects processed.`,
      results,
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: (err as Error).message },
      { status: 500 }
    );
  }
}

/** Vercel Cron schedules call this route with GET + Authorization: Bearer CRON_SECRET */
export async function GET(req: NextRequest) {
  return runSync(req, false);
}

/** Optional manual trigger: POST with same Authorization header; optional JSON `{ "year": 2024 }` */
export async function POST(req: NextRequest) {
  return runSync(req, true);
}
