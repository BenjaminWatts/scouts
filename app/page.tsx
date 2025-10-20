import type { Metadata } from 'next';
import { getHomeMetadata } from '@/lib/metadata';
import { createClientFromEnv } from '@/lib/osm';

export const metadata: Metadata = getHomeMetadata();

export default async function HomePage() {
  const osmClient = createClientFromEnv();

  // Fetch upcoming meetings/events for the home page widget
  const programmeSummary = await osmClient.getProgrammeSummary({
    sectionid: process.env.OSM_SECTION_ID || '1',
    termid: process.env.OSM_TERM_ID || '1',
  });

  // Get next 5 events
  const upcomingEvents = programmeSummary.items
    .filter(event => new Date(event.meetingdate) >= new Date())
    .sort((a, b) => new Date(a.meetingdate).getTime() - new Date(b.meetingdate).getTime())
    .slice(0, 5);

  // Fetch badge tag cloud - using 'scouts' as default, can be configured
  let badgeCloud = null;
  let sectionType = (process.env.OSM_SECTION_TYPE as any) || 'scouts';

  // Get startup data to fetch term information
  let currentTerm = null;
  try {
    const startupData = await osmClient.getStartupData();
    const termId = process.env.OSM_TERM_ID || '1';
    currentTerm = startupData.globals.terms.find(t => t.termid === termId);
  } catch (error) {
    console.error('Failed to fetch term data:', error);
  }

  try {
    badgeCloud = await osmClient.getBadgeTagCloud({
      sectionid: process.env.OSM_SECTION_ID || '1',
      termid: process.env.OSM_TERM_ID || '1',
      section: sectionType,
    });
  } catch (error) {
    console.error('Failed to fetch badge data:', error);
  }

  // Format section name for display
  const sectionDisplayName = sectionType.charAt(0).toUpperCase() + sectionType.slice(1);

  return (
    <main className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <section className="text-center mb-12 py-8">
          <h2 className="text-5xl font-bold mb-4 text-scouts-purple">Welcome to Walkham Valley Scouts</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join us for exciting adventures, badge work, and fun activities. Building skills, confidence, and friendships for life.
          </p>
        </section>

        {/* Upcoming Events Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-semibold text-scouts-purple">Upcoming Events</h2>
            <a href="/events" className="text-scouts-teal hover:underline font-medium">
              View all →
            </a>
          </div>

          {upcomingEvents.length === 0 ? (
            <div className="content-section text-center py-12">
              <p className="text-gray-500 text-lg">No upcoming events at the moment. Check back soon!</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {upcomingEvents.map((event) => {
                const isSpecial = event.parentsrequired || event.parentsattendingcount > 0;
                return (
                  <a
                    key={event.eveningid}
                    href={`/events/${event.eveningid}`}
                    className={isSpecial ? 'event-card-special' : 'event-card'}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-bold text-scouts-purple pr-2">{event.title}</h3>
                      {event.parentsrequired && (
                        <span className="badge-purple whitespace-nowrap">
                          Parents Required
                        </span>
                      )}
                    </div>

                    <div className="text-sm text-gray-600 mb-3 space-y-1">
                      <p className="font-semibold text-gray-800">
                        📅 {new Date(event.meetingdate).toLocaleDateString('en-GB', {
                          weekday: 'long',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
                      {event.starttime && event.endtime && (
                        <p>🕐 {event.starttime} - {event.endtime}</p>
                      )}
                    </div>

                    {event.notesforparents && (
                      <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                        {event.notesforparents}
                      </p>
                    )}

                    {event.parentsattendingcount > 0 && (
                      <div className="mt-3 pt-3 border-t border-purple-200">
                        <span className="badge-teal text-xs">
                          👥 {event.parentsattendingcount} parent{event.parentsattendingcount !== 1 ? 's' : ''} attending
                        </span>
                      </div>
                    )}
                  </a>
                );
              })}
            </div>
          )}

          <div className="mt-8 text-center">
            <a href="/events" className="btn-primary">
              View All Events & Programme
            </a>
          </div>
        </section>

        {/* Badges Section */}
        {badgeCloud && badgeCloud.tags && typeof badgeCloud.tags === 'object' ? (
          <section className="mb-12">
            <div className="flex items-baseline justify-between mb-6">
              <h2 className="text-3xl font-semibold text-scouts-purple">Badge Programme</h2>
              {currentTerm && (
                <span className="text-sm text-gray-600">
                  {currentTerm.name}
                </span>
              )}
            </div>

            <div className="content-section">
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-xl font-bold text-scouts-purple">
                    {sectionDisplayName} Section
                  </h3>
                  <span className="badge-purple text-xs">
                    {Object.keys(badgeCloud.tags).length} Badges
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-2">
                  These badges are being worked on in our {sectionDisplayName.toLowerCase()} programme this term.
                  The size indicates how frequently each badge appears in our activities.
                </p>
                {currentTerm && (
                  <p className="text-gray-500 text-xs">
                    📅 Term period: {new Date(currentTerm.startdate).toLocaleDateString('en-GB', { month: 'short', day: 'numeric' })} - {new Date(currentTerm.enddate).toLocaleDateString('en-GB', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap gap-3">
                {Object.entries(badgeCloud.tags as Record<string, number>)
                  .sort(([, a], [, b]) => (b as number) - (a as number))
                  .map(([badge, count]) => {
                    // Calculate relative size based on count
                    const maxCount = Math.max(...Object.values(badgeCloud.tags as Record<string, number>));
                    const size = count === maxCount ? 'text-lg font-bold' :
                                count > maxCount * 0.6 ? 'text-base font-semibold' :
                                'text-sm';

                    return (
                      <div
                        key={badge}
                        className={`badge-yellow ${size}`}
                        title={`${count} programme activities cover this badge`}
                      >
                        🎖️ {badge}
                      </div>
                    );
                  })}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-xs text-gray-500 italic">
                  💡 Badge data shows which badges are included in our programme activities.
                  Larger badges indicate more coverage across different meetings and activities.
                </p>
              </div>
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}
