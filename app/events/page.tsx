import type { Metadata } from 'next';
import { getEventsMetadata } from '@/lib/metadata';
import { createClientFromEnv } from '@/lib/osm';

export const metadata: Metadata = getEventsMetadata();

export default async function EventsPage() {
  const osmClient = createClientFromEnv();

  const programmeSummary = await osmClient.getProgrammeSummary({
    sectionid: process.env.OSM_SECTION_ID || '1',
    termid: process.env.OSM_TERM_ID || '1',
  });

  // Sort events by date
  const sortedEvents = [...programmeSummary.items].sort(
    (a, b) => new Date(a.meetingdate).getTime() - new Date(b.meetingdate).getTime()
  );

  // Separate past and upcoming events
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingEvents = sortedEvents.filter(
    event => new Date(event.meetingdate) >= today
  );
  const pastEvents = sortedEvents.filter(
    event => new Date(event.meetingdate) < today
  );

  return (
    <main className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <a href="/" className="text-scouts-teal hover:underline mb-4 inline-block font-medium">
            ← Back to Home
          </a>
          <h1 className="text-5xl font-bold mb-3 text-scouts-purple">Events &amp; Programme</h1>
          <p className="text-xl text-gray-600">
            View our full calendar of meetings, activities, and special events
          </p>
        </header>

        {/* Upcoming Events */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Upcoming Events</h2>
          {upcomingEvents.length === 0 ? (
            <p className="text-gray-500">No upcoming events scheduled.</p>
          ) : (
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <EventCard key={event.eveningid} event={event} />
              ))}
            </div>
          )}
        </section>

        {/* Past Events */}
        {pastEvents.length > 0 && (
          <section>
            <h2 className="text-2xl font-semibold mb-6">Past Events</h2>
            <div className="space-y-4 opacity-60">
              {pastEvents.slice(-10).reverse().map((event) => (
                <EventCard key={event.eveningid} event={event} isPast />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

function EventCard({ event, isPast = false }: { event: any; isPast?: boolean }) {
  const isSpecial = (event.parentsrequired || event.parentsattendingcount > 0) && !isPast;

  return (
    <a
      href={`/events/${event.eveningid}`}
      className={isSpecial ? 'event-card-special' : 'event-card'}
    >
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-start gap-3 mb-3">
            <h3 className="text-xl font-bold text-scouts-purple">{event.title}</h3>
            {event.parentsrequired && !isPast && (
              <span className="badge-purple whitespace-nowrap">
                Parents Required
              </span>
            )}
            {isPast && (
              <span className="badge-gray whitespace-nowrap">
                Past Event
              </span>
            )}
          </div>

          {event.notesforparents && (
            <p className="text-gray-700 mb-3">{event.notesforparents}</p>
          )}

          {event.parentsattendingcount > 0 && !isPast && (
            <span className="badge-teal">
              👥 {event.parentsattendingcount} parent{event.parentsattendingcount !== 1 ? 's' : ''} attending
            </span>
          )}
        </div>

        <div className="md:w-48 flex-shrink-0">
          <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
            <p className="font-bold text-scouts-purple text-center mb-1">
              {new Date(event.meetingdate).toLocaleDateString('en-GB', {
                weekday: 'short',
                day: 'numeric',
                month: 'short',
              })}
            </p>
            {event.starttime && event.endtime && (
              <p className="text-sm text-gray-600 text-center">
                🕐 {event.starttime} - {event.endtime}
              </p>
            )}
          </div>
        </div>
      </div>
    </a>
  );
}
