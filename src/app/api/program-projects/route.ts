import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const program = searchParams.get('program') || undefined;
  const year = searchParams.get('year') ? parseInt(searchParams.get('year')!, 10) : undefined;

  const where: any = {};
  if (program) where.program = program;
  if (year) where.year = year;

  try {
    const projects = await prisma.programProject.findMany({
      where,
      orderBy: { organizationName: 'asc' },
    });
    return NextResponse.json(projects);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}
