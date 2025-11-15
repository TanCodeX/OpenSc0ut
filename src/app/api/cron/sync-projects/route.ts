import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { scrapeProgramArchive } from '@/lib/scrapers/programScraper';

export const runtime = 'nodejs'; // enable node APIs

export async function POST(req: NextRequest) {

  console.log("DATABASE_URL_IS:", process.env.DATABASE_URL);
  // 1. Auth
  const authHeader = req.headers.get('authorization');
  if (!authHeader || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  // 2. Scrape and Sync
  const year = new Date().getFullYear();
  let totalProcessed = 0;
  try {
    // Fetch GSoC projects. (For multiple programs you could expand this loop)
    const projects = await scrapeProgramArchive(year, 'GSoC');
    for (const project of projects) {
      await prisma.programProject.upsert({
        where: { projectUrl: project.projectUrl },
        update: {
          year: project.year,
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
    return NextResponse.json({ success: true, message: `Sync complete. ${totalProcessed} projects processed.` });
  } catch (err) {
    return NextResponse.json({ success: false, error: (err as Error).message }, { status: 500 });
  }
}
