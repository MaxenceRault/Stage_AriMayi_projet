import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];

    // ✅ Décoder le token pour récupérer l'ID utilisateur
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    // 🔎 Récupérer l'utilisateur et son profil candidat lié
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        candidate: {
          select: {
            id: true,
            additionalInfo: true,
            coverLetter: true,
            cvUrl: true,
          }
        }
      }
    });
    

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur introuvable' }, { status: 404 });
    }

    // 🔄 Fusionner les infos utiles pour le front
    const profile = {
      name: user.name,
      email: user.email,
      ...user.candidate,
    };

    return NextResponse.json({ candidate: profile }, { status: 200 });

  } catch (error) {
    console.error('Erreur récupération profil candidat :', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
