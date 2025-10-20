# Walkham Valley Scouts

An open source Next.js static website for Walkham Valley Scouts, featuring:
- 📱 Progressive Web App (PWA) support
- 📅 Integration with Online Scout Manager (OSM) API
- 🎨 Bootscout theme/design
- 🔍 SEO optimized with Open Graph tags
- 📤 Social media sharing support
- ⚡ Static site generation for fast performance

## Quick Start

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local

# Set USE_MOCK_DATA=true in .env.local for development without OSM credentials

# Run development server
npm run dev

# Build static site
npm run build
```

## Site Structure

The structure of the site is:

### Home Screen

Event/calendar small widget with summary details of next 5 events, click to expand and nav to events screen

### Events Screen

Full Event Calendar Screen. Click on individual events to navigate to Event Screen

### Event Screen

Parameterised with event_id

Full details of event, including, cost, description, count of current attendees (other fields per the docs)

### Badges

The home page displays a **Badge Programme** section that shows:

- **Section-specific badges**: Shows badges for the configured section (Beavers, Cubs, Scouts, or Explorers)
- **Term information**: Displays which term the data is from (e.g., "Autumn 2024")
- **Badge frequency**: The size of each badge pill indicates how many programme activities cover that badge
- **Activity count**: Hover over badges to see the number of activities

**How it works:**
- The OSM API provides a "tag cloud" of badges per section and term
- Each badge has a count representing how many programme activities include it
- Badges are displayed with varying sizes - larger badges are covered more frequently
- The data is section-specific, so if you run a Beavers group, set `OSM_SECTION_TYPE=beavers` to see Beaver badges

**Configuration:**
- Set `OSM_SECTION_TYPE` in your `.env.local` to your section type (squirrels, beavers, cubs, scouts, explorers)
- The badge data is automatically filtered to that section's badge programme
- Term dates are shown to indicate the time period

## SEO & Social Media Sharing

The site includes comprehensive Open Graph and Twitter Card metadata for optimal social media sharing and SEO.

### Features

- **Open Graph Tags**: Every page includes proper OG tags for Facebook, WhatsApp, and other platforms
- **Twitter Cards**: Large image cards for enhanced Twitter sharing
- **JSON-LD Structured Data**: Schema.org markup for events and organization information
- **Dynamic Metadata**: Event pages automatically generate sharing content based on event details

### How It Works

- **Home Page**: Shares site logo and general description
- **Events Listing**: Shares upcoming events overview
- **Individual Events**: Each event page has unique metadata including:
  - Event title and date
  - Event description and notes for parents
  - Whether parents are required
  - Proper event structured data for search engines

### Testing Social Media Previews

Test how your links will appear when shared:
- **Facebook**: [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- **Twitter**: [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- **LinkedIn**: [LinkedIn Post Inspector](https://www.linkedin.com/post-inspector/)

### Customization

Edit `lib/metadata.ts` to customize:
- Site name, description, and URL
- Social media handles
- Default images
- SEO keywords

## Bootscout Theme Integration

This project uses the [Bootscout](https://bootscout.org.uk/) theme for consistent Scouts branding.

### Current Status

The project is currently set up with basic pages and will integrate Bootscout styling. The theme provides:
- Scout-branded color schemes (purple, teal, yellow)
- Responsive components
- Accessible design patterns
- Official Scouts fonts and styling

### Next Steps for Theme Integration

1. **Install Tailwind CSS** (if using Bootscout's utility classes):
   ```bash
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p
   ```

2. **Add Bootscout assets**:
   - Download Bootscout CSS from [bootscout.org.uk](https://bootscout.org.uk/)
   - Add to `app/globals.css`
   - Configure brand colors in Tailwind config

3. **Apply Scout branding**:
   - Use official Scouts purple (`#7413dc`)
   - Apply Bootscout component classes
   - Ensure accessibility standards (WCAG AA)

4. **Add Scout-specific components**:
   - Navigation with Scouts branding
   - Badge display components
   - Event cards with Scout styling
   - Footer with required Scouts links

## OSM API Integration

All public pages are unauthenticated. The website is completely stateless.

Static site generation (SSG) is used in NextJS to render all pages, and this process is run in a github actions flow which is triggered either on demand, in response to a merge to the main branch.

### Setting Up OSM API Credentials

This project uses the Online Scout Manager (OSM) API to fetch data about events, badges, and programme activities. You'll need to obtain API credentials from OSM and configure them as environment variables.

#### Step 1: Obtain OSM API Credentials

1. Log in to your Online Scout Manager account at [www.onlinescoutmanager.co.uk](https://www.onlinescoutmanager.co.uk)
2. Navigate to **Settings** > **My Account Details** > **Developer Tools**
3. Create a new API application to generate your credentials
4. You'll receive two values:
   - **API ID** (also called Client ID)
   - **API Token** (also called Client Secret)

For more detailed information about the OSM API, see the [OSM API Documentation](https://opensource.newcastlescouts.org.uk/#introduction).

#### Step 2: Configure Environment Variables for Local Development

1. Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` and add your OSM API credentials:
   ```
   OSM_API_ID=your_api_id_here
   OSM_API_TOKEN=your_api_token_here
   OSM_SECTION_ID=your_section_id
   OSM_TERM_ID=your_term_id
   USE_MOCK_DATA=false
   NEXT_PUBLIC_SITE_URL=https://walkhamvalleyscouts.org.uk
   ```

**Note:** `.env.local` is gitignored and will not be committed to the repository.

#### Step 3: Configure GitHub Repository Secrets for Deployment

To deploy the static site via GitHub Actions, you need to add your OSM credentials as repository secrets:

1. Go to your GitHub repository
2. Click **Settings** > **Secrets and variables** > **Actions**
3. Click **New repository secret**
4. Add the following secrets:

   | Secret Name | Value |
   |------------|-------|
   | `OSM_API_ID` | Your OSM API ID from Step 1 |
   | `OSM_API_TOKEN` | Your OSM API Token from Step 1 |
   | `OSM_SECTION_ID` | Your section ID (find in OSM URL) |
   | `OSM_TERM_ID` | Your current term ID |

5. These secrets will be available to your GitHub Actions workflows

#### Using Mock Data (Optional)

For development or testing without OSM API access, you can use mock data:

1. Set `USE_MOCK_DATA=true` in your `.env.local` file
2. The application will use static mock data instead of making real API calls
3. This is useful for:
   - Development without API credentials
   - Testing the site structure and design
   - Avoiding API rate limits during development

**Note:** Mock data is for development only. For production deployments, always use real OSM API credentials.

#### Rate Limiting

The OSM API enforces rate limiting. The client automatically tracks rate limit information via response headers:
- `X-RateLimit-Limit`: Total requests allowed per hour
- `X-RateLimit-Remaining`: Remaining requests in current window
- `X-RateLimit-Reset`: When the rate limit resets

If you exceed the rate limit (HTTP 429 response), the build will fail. Consider using mock data during development to avoid hitting limits.

### OSM API Documentation & Extending Features

This website uses the **Online Scout Manager (OSM) API** to fetch data. The full API documentation is available at:

**📖 [OSM API Documentation](https://opensource.newcastlescouts.org.uk/)**

#### Current Features Using OSM API:

- ✅ **Programme/Events** - Meeting schedules and event details
- ✅ **Badge Tag Cloud** - Badge coverage across programme activities
- ✅ **Startup Data** - Section and term information

#### Potential Future Features:

The OSM API provides many more endpoints that could be added to this website:

- **Member Management**:
  - Member lists (for authenticated leaders)
  - Patrol/Six organization
  - Attendance tracking

- **Advanced Programme Features**:
  - Individual meeting details with badge links
  - Programme attachments and resources
  - Risk assessment categories

- **Reports & Statistics**:
  - Census data and demographics
  - Badge completion statistics
  - Attendance reports

**Note**: Many of these features require authentication and are intended for leader-only access. This public website is designed for unauthenticated public viewing of programme and event information.

**To add new features**: Review the [OSM API docs](https://opensource.newcastlescouts.org.uk/), add methods to `lib/osm/client.ts`, create corresponding TypeScript types in `lib/osm/types.ts`, and implement the UI in your pages.

## Deployment

### GitHub Pages Deployment

This project is configured to deploy automatically to GitHub Pages using GitHub Actions.

#### Step 1: Push Your Code to GitHub

First, push your code to a GitHub repository:

```bash
git init
git add .
git commit -m "Initial commit - Walkham Valley Scouts website"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
git push -u origin main
```

#### Step 2: Enable GitHub Pages

1. Go to your repository on **GitHub.com**
2. Click the **Settings** tab at the top
3. In the left sidebar, click **Pages**
4. Under "Build and deployment", find **Source**
5. Select **"GitHub Actions"** from the dropdown (NOT "Deploy from a branch")
6. Click **Save**

#### Step 3: Get Your OSM Credentials

Before adding secrets to GitHub, you need to get these values from Online Scout Manager.

##### Finding OSM_API_ID and OSM_API_TOKEN

1. Log in to [www.onlinescoutmanager.co.uk](https://www.onlinescoutmanager.co.uk)
2. Click your name in the top right
3. Select **"My Account Details"**
4. Click the **"Developer Tools"** tab on the left
5. Under "OAuth Applications", click **"Create New Application"**
6. Fill in the form:
   - **Application Name**: "Walkham Valley Scouts Website"
   - **Redirect URI**: Leave blank or use your GitHub Pages URL
7. Click **"Create"**
8. You'll now see:
   - **Client ID** ← This is your `OSM_API_ID`
   - **Client Secret** ← This is your `OSM_API_TOKEN`
9. **Important**: Copy both values now - you won't see the Client Secret again!

##### Finding OSM_SECTION_ID

1. In Online Scout Manager, go to your section (e.g., Beavers, Cubs, Scouts)
2. Look at the browser address bar URL
3. Find the `sectionid` parameter: `https://www.onlinescoutmanager.co.uk/...?sectionid=12345`
4. The number after `sectionid=` is your **OSM_SECTION_ID**

##### Finding OSM_TERM_ID

1. In Online Scout Manager, go to **Programme** or **Activities**
2. At the top of the page, find the term selector dropdown (e.g., "Autumn 2024")
3. Click "Change Term" and note down the term you want to use
4. Look at the URL when viewing that term's data
5. Find the `termid` parameter: `https://www.onlinescoutmanager.co.uk/...?termid=987`
6. The number after `termid=` is your **OSM_TERM_ID**

**OR** use the startup API to find all terms:
1. Once you have API credentials, you can call the startup endpoint
2. It will return all terms with their IDs

##### Choosing OSM_SECTION_TYPE

This determines which badges are shown. Choose one:
- `squirrels` - For Squirrel Scouts (4-6 years)
- `beavers` - For Beaver Scouts (6-8 years)
- `cubs` - For Cub Scouts (8-10½ years)
- `scouts` - For Scouts (10½-14 years)
- `explorers` - For Explorer Scouts (14-18 years)

#### Step 4: Add Secrets to GitHub

Now add these values as GitHub secrets:

1. In your GitHub repository, go to **Settings** > **Secrets and variables** > **Actions**
2. Click the **"Secrets"** tab
3. Click the green **"New repository secret"** button
4. Add each secret:

**Required Secrets:**

| Secret Name | Value to Enter |
|------------|----------------|
| `OSM_API_ID` | The Client ID from OSM Developer Tools |
| `OSM_API_TOKEN` | The Client Secret from OSM Developer Tools |

**Recommended Secrets:**

| Secret Name | Value to Enter | Default if not set |
|------------|----------------|-------------------|
| `OSM_SECTION_ID` | The number from your OSM section URL | `1` |
| `OSM_TERM_ID` | The number from your OSM term URL | `1` |
| `OSM_SECTION_TYPE` | `squirrels`, `beavers`, `cubs`, `scouts`, or `explorers` | `scouts` |

**How to add each secret:**
1. Click **"New repository secret"**
2. Enter the **Name** exactly as shown (e.g., `OSM_API_ID`)
3. Paste the **Value** (e.g., your actual Client ID from OSM)
4. Click **"Add secret"**
5. Repeat for each secret above

#### Step 5: Add Site URL Variable (Optional)

Variables are like secrets but are not encrypted (use for non-sensitive data like URLs).

1. In **Settings** > **Secrets and variables** > **Actions**
2. Click the **"Variables"** tab
3. Click **"New repository variable"**
4. Add:

   | Variable Name | Value | Example |
   |--------------|-------|---------|
   | `SITE_URL` | Your GitHub Pages URL | `https://USERNAME.github.io/REPO-NAME` |

#### Deployment Triggers

The site will automatically build and deploy when:
- You push changes to the `main` branch
- You manually trigger the workflow from the Actions tab
- (Optional) On a schedule (uncomment the `schedule` section in `.github/workflows/deploy.yml`)

#### Manual Deployment

To manually trigger a deployment:
1. Go to **Actions** tab in your repository
2. Select "Build and Deploy Static Site" workflow
3. Click "Run workflow"
4. Select the branch (usually `main`)
5. Click "Run workflow"

#### Using Mock Data for Deployment

If you want to deploy the site with mock data (for testing without OSM credentials):
1. Edit `.github/workflows/deploy.yml`
2. Uncomment the line: `# USE_MOCK_DATA: true`
3. Commit and push the change

**Warning**: Mock data should only be used for testing. Production sites should use real OSM data.

#### Troubleshooting

**Build fails with "Missing OSM API credentials"**:
- Ensure `OSM_API_ID` and `OSM_API_TOKEN` secrets are set correctly
- Or enable `USE_MOCK_DATA: true` in the workflow file

**Build succeeds but pages don't update**:
- Check that GitHub Pages source is set to "GitHub Actions"
- Ensure the workflow has write permissions to `pages` (already configured in `deploy.yml`)
- Check the Actions tab for any deployment errors

**Rate limit errors during build**:
- The OSM API has rate limits
- Consider scheduling builds during off-peak hours
- Use mock data for development/testing

## Project Structure

```
scouts/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions deployment workflow
├── app/
│   ├── layout.tsx              # Root layout with metadata
│   ├── page.tsx                # Home page
│   └── events/
│       ├── page.tsx            # Events listing page
│       └── [eveningid]/
│           └── page.tsx        # Individual event page
├── lib/
│   ├── metadata.ts             # SEO and Open Graph utilities
│   └── osm/
│       ├── index.ts            # OSM API client entry point
│       ├── client.ts           # Real OSM API client
│       ├── mock-client.ts      # Mock data client
│       ├── mock-data.ts        # Mock data definitions
│       └── types.ts            # TypeScript types for OSM API
├── .env.example                # Example environment variables
├── .gitignore                  # Git ignore rules
├── next.config.js              # Next.js configuration
├── package.json                # Dependencies and scripts
├── tsconfig.json               # TypeScript configuration
└── README.md                   # This file
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Support

For questions or issues:
- Open an issue on GitHub
- Check the [OSM API Documentation](https://opensource.newcastlescouts.org.uk/)
- Refer to the [Next.js Documentation](https://nextjs.org/docs)
