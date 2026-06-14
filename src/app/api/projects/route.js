import { connectDB } from '@/lib/mongodb';
import Project from '@/models/Project';

export async function GET() {
  try {
    await connectDB();
    const projects = await Project.find({}).sort({ createdAt: -1 });
    return Response.json(projects);
  } catch (error) {
    console.warn('MongoDB connection failed. Returning local fallback projects.', error.message);
    const fallbackProjects = [
      {
        _id: 'seed-thiruvi',
        title: 'Thiruvi School Website',
        url: 'https://thiruvikaschool.org',
        description: 'A complete institutional website for a school — admission portals, news updates, staff directory, and clean academic UI.',
        tags: ['HTML', 'CSS', 'JavaScript', 'Responsive'],
        viewCount: 147,
        accentColor: '#00f5ff',
      },
      {
        _id: 'seed-anushka',
        title: 'Anushka Resin Artistry',
        url: 'https://anushkaresinart.com',
        description: 'Elegant e-commerce portfolio for a resin art business — product showcases, custom resin collections, and seamless customer inquiries.',
        tags: ['React', 'Vercel', 'UI Design', 'E-commerce'],
        viewCount: 92,
        accentColor: '#bf00ff',
      },
      {
        _id: 'seed-artinova',
        title: 'Artinova Gift Business',
        url: 'https://artinova.vercel.app',
        description: 'A dynamic visual portal for a custom gifting business — showcase gallery, order personalization stream, and sleek catalog navigation.',
        tags: ['Next.js', 'React', 'Tailwind', 'Gifting'],
        viewCount: 78,
        accentColor: '#ff6b35',
      },
    ];
    return Response.json(fallbackProjects);
  }
}
