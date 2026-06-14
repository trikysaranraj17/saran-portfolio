import { connectDB } from '@/lib/mongodb';
import Message from '@/models/Message';
import fs from 'fs';
import path from 'path';

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !message) {
      return Response.json({ error: 'Missing fields' }, { status: 400 });
    }

    const ip = req.headers.get('x-forwarded-for') || 'unknown';

    try {
      await connectDB();
      const newMessage = await Message.create({ 
        name, 
        email, 
        subject: subject || 'No Subject', 
        message,
        ipAddress: ip
      });
      return Response.json({ success: true, id: newMessage._id }, { status: 201 });
    } catch (dbError) {
      console.warn('MongoDB connection failed. Saving message to local transmissions.json fallback.', dbError.message);
      
      const dir = path.join(process.cwd(), 'data');
      if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
      }
      const filePath = path.join(dir, 'transmissions.json');
      let currentData = [];
      if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        currentData = JSON.parse(fileContent || '[]');
      }
      const localMsg = {
        id: 'local-' + Date.now(),
        name,
        email,
        subject: subject || 'No Subject',
        message,
        ipAddress: ip,
        createdAt: new Date().toISOString()
      };
      currentData.push(localMsg);
      fs.writeFileSync(filePath, JSON.stringify(currentData, null, 2));
      return Response.json({ success: true, id: localMsg.id, localFallback: true }, { status: 201 });
    }
  } catch (error) {
    console.error('Error in POST /api/contact:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
