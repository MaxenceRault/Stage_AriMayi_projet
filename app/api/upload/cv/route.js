import { NextResponse } from 'next/server';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

export const runtime = 'nodejs';

export const config = {
  api: {
    bodyParser: false,
  },
};

const uploadDir = path.join(process.cwd(), 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

function isValidFileType(mimetype) {
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];
  return allowedTypes.includes(mimetype);
}

// Convertit un ReadableStream (Web) vers un Readable stream Node.js + headers simulés
async function getNodeRequest(request) {
  const body = request.body;
  if (!body) throw new Error('Pas de body dans la requête');

  const reader = body.getReader();
  const chunks = [];

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
  }

  const buffer = Buffer.concat(chunks);

  // Faux objet IncomingMessage compatible avec formidable
  const req = new ReadableStreamToNodeReadable(buffer);
  req.headers = Object.fromEntries(request.headers.entries());
  req.method = request.method;

  return req;
}

// Convertisseur stream
import { Readable } from 'stream';
class ReadableStreamToNodeReadable extends Readable {
  constructor(buffer) {
    super();
    this.buffer = buffer;
  }

  _read() {
    this.push(this.buffer);
    this.push(null);
  }
}

export async function POST(request) {
  console.log('✅ Upload reçu');

  try {
    const nodeReq = await getNodeRequest(request);

    const form = formidable({
      multiples: false,
      uploadDir,
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024,
    });

    const { fields, files } = await new Promise((resolve, reject) => {
      form.parse(nodeReq, (err, fields, files) => {
        if (err) reject(err);
        else resolve({ fields, files });
        console.log('📂 Fichier reçu :', files);

      });
      
    });

    const file = files.cv?.[0] || files.cv;
    if (!file) {
      return NextResponse.json({ error: 'Aucun fichier reçu' }, { status: 400 });
    }

    const mimetype = file.mimetype || file.type;
    if (!isValidFileType(mimetype)) {
      if (fs.existsSync(file.filepath)) fs.unlinkSync(file.filepath);
      return NextResponse.json({ error: 'Type de fichier non autorisé.' }, { status: 400 });
    }

    const fileName = path.basename(file.filepath);
    const fileUrl = `/uploads/${fileName}`;

    return NextResponse.json({ message: 'Upload réussi', url: fileUrl });
  } catch (error) {
    console.error('Erreur upload CV :', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
