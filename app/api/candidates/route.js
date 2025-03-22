import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const candidates = await prisma.candidate.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    const formatted = candidates.map((c) => ({
      id: c.user.id,
      name: c.user.name,
      email: c.user.email,
    }));

    return NextResponse.json({ candidates: formatted });
  } catch (error) {
    console.error('Erreur fetch candidats :', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
