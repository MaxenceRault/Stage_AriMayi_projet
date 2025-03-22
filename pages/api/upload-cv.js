// pages/api/upload-cv.js
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

const uploadDir = path.join(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  const form = formidable({
    uploadDir,
    keepExtensions: true,
    maxFileSize: 10 * 1024 * 1024,
  });

  form.parse(req, (err, fields, files) => {
    if (err) {
      console.error('Erreur upload:', err);
      return res.status(500).json({ error: 'Erreur serveur' });
    }

    const file = files.cv?.[0] || files.cv;
    if (!file) return res.status(400).json({ error: 'Aucun fichier' });

    const mimetype = file.mimetype || file.type;
    const allowed = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    if (!allowed.includes(mimetype)) {
      fs.unlinkSync(file.filepath);
      return res.status(400).json({ error: 'Type de fichier interdit' });
    }

    const fileName = path.basename(file.filepath);
    const fileUrl = `/uploads/${fileName}`;
    return res.status(200).json({ message: 'Upload réussi', url: fileUrl });
  });
}
