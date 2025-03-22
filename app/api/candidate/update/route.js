import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const body = await request.json();
    const { cvUrl, coverLetter, additionalInfo } = body;

    const updatedCandidate = await prisma.candidate.update({
      where: { userId },
      data: {
        cvUrl,
        coverLetter,
        additionalInfo,
      },
    });

    return NextResponse.json({ message: 'Profil mis à jour', candidate: updatedCandidate });
  } catch (error) {
    console.error('Erreur update candidat:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
