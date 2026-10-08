import '../styles/site.css';

export const metadata = {
  title: 'Apex Auto Detailing - Car Wash and Detailing Karachi',
  description: 'Apex Auto Detailing: washing, interior and exterior vehicle care. Explore service options and request a quote.',
  keywords: ['car wash Karachi', 'car detailing Karachi', 'ceramic coating Karachi', 'foam wash Pakistan', 'oil change Karachi', 'paint protection film'],
  authors: [{ name: 'Apex Auto Detailing' }],
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    title: 'Apex Auto Detailing - Car Wash and Detailing Karachi',
    description: 'Apex Auto Detailing: washing, interior and exterior vehicle care. Explore service options and request a quote.',
    locale: 'en_PK',
    siteName: 'Apex Auto Detailing',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Apex Auto Detailing - Car Wash and Detailing Karachi',
    description: 'Apex Auto Detailing: washing, interior and exterior vehicle care. Explore service options and request a quote.',
  },
  icons: { icon: '/media/apex-icon.svg' },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="/css/fonts.css" />
        <link rel="stylesheet" href="/vendor/bootstrap.min.css" />
        <link rel="stylesheet" href="/css/custom.css?ver=12" />
        <link rel="stylesheet" href="/css/responsive.css?ver=7" />
        <link rel="stylesheet" href="/css/loader.css?ver=4" />
        <link rel="stylesheet" href="/css/apex.css?v=7" />
      </head>
      <body className="wx-loading" suppressHydrationWarning>{children}</body>
    </html>
  );
}
