import { connectDB } from '@/lib/mongodb';
import Analytics from '@/models/Analytics';
import fs from 'fs';
import path from 'path';

export async function POST(req) {
  try {
    const today = new Date().toISOString().split('T')[0];
    const ip = req.headers.get('x-forwarded-for') || 'unknown';

    try {
      await connectDB();
      await Analytics.findOneAndUpdate(
        { date: today },
        {
          $inc: { visits: 1 },
          $addToSet: { uniqueIPs: ip },
          updatedAt: new Date(),
        },
        { upsert: true, new: true }
      );
      return Response.json({ success: true });
    } catch (dbError) {
      console.warn('MongoDB connection failed. Writing analytics to local analytics.json fallback.', dbError.message);
      
      const dir = path.join(process.cwd(), 'data');
      if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
      }
      const filePath = path.join(dir, 'analytics.json');
      let analyticsData = {};
      if (fs.existsSync(filePath)) {
        analyticsData = JSON.parse(fs.readFileSync(filePath, 'utf8') || '{}');
      }
      if (!analyticsData[today]) {
        analyticsData[today] = { visits: 0, uniqueIPs: [] };
      }
      analyticsData[today].visits += 1;
      if (!analyticsData[today].uniqueIPs.includes(ip)) {
        analyticsData[today].uniqueIPs.push(ip);
      }
      analyticsData[today].updatedAt = new Date().toISOString();
      fs.writeFileSync(filePath, JSON.stringify(analyticsData, null, 2));
      return Response.json({ success: true, localFallback: true });
    }
  } catch (error) {
    console.error('Error in POST /api/analytics/track:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
