import type { Metadata, Viewport } from 'next';
import { getBaseMetadata, getOrganizationJsonLd } from '@/lib/metadata';
import Image from 'next/image';
import { Nunito_Sans } from 'next/font/google';
import './globals.css';

const nunitoSans = Nunito_Sans({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-nunito-sans',
  display: 'swap',
});

export const metadata: Metadata = getBaseMetadata();

export const viewport: Viewport = {
  themeColor: '#7413dc', // Scouts purple
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const organizationJsonLd = getOrganizationJsonLd();

  return (
    <html lang="en" className={nunitoSans.variable}>
      <head>
        {/* Structured Data for Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </head>
      <body className={nunitoSans.className}>
        {/* Scout-branded header navigation */}
        <header className="scout-header shadow-lg">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <a href="/" className="flex items-center gap-4 hover:opacity-90 transition-opacity">
                <div className="w-16 h-16 rounded-full border-2 border-white shadow-md overflow-hidden bg-white flex-shrink-0">
                  <Image
                    src="/logo.jpg"
                    alt="Walkham Valley Scouts Logo"
                    width={64}
                    height={64}
                    className="object-cover w-full h-full"
                    priority
                  />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Walkham Valley Scouts</h1>
                  <p className="text-purple-100 text-sm">Adventure Awaits</p>
                </div>
              </a>

              <nav className="hidden md:flex gap-6">
                <a href="/" className="text-white hover:text-purple-200 font-medium transition-colors">
                  Home
                </a>
                <a href="/events" className="text-white hover:text-purple-200 font-medium transition-colors">
                  Events
                </a>
              </nav>
            </div>
          </div>
        </header>

        {/* Main content */}
        {children}

        {/* Footer */}
        <footer className="bg-gray-800 text-white mt-16">
          <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4 text-scouts-yellow">Walkham Valley Scouts</h3>
                <p className="text-gray-300 text-sm">
                  Providing exciting adventures and learning opportunities for young people.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4 text-scouts-yellow">Quick Links</h3>
                <ul className="space-y-2 text-sm">
                  <li><a href="/" className="text-gray-300 hover:text-white transition-colors">Home</a></li>
                  <li><a href="/events" className="text-gray-300 hover:text-white transition-colors">Events</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4 text-scouts-yellow">About</h3>
                <p className="text-gray-300 text-sm">
                  Part of The Scout Association
                </p>
              </div>
            </div>
            <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400 text-sm">
              <p>&copy; {new Date().getFullYear()} Walkham Valley Scouts. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
