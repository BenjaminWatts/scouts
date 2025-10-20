/**
 * Mock data for OSM API - used when USE_MOCK_DATA environment variable is true
 * This allows for static site generation without requiring OSM API credentials
 */

import type {
  StartupData,
  MemberListResponse,
  IndividualMemberInfo,
  PatrolsResponse,
  CensusResponse,
  FlexiRecordsResponse,
  MemberTransfersResponse,
  DeletableMembersResponse,
  ProgrammeSummaryResponse,
  BadgeTagCloud,
  RiskAssessmentResponse,
  ProgrammeDetailResponse,
} from './types';

export const mockStartupData: StartupData = {
  globals: {
    email: 'leader@walkhamvalleyscouts.org.uk',
    firstname: 'John',
    lastname: 'Smith',
    member_access: {},
    notepads: {},
    sectionConfig: {},
    terms: [
      {
        termid: '1',
        sectionid: '1',
        name: 'Autumn 2024',
        startdate: '2024-09-01',
        enddate: '2024-12-20',
        past: false,
      },
      {
        termid: '2',
        sectionid: '1',
        name: 'Spring 2025',
        startdate: '2025-01-06',
        enddate: '2025-04-04',
        past: false,
      },
      {
        termid: '3',
        sectionid: '1',
        name: 'Summer 2025',
        startdate: '2025-04-21',
        enddate: '2025-07-18',
        past: false,
      },
    ],
  },
};

export const mockMemberList: MemberListResponse = {
  identifier: 'members',
  photos: {},
  items: [
    {
      firstname: 'Alice',
      lastname: 'Johnson',
      photo_guid: 'photo1',
      patrolid: '1',
      patrol: 'Red Patrol',
      sectionid: '1',
      enddate: '',
      age: 10,
      active: true,
      scoutid: '101',
      full_name: 'Alice Johnson',
    },
    {
      firstname: 'Bob',
      lastname: 'Williams',
      photo_guid: 'photo2',
      patrolid: '1',
      patrol: 'Red Patrol',
      sectionid: '1',
      enddate: '',
      age: 11,
      active: true,
      scoutid: '102',
      full_name: 'Bob Williams',
    },
    {
      firstname: 'Charlie',
      lastname: 'Brown',
      photo_guid: 'photo3',
      patrolid: '2',
      patrol: 'Blue Patrol',
      sectionid: '1',
      enddate: '',
      age: 10,
      active: true,
      scoutid: '103',
      full_name: 'Charlie Brown',
    },
  ],
};

export const mockIndividualMember: IndividualMemberInfo = {
  ok: true,
  read_only: [],
  data: {
    scoutid: '101',
    firstname: 'Alice',
    lastname: 'Johnson',
    dob: '2014-05-15',
    started: '2023-09-01',
    patrolid: '1',
    sectionid: '1',
    active: true,
    age: 10,
    meetings: 28,
  },
  meta: {},
};

export const mockPatrols: PatrolsResponse = {
  patrols: [
    {
      patrolid: '1',
      sectionid: '1',
      name: 'Red Patrol',
      active: true,
      points: 150,
      census_costs: {},
      members: [
        {
          firstname: 'Alice',
          lastname: 'Johnson',
          scout_id: '101',
          patrolid: '1',
          active: true,
          scoutid: '101',
        },
        {
          firstname: 'Bob',
          lastname: 'Williams',
          scout_id: '102',
          patrolid: '1',
          active: true,
          scoutid: '102',
        },
      ],
    },
    {
      patrolid: '2',
      sectionid: '1',
      name: 'Blue Patrol',
      active: true,
      points: 135,
      census_costs: {},
      members: [
        {
          firstname: 'Charlie',
          lastname: 'Brown',
          scout_id: '103',
          patrolid: '2',
          active: true,
          scoutid: '103',
        },
      ],
    },
    {
      patrolid: '-2',
      sectionid: '1',
      name: 'Leaders',
      active: true,
      points: 0,
      census_costs: {},
      members: [
        {
          firstname: 'John',
          lastname: 'Smith',
          scout_id: '201',
          patrolid: '-2',
          active: true,
          scoutid: '201',
        },
      ],
    },
  ],
};

export const mockCensus: CensusResponse = {
  identifier: 'census',
  items: [],
};

export const mockFlexiRecords: FlexiRecordsResponse = {
  identifier: 'flexirecords',
  label: 'Flexi Records',
  items: [],
};

export const mockMemberTransfers: MemberTransfersResponse = {
  status: true,
  error: null,
  data: [],
  meta: {},
};

export const mockDeletableMembers: DeletableMembersResponse = {
  status: true,
  error: null,
  data: [],
  meta: {},
};

// Helper to get future dates for mock data
const getUpcomingDate = (daysFromNow: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString().split('T')[0];
};

export const mockProgrammeSummary: ProgrammeSummaryResponse = {
  items: [
    {
      eveningid: '1',
      sectionid: '1',
      title: 'Camping Skills',
      notesforparents: 'Please bring warm clothing and outdoor gear',
      parentsrequired: false,
      meetingdate: getUpcomingDate(5),
      starttime: '19:00',
      endtime: '20:30',
      parentsattendingcount: 0,
    },
    {
      eveningid: '2',
      sectionid: '1',
      title: 'Fire Safety Badge',
      notesforparents: 'We will be learning about fire safety and prevention',
      parentsrequired: false,
      meetingdate: getUpcomingDate(12),
      starttime: '19:00',
      endtime: '20:30',
      parentsattendingcount: 0,
    },
    {
      eveningid: '3',
      sectionid: '1',
      title: 'Navigation Skills',
      notesforparents: 'Bring a compass if you have one',
      parentsrequired: false,
      meetingdate: getUpcomingDate(19),
      starttime: '19:00',
      endtime: '20:30',
      parentsattendingcount: 0,
    },
    {
      eveningid: '4',
      sectionid: '1',
      title: 'Weekend Camp',
      notesforparents: 'Special event - full kit list will be sent via email. Parent helpers needed!',
      parentsrequired: true,
      meetingdate: getUpcomingDate(28),
      starttime: '18:00',
      endtime: '16:00',
      parentsattendingcount: 5,
    },
    {
      eveningid: '5',
      sectionid: '1',
      title: 'End of Term Party',
      notesforparents: 'Celebration evening with games and activities. Please bring a small contribution for the party food.',
      parentsrequired: true,
      meetingdate: getUpcomingDate(42),
      starttime: '19:00',
      endtime: '21:00',
      parentsattendingcount: 12,
    },
  ],
};

export const mockBadgeTagCloud: BadgeTagCloud = {
  tags: {
    'Camping': 15,
    'Fire Safety': 12,
    'Navigation': 10,
    'First Aid': 8,
    'Cooking': 7,
  },
  tag_count: 5,
  badges: {
    'camp_permit': 'Camping',
    'fire_safety': 'Fire Safety',
    'navigator': 'Navigation',
    'first_aid': 'First Aid',
    'chef': 'Cooking',
  },
};

export const mockRiskAssessment: RiskAssessmentResponse = {
  status: true,
  error: null,
  data: [
    { name: 'Low Risk' },
    { name: 'Medium Risk' },
    { name: 'High Risk' },
  ],
  meta: {},
};

export const mockProgrammeDetail: ProgrammeDetailResponse = {
  items: [
    {
      eveningid: '1',
      sectionid: '1',
      title: 'Camping Skills',
      meetingdate: getUpcomingDate(5),
      starttime: '19:00',
      endtime: '20:30',
      help: [],
      unavailableleaders: [],
    },
  ],
  badgelinks: {
    'camp_permit': ['Tent pitching', 'Camp safety', 'Outdoor cooking basics'],
    'outdoors_challenge': ['Setting up camp', 'Leave no trace principles'],
  },
};
