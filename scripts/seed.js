import { connectDB } from '../src/lib/mongodb.js';
import Project from '../src/models/Project.js';

async function seed() {
  try {
    console.log('Connecting to database...');
    await connectDB();
    
    console.log('Clearing existing projects...');
    await Project.deleteMany({});
    
    console.log('Seeding initial projects...');
    await Project.insertMany([
      {
        title: 'Thiruvi School Website',
        url: 'https://thiruvikaschool.org',
        description: 'A complete institutional website for a school — admission portals, news updates, staff directory, and clean academic UI.',
        tags: ['HTML', 'CSS', 'JavaScript', 'Responsive'],
        viewCount: 0,
        accentColor: '#00f5ff',
      },
      {
        title: 'Anushka Resin Artistry',
        url: 'https://anushkaresinart.com',
        description: 'Elegant e-commerce portfolio for a resin art business — product showcases, custom resin collections, and seamless customer inquiries.',
        tags: ['React', 'Vercel', 'UI Design', 'E-commerce'],
        viewCount: 0,
        accentColor: '#bf00ff',
      },
      {
        title: 'Artinova Gift Business',
        url: 'https://artinova.vercel.app',
        description: 'A dynamic visual portal for a custom gifting business — showcase gallery, order personalization stream, and sleek catalog navigation.',
        tags: ['Next.js', 'React', 'Tailwind', 'Gifting'],
        viewCount: 0,
        accentColor: '#ff6b35',
      },
    ]);

    console.log('✅ Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seed();
