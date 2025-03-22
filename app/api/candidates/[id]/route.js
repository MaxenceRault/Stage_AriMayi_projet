import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(_, { params }) {
  try {
    const { id } = params;

    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      select: {
        name: true,
        email: true,
        candidate: {
          select: {
            coverLetter: true,
            additionalInfo: true,
            cvUrl: true,
          },
        },
      },
    });

    if (!user || !user.candidate) {
      return NextResponse.json({ error: 'Candidat introuvable' }, { status: 404 });
    }

    return NextResponse.json({
      candidate: {
        id,
        name: user.name,
        email: user.email,
        coverLetter: user.candidate.coverLetter,
        additionalInfo: user.candidate.additionalInfo,
        cvUrl: user.candidate.cvUrl,
      },
    });
  } catch (error) {
    console.error('Erreur candidat [id] :', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
