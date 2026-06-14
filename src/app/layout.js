import { Orbitron, Space_Grotesk } from 'next/font/google';
import './globals.css';
import CustomCursor from '@/components/CustomCursor';
import SpaceScene from '@/components/SpaceScene';
import SmoothScroll from '@/components/SmoothScroll';
import Navbar from '@/components/Navbar';

const orbitron = Orbitron({
  subsets: ['latin'],
  variable: '--font-orbitron',
  weight: ['400', '500', '700', '900'],
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  weight: ['400', '500', '600', '700'],
});

export const metadata = {
  title: 'Saranraj | 3D Dramatic Space Portfolio',
  description: 'Immersive 3D Space Portfolio of Saranraj, Freelance Web Developer and BCA Student.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${orbitron.variable} ${spaceGrotesk.variable}`}>
      <body>
        <CustomCursor />
        <SpaceScene />
        <Navbar />
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
