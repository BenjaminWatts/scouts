/**
 * Metadata and Open Graph utilities for SEO and social media sharing
 */

import type { Metadata } from 'next';
import type { ProgrammeSummaryItem } from './osm/types';

// Site configuration
export const SITE_CONFIG = {
  name: 'Walkham Valley Scouts',
  description: 'Join us for exciting adventures, badge work, and fun activities. Walkham Valley Scouts provides engaging programmes for young people in our community.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://walkhamvalleyscouts.org.uk',
  locale: 'en_GB',
  email: 'info@walkhamvalleyscouts.org.uk',
  social: {
    // Add your social media handles here
    facebook: '',
    twitter: '',
    instagram: '',
  },
} as const;

/**
 * Generate base metadata for the site
 */
export function getBaseMetadata(): Metadata {
  return {
    metadataBase: new URL(SITE_CONFIG.url),
    title: {
      default: SITE_CONFIG.name,
      template: `%s | ${SITE_CONFIG.name}`,
    },
    description: SITE_CONFIG.description,
    keywords: [
      'scouts',
      'scouting',
      'walkham valley',
      'youth activities',
      'outdoor activities',
      'badges',
      'camping',
      'adventure',
      'beavers',
      'cubs',
      'scouts',
      'explorers',
    ],
    authors: [{ name: SITE_CONFIG.name }],
    creator: SITE_CONFIG.name,
    publisher: SITE_CONFIG.name,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    openGraph: {
      type: 'website',
      locale: SITE_CONFIG.locale,
      url: SITE_CONFIG.url,
      siteName: SITE_CONFIG.name,
      title: SITE_CONFIG.name,
      description: SITE_CONFIG.description,
      images: [
        {
          url: '/logo.jpg',
          width: 1200,
          height: 630,
          alt: `${SITE_CONFIG.name} Logo`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: SITE_CONFIG.name,
      description: SITE_CONFIG.description,
      images: ['/logo.jpg'],
      ...(SITE_CONFIG.social.twitter ? {
        creator: `@${SITE_CONFIG.social.twitter}`,
      } : {}),
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    icons: {
      icon: '/logo.jpg',
      apple: '/logo.jpg',
    },
  };
}

/**
 * Generate metadata for the home page
 */
export function getHomeMetadata(): Metadata {
  return {
    title: 'Home',
    description: SITE_CONFIG.description,
    openGraph: {
      type: 'website',
      url: SITE_CONFIG.url,
      title: SITE_CONFIG.name,
      description: SITE_CONFIG.description,
      images: [
        {
          url: '/logo.jpg',
          width: 1200,
          height: 630,
          alt: `${SITE_CONFIG.name} - Home`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: SITE_CONFIG.name,
      description: SITE_CONFIG.description,
      images: ['/logo.jpg'],
    },
  };
}

/**
 * Generate metadata for the events/meetings listing page
 */
export function getEventsMetadata(): Metadata {
  const title = 'Events & Programme';
  const description = `View our upcoming meetings and events at ${SITE_CONFIG.name}. Check dates, times, and activities planned for our scouts.`;

  return {
    title,
    description,
    openGraph: {
      type: 'website',
      url: `${SITE_CONFIG.url}/events`,
      title: `${title} | ${SITE_CONFIG.name}`,
      description,
      images: [
        {
          url: '/logo.jpg',
          width: 1200,
          height: 630,
          alt: `${SITE_CONFIG.name} - Events`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | ${SITE_CONFIG.name}`,
      description,
      images: ['/logo.jpg'],
    },
  };
}

/**
 * Format date for display in metadata
 */
function formatEventDate(dateString: string, startTime?: string): string {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  let formatted = date.toLocaleDateString('en-GB', options);

  if (startTime) {
    formatted += ` at ${startTime}`;
  }

  return formatted;
}

/**
 * Generate metadata for an individual event/meeting page
 */
export function getEventMetadata(
  event: ProgrammeSummaryItem,
  eventUrl?: string
): Metadata {
  const eventDate = formatEventDate(event.meetingdate, event.starttime);
  const title = event.title;

  // Build a rich description
  let description = `${event.title} - ${eventDate}`;

  if (event.starttime && event.endtime) {
    description += ` (${event.starttime} - ${event.endtime})`;
  }

  if (event.notesforparents) {
    description += `. ${event.notesforparents}`;
  }

  if (event.parentsrequired) {
    description += ' Parent attendance required.';
  }

  // Truncate description for social media (recommended max ~200 chars)
  const shortDescription = description.length > 200
    ? description.substring(0, 197) + '...'
    : description;

  const url = eventUrl || `${SITE_CONFIG.url}/events/${event.eveningid}`;

  return {
    title,
    description: shortDescription,
    openGraph: {
      type: 'article',
      url,
      title: `${title} | ${SITE_CONFIG.name}`,
      description: shortDescription,
      publishedTime: event.meetingdate,
      images: [
        {
          url: '/logo.jpg',
          width: 1200,
          height: 630,
          alt: `${SITE_CONFIG.name} - ${title}`,
        },
      ],
      siteName: SITE_CONFIG.name,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | ${SITE_CONFIG.name}`,
      description: shortDescription,
      images: ['/logo.jpg'],
    },
    // Add event-specific structured data
    other: {
      'event:start_time': event.meetingdate + (event.starttime ? `T${event.starttime}` : ''),
      'event:end_time': event.meetingdate + (event.endtime ? `T${event.endtime}` : ''),
    },
  };
}

/**
 * Generate JSON-LD structured data for an event
 * This helps search engines understand event details
 */
export function getEventJsonLd(event: ProgrammeSummaryItem) {
  const startDateTime = `${event.meetingdate}T${event.starttime || '19:00'}:00`;
  const endDateTime = `${event.meetingdate}T${event.endtime || '20:30'}:00`;

  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
    description: event.notesforparents || event.title,
    startDate: startDateTime,
    endDate: endDateTime,
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    organizer: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
    },
    image: `${SITE_CONFIG.url}/logo.jpg`,
    url: `${SITE_CONFIG.url}/events/${event.eveningid}`,
  };
}

/**
 * Generate JSON-LD structured data for the organization
 */
export function getOrganizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_CONFIG.url}#organization`,
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    logo: `${SITE_CONFIG.url}/logo.jpg`,
    description: SITE_CONFIG.description,
    ...(SITE_CONFIG.email && { email: SITE_CONFIG.email }),
    sameAs: [
      SITE_CONFIG.social.facebook,
      SITE_CONFIG.social.twitter,
      SITE_CONFIG.social.instagram,
    ].filter(Boolean),
  };
}
