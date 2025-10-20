import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClientFromEnv } from '@/lib/osm';
import { getEventMetadata, getEventJsonLd } from '@/lib/metadata';

type Props = {
  params: Promise<{ eveningid: string }>;
};

// Generate metadata for this event page
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { eveningid } = await params;
  const osmClient = createClientFromEnv();

  const programmeSummary = await osmClient.getProgrammeSummary({
    sectionid: process.env.OSM_SECTION_ID || '1',
    termid: process.env.OSM_TERM_ID || '1',
  });

  const event = programmeSummary.items.find(
    (e) => e.eveningid === eveningid
  );

  if (!event) {
    return {
      title: 'Event Not Found',
    };
  }

  return getEventMetadata(event);
}

// Generate static paths for all events at build time
export async function generateStaticParams() {
  const osmClient = createClientFromEnv();

  const programmeSummary = await osmClient.getProgrammeSummary({
    sectionid: process.env.OSM_SECTION_ID || '1',
    termid: process.env.OSM_TERM_ID || '1',
  });

  return programmeSummary.items.map((event) => ({
    eveningid: event.eveningid,
  }));
}

export default async function EventPage({ params }: Props) {
  const { eveningid } = await params;
  const osmClient = createClientFromEnv();

  // Fetch the programme summary to find this event
  const programmeSummary = await osmClient.getProgrammeSummary({
    sectionid: process.env.OSM_SECTION_ID || '1',
    termid: process.env.OSM_TERM_ID || '1',
  });

  const event = programmeSummary.items.find(
    (e) => e.eveningid === eveningid
  );

  if (!event) {
    notFound();
  }

  // Get detailed event information
  const eventDetail = await osmClient.getProgrammeDetail({
    sectionid: process.env.OSM_SECTION_ID || '1',
    termid: process.env.OSM_TERM_ID || '1',
    eveningid: eveningid,
  });

  // Generate JSON-LD structured data
  const jsonLd = getEventJsonLd(event);

  // Format date for display
  const eventDate = new Date(event.meetingdate);
  const isPast = eventDate < new Date();

  return (
    <>
      {/* Add JSON-LD structured data for this event */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="min-h-screen py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <a href="/events" className="text-scouts-teal hover:underline mb-4 inline-block font-medium">
            ← Back to Events
          </a>

          {/* Event Header */}
          <header className="mb-8">
            <div className="flex items-start justify-between mb-4">
              <h1 className="text-5xl font-bold text-scouts-purple">{event.title}</h1>
              {isPast && (
                <span className="badge-gray">
                  Past Event
                </span>
              )}
            </div>

            {/* Date and Time Card */}
            <div className="bg-purple-50 rounded-lg p-6 border-2 border-scouts-purple mb-6">
              <div className="flex flex-wrap gap-6 text-lg">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📅</span>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Date</p>
                    <time dateTime={event.meetingdate} className="font-bold text-scouts-purple">
                      {eventDate.toLocaleDateString('en-GB', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </time>
                  </div>
                </div>

                {event.starttime && event.endtime && (
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🕐</span>
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Time</p>
                      <span className="font-bold text-scouts-purple">
                        {event.starttime} - {event.endtime}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Status Badges */}
            <div className="flex flex-wrap gap-3 mb-6">
              {event.parentsrequired && (
                <span className="badge-purple text-base">
                  👨‍👩‍👧‍👦 Parents Required
                </span>
              )}
              {event.parentsattendingcount > 0 && (
                <span className="badge-teal text-base">
                  👥 {event.parentsattendingcount} Parent{event.parentsattendingcount !== 1 ? 's' : ''} Attending
                </span>
              )}
            </div>
          </header>

          {/* Event Details */}
          <div className="content-section mb-8">
            {event.notesforparents && (
              <section className="mb-6">
                <h2 className="text-xl font-semibold mb-3">Information for Parents</h2>
                <p className="text-gray-700 whitespace-pre-wrap">{event.notesforparents}</p>
              </section>
            )}

            {/* Badge Links */}
            {eventDetail.badgelinks && typeof eventDetail.badgelinks === 'object' &&
             Object.keys(eventDetail.badgelinks).length > 0 ? (
              <section className="mb-6">
                <h2 className="text-xl font-semibold mb-3">Badges Covered</h2>
                <div className="space-y-3">
                  {Object.entries(eventDetail.badgelinks as Record<string, unknown>).map(([badgeId, activities]) => (
                    <div key={badgeId} className="bg-gray-50 p-4 rounded">
                      <h3 className="font-medium mb-2 capitalize">{badgeId.replace(/_/g, ' ')}</h3>
                      {Array.isArray(activities) && activities.length > 0 && (
                        <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                          {activities.map((activity: string, idx: number) => (
                            <li key={idx}>{activity}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            ) : null}

            {/* Unavailable Leaders */}
            {eventDetail.items[0]?.unavailableleaders &&
             eventDetail.items[0].unavailableleaders.length > 0 && (
              <section className="mb-6">
                <h2 className="text-xl font-semibold mb-3">Leader Availability</h2>
                <p className="text-sm text-gray-600">
                  Some leaders may be unavailable for this meeting.
                </p>
              </section>
            )}
          </div>

          {/* Share Section */}
          <section className="bg-teal-50 rounded-lg p-6 border-2 border-scouts-teal">
            <h2 className="text-2xl font-semibold mb-3 text-scouts-teal">📤 Share this Event</h2>
            <p className="text-gray-700 mb-4">
              Share this event with other parents and scouts
            </p>
            <div className="flex flex-wrap gap-3">
              <ShareButton
                platform="WhatsApp"
                url={`https://wa.me/?text=${encodeURIComponent(
                  `${event.title} - ${eventDate.toLocaleDateString('en-GB')} at ${event.starttime}`
                )}`}
              />
              <ShareButton
                platform="Facebook"
                url={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                  typeof window !== 'undefined' ? window.location.href : ''
                )}`}
              />
              <ShareButton
                platform="Twitter"
                url={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                  `${event.title} - ${eventDate.toLocaleDateString('en-GB')}`
                )}`}
              />
            </div>
          </section>
        </div>
      </main>
    </>
  );
}

function ShareButton({ platform, url }: { platform: string; url: string }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="px-4 py-2 bg-white border-2 border-scouts-teal text-scouts-teal rounded-lg hover:bg-scouts-teal hover:text-white transition-all font-medium shadow-sm hover:shadow-md"
    >
      Share on {platform}
    </a>
  );
}
