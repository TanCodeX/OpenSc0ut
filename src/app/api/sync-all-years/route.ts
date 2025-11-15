import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { scrapeProgramArchive } from '@/lib/scrapers/programScraper';

export const runtime = 'nodejs';

/**
 * Development endpoint to sync all years without authentication
 * WARNING: This should be removed or protected in production!
 */
export async function POST(req: NextRequest) {
  // Only allow in development
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 403 });
  }

  const currentYear = new Date().getFullYear();
  const yearsToSync = Array.from({ length: 6 }, (_, idx) => currentYear - idx);

  let totalProcessed = 0;
  const results: { year: number; count: number; error?: string }[] = [];

  try {
    for (const year of yearsToSync) {
      try {
        console.log(`Syncing GSoC projects for year ${year}...`);
        const projects = await scrapeProgramArchive(year, 'GSoC');
        
        for (const project of projects) {
          await prisma.programProject.upsert({
            where: { 
              projectUrl_year: {
                projectUrl: project.projectUrl,
                year: project.year,
              }
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
      results 
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: (err as Error).message }, { status: 500 });
  }
}

