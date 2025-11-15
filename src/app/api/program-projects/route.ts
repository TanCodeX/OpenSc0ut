import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { scrapeProgramArchive } from '@/lib/scrapers/programScraper';

export const runtime = 'nodejs'; // Enable Node.js APIs for scraping

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const program = searchParams.get('program') || undefined;
  const year = searchParams.get('year') ? parseInt(searchParams.get('year')!, 10) : undefined;

  const where: any = {};
  if (program) where.program = program;
  if (year) where.year = year;

  try {
    // First, check if data exists for the requested year
    let projects = await prisma.programProject.findMany({
      where,
      orderBy: { organizationName: 'asc' },
    });

    // If no data exists for the requested year and program, automatically sync it
    if (projects.length === 0 && year && program) {
      try {
        console.log(`No data found for ${program} ${year}. Auto-syncing...`);
        const scrapedProjects = await scrapeProgramArchive(year, program);
        
        // Sync the projects to database
        for (const project of scrapedProjects) {
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
        }

        // Fetch the synced projects
        projects = await prisma.programProject.findMany({
          where,
          orderBy: { organizationName: 'asc' },
        });

        console.log(`Auto-synced ${projects.length} projects for ${program} ${year}`);
      } catch (syncError) {
        console.error(`Error auto-syncing ${program} ${year}:`, syncError);
        // Return empty array if sync fails, don't throw error
        return NextResponse.json([]);
      }
    }

    return NextResponse.json(projects);
  } catch (err) {
    console.error('Error fetching projects:', err);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}
