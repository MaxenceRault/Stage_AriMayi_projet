import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const runtime = 'nodejs';

const prisma = new PrismaClient();

export async function POST(request) {
    try {
        const body = await request.json();
        const { name, email, password } = body;

        // Vérifier si l'utilisateur existe déjà
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return NextResponse.json({ error: 'User already exists' }, { status: 400 });
        }

        // Hachage du mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Création de l'utilisateur
        const user = await prisma.user.create({
            data: { name, email, password: hashedPassword },
        });

        // Création du profil candidat associé
        const candidate = await prisma.candidate.create({
            data: { userId: user.id },
        });

        // Génération du token JWT
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        return NextResponse.json(
            { message: 'Signup successful', token, user, candidate },
            { status: 201 }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
