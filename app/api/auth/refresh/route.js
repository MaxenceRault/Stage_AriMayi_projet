// app/api/auth/refresh/route.js
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;

export async function POST(request) {
  try {
    const body = await request.json();
    const { refreshToken } = body;
    
    if (!refreshToken) {
      return new Response(JSON.stringify({ error: 'Refresh token manquant' }), { status: 400 });
    }

    // Vérification du refresh token
    const decoded = jwt.verify(refreshToken, REFRESH_SECRET);

    // Optionnel : vérifier dans la base de données si le refresh token est toujours valide
    // Par exemple, comparer avec un refresh token stocké ou vérifier un flag de révocation

    // Générer un nouveau access token
    const newAccessToken = jwt.sign(
      { userId: decoded.userId, email: decoded.email, role: decoded.role },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    return new Response(JSON.stringify({ accessToken: newAccessToken }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Refresh token invalide ou expiré' }), { status: 401 });
  }
}
