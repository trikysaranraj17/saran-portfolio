import { connectDB } from '@/lib/mongodb';
import Project from '@/models/Project';

export async function PATCH(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    
    if (!id) {
      return Response.json({ error: 'Missing project ID' }, { status: 400 });
    }

    try {
      await connectDB();
      const project = await Project.findByIdAndUpdate(
        id,
        { $inc: { viewCount: 1 } },
        { new: true }
      );

      if (!project) {
        return Response.json({ error: 'Project not found' }, { status: 404 });
      }

      return Response.json({ viewCount: project.viewCount });
    } catch (dbError) {
      console.warn('MongoDB connection failed. Mocking view increment.', dbError.message);
      return Response.json({ viewCount: 150, localFallback: true });
    }
  } catch (error) {
    console.error('Error in PATCH /api/projects/[id]/view:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
