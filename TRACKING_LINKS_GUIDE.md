# Tracking Links & Analytics Guide

## 📋 Table of Contents
1. [Creating Tracking Links](#creating-tracking-links)
2. [Viewing Analytics Data](#viewing-analytics-data)
3. [Understanding the Data](#understanding-the-data)
4. [Creating Admin Dashboard (Optional)](#creating-admin-dashboard-optional)

---

## 🔗 Creating Tracking Links

### Quick Start: Create Your First Link

**1. Using cURL (Command Line)**

```bash
curl -X POST http://localhost:3000/api/v1/analytics/links \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -d '{
    "name": "Email Campaign - January",
    "destinationUrl": "http://localhost:4200/sign-up",
    "utmSource": "email",
    "utmMedium": "newsletter",
    "utmCampaign": "january_2024",
    "redirectToSignup": true,
    "postSignupRedirect": "/survey-campaign"
  }'
```

**2. Using Postman**

```
POST http://localhost:3000/api/v1/analytics/links

Headers:
  Content-Type: application/json
  Authorization: Bearer YOUR_ADMIN_TOKEN

Body (JSON):
{
  "name": "Social Media Campaign",
  "destinationUrl": "http://localhost:4200/sign-up",
  "utmSource": "instagram",
  "utmMedium": "social",
  "utmCampaign": "influencer_collab",
  "redirectToSignup": true,
  "postSignupRedirect": "/survey-campaign"
}
```

**3. Using JavaScript (Browser Console/Node)**

```javascript
async function createTrackingLink() {
  const response = await fetch('http://localhost:3000/api/v1/analytics/links', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer YOUR_ADMIN_TOKEN'
    },
    body: JSON.stringify({
      name: 'WhatsApp Campaign',
      destinationUrl: 'http://localhost:4200/sign-up',
      utmSource: 'whatsapp',
      utmMedium: 'messaging',
      utmCampaign: 'referral_program',
      redirectToSignup: true,
      postSignupRedirect: '/survey-campaign'
    })
  });

  const data = await response.json();
  console.log('Tracking Link Created:', data);
  console.log('Share this URL:', data.data.fullTrackingUrl);

  return data;
}

createTrackingLink();
```

### 📝 Link Parameters Explained

| Parameter | Required | Description | Example |
|-----------|----------|-------------|---------|
| `name` | ✅ Yes | Internal name for the campaign | "Summer Email Campaign" |
| `destinationUrl` | ✅ Yes | Where the link ultimately goes | "http://localhost:4200/sign-up" |
| `utmSource` | ⚪ Optional | Traffic source | "email", "facebook", "google" |
| `utmMedium` | ⚪ Optional | Marketing medium | "newsletter", "social", "cpc" |
| `utmCampaign` | ⚪ Optional | Campaign name | "summer_2024", "product_launch" |
| `utmTerm` | ⚪ Optional | Paid keywords | "survey panel", "market research" |
| `utmContent` | ⚪ Optional | Content variant | "banner_a", "text_link_1" |
| `redirectToSignup` | ⚪ Optional | Auto-redirect to signup | `true` (default), `false` |
| `postSignupRedirect` | ⚪ Optional | Where to go after signup | "/survey-campaign" (default) |
| `expiresAt` | ⚪ Optional | Expiration date/time | "2024-12-31T23:59:59Z" |

### 🎯 Campaign Examples

**Email Newsletter Campaign:**
```json
{
  "name": "Monthly Newsletter - March",
  "destinationUrl": "http://localhost:4200/sign-up",
  "utmSource": "email",
  "utmMedium": "newsletter",
  "utmCampaign": "march_monthly",
  "utmContent": "header_cta",
  "redirectToSignup": true,
  "postSignupRedirect": "/survey-campaign"
}
```

**Facebook Ad Campaign:**
```json
{
  "name": "Facebook Brand Awareness",
  "destinationUrl": "http://localhost:4200/sign-up",
  "utmSource": "facebook",
  "utmMedium": "paid_social",
  "utmCampaign": "brand_awareness_q1",
  "utmContent": "video_ad_1",
  "redirectToSignup": true,
  "postSignupRedirect": "/survey-campaign"
}
```

**Influencer Partnership:**
```json
{
  "name": "Instagram Influencer - @username",
  "destinationUrl": "http://localhost:4200/sign-up",
  "utmSource": "instagram",
  "utmMedium": "influencer",
  "utmCampaign": "influencer_collab_jan",
  "utmContent": "bio_link",
  "redirectToSignup": true,
  "postSignupRedirect": "/survey-campaign"
}
```

**Direct WhatsApp Share:**
```json
{
  "name": "WhatsApp Referral Program",
  "destinationUrl": "http://localhost:4200/sign-up",
  "utmSource": "whatsapp",
  "utmMedium": "referral",
  "utmCampaign": "referral_2024",
  "redirectToSignup": true,
  "postSignupRedirect": "/survey-campaign"
}
```

---

## 📊 Viewing Analytics Data

### 1. Get All Tracking Links

**Endpoint:** `GET /api/v1/analytics/links`

```bash
curl http://localhost:3000/api/v1/analytics/links \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-1",
      "name": "Email Campaign - January",
      "shortCode": "ABC12345",
      "trackingUrl": "/t/ABC12345",
      "fullTrackingUrl": "http://localhost:4200/t/ABC12345",
      "utmSource": "email",
      "utmMedium": "newsletter",
      "utmCampaign": "january_2024",
      "isActive": true,
      "createdAt": "2025-01-15T10:00:00Z",
      "stats": {
        "uniqueVisitors": 150,
        "totalSessions": 200,
        "pageViews": 450,
        "registrations": 25
      }
    }
  ]
}
```

### 2. Get Specific Link Details

**Endpoint:** `GET /api/v1/analytics/links/:id`

```bash
curl http://localhost:3000/api/v1/analytics/links/uuid-1 \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

**Response includes:**
- Link details
- Total clicks
- Unique visitors
- Conversions (signups)
- Page views
- Registrations

### 3. Get Overall Analytics Overview

**Endpoint:** `GET /api/v1/analytics/overview`

```bash
# All data
curl http://localhost:3000/api/v1/analytics/overview \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"

# Filtered by date range
curl "http://localhost:3000/api/v1/analytics/overview?startDate=2025-01-01&endDate=2025-01-31" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"

# Filtered by specific link
curl "http://localhost:3000/api/v1/analytics/overview?linkId=uuid-1" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "uniqueVisitors": 1250,
    "totalSessions": 1800,
    "pageViews": 5400,
    "totalClicks": 3200,
    "formSubmissions": 450,
    "registrations": 280
  }
}
```

### 4. Get Visitor List

**Endpoint:** `GET /api/v1/analytics/visitors`

```bash
# All visitors
curl http://localhost:3000/api/v1/analytics/visitors \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"

# Filtered by link
curl "http://localhost:3000/api/v1/analytics/visitors?linkId=uuid-1" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"

# Only registered users
curl "http://localhost:3000/api/v1/analytics/visitors?registered=true" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"

# With pagination
curl "http://localhost:3000/api/v1/analytics/visitors?limit=50&offset=0" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### 5. Get Visitor Journey

**Endpoint:** `GET /api/v1/analytics/visitors/:visitorId`

```bash
curl http://localhost:3000/api/v1/analytics/visitors/visitor-uuid-123 \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

**Shows:**
- All pages visited
- Time spent on each page
- Actions taken
- Conversion funnel
- Device info
- Geographic location

### 6. Get Top Pages

**Endpoint:** `GET /api/v1/analytics/pages`

```bash
curl "http://localhost:3000/api/v1/analytics/pages?limit=20" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### 7. Get Traffic Sources

**Endpoint:** `GET /api/v1/analytics/sources`

```bash
curl http://localhost:3000/api/v1/analytics/sources \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "source": "email",
      "medium": "newsletter",
      "campaign": "january_2024",
      "uniqueVisitors": 150,
      "pageViews": 450
    },
    {
      "source": "facebook",
      "medium": "social",
      "campaign": "brand_awareness",
      "uniqueVisitors": 320,
      "pageViews": 890
    }
  ]
}
```

### 8. Get Timeline Data

**Endpoint:** `GET /api/v1/analytics/timeline`

```bash
# Daily data
curl "http://localhost:3000/api/v1/analytics/timeline?interval=day" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"

# Hourly data
curl "http://localhost:3000/api/v1/analytics/timeline?interval=hour&startDate=2025-01-15&endDate=2025-01-16" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"

# Monthly data
curl "http://localhost:3000/api/v1/analytics/timeline?interval=month" \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

### 9. Get Geographic Data

**Endpoint:** `GET /api/v1/analytics/geo`

```bash
curl http://localhost:3000/api/v1/analytics/geo \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "country": "IN",
      "city": "Mumbai",
      "uniqueVisitors": 85,
      "pageViews": 240
    },
    {
      "country": "IN",
      "city": "Delhi",
      "uniqueVisitors": 65,
      "pageViews": 180
    }
  ]
}
```

---

## 📈 Understanding the Data

### Key Metrics Explained

1. **Unique Visitors**: Total number of individual people who clicked your link
2. **Total Sessions**: Number of separate visits (a user can have multiple sessions)
3. **Page Views**: Total pages viewed across all sessions
4. **Total Clicks**: Total link clicks (includes multiple clicks from same user)
5. **Registrations**: Number of users who completed signup
6. **Conversion Rate**: (Registrations / Unique Visitors) × 100

### Tracking Events

The system automatically tracks:

| Event Type | When it happens | Data captured |
|------------|-----------------|---------------|
| `page_view` | User visits any page | URL, title, referrer, device info |
| `click` | User clicks tracked elements | Element type, text, coordinates |
| `form_submit` | User submits a form | Form ID, fields submitted |
| `user_registered` | User completes signup | User ID, email, source link |
| `scroll_depth` | User scrolls page | Depth percentage (25%, 50%, 75%, 100%) |
| `time_on_page` | User leaves page | Seconds spent, max scroll depth |
| `onboarding_survey_completed` | User finishes survey | Survey ID, link ID |

---

## 🎨 Creating Admin Dashboard (Optional)

Since you don't have an admin panel yet, here's a quick React component to view analytics:

### Quick Analytics Dashboard Component

Create: `src/pages/admin/analytics-dashboard.tsx`

```tsx
import React, { useEffect, useState } from 'react';
import { BarChart, Users, Link as LinkIcon, TrendingUp } from 'lucide-react';

interface AnalyticsData {
  uniqueVisitors: number;
  totalSessions: number;
  pageViews: number;
  registrations: number;
}

interface TrackingLink {
  id: string;
  name: string;
  shortCode: string;
  fullTrackingUrl: string;
  stats: {
    uniqueVisitors: number;
    registrations: number;
  };
}

const AnalyticsDashboard: React.FC = () => {
  const [overview, setOverview] = useState<AnalyticsData | null>(null);
  const [links, setLinks] = useState<TrackingLink[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      // Fetch overview
      const overviewRes = await fetch('/api/v1/analytics/overview', {
        credentials: 'include',
      });
      const overviewData = await overviewRes.json();
      setOverview(overviewData.data);

      // Fetch links
      const linksRes = await fetch('/api/v1/analytics/links', {
        credentials: 'include',
      });
      const linksData = await linksRes.json();
      setLinks(linksData.data);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Link copied to clipboard!');
  };

  if (loading) {
    return <div className="p-8">Loading analytics...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Analytics Dashboard</h1>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Unique Visitors</p>
                <p className="text-2xl font-bold text-gray-900">{overview?.uniqueVisitors || 0}</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Sessions</p>
                <p className="text-2xl font-bold text-gray-900">{overview?.totalSessions || 0}</p>
              </div>
              <BarChart className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Page Views</p>
                <p className="text-2xl font-bold text-gray-900">{overview?.pageViews || 0}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Registrations</p>
                <p className="text-2xl font-bold text-gray-900">{overview?.registrations || 0}</p>
              </div>
              <LinkIcon className="w-8 h-8 text-orange-600" />
            </div>
          </div>
        </div>

        {/* Tracking Links Table */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Tracking Links</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Campaign Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Short Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Visitors
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Registrations
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Conversion %
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {links.map((link) => {
                  const conversionRate = link.stats.uniqueVisitors > 0
                    ? ((link.stats.registrations / link.stats.uniqueVisitors) * 100).toFixed(1)
                    : '0.0';

                  return (
                    <tr key={link.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {link.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {link.shortCode}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {link.stats.uniqueVisitors}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {link.stats.registrations}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {conversionRate}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => copyToClipboard(link.fullTrackingUrl)}
                          className="text-primary hover:text-primary/80 font-medium"
                        >
                          Copy Link
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
```

### Add Route for Dashboard

In `src/routes/routeConfig.ts`:
```typescript
ANALYTICS_DASHBOARD: '/admin/analytics',
```

In your routes file, add:
```typescript
{
  path: '/admin/analytics',
  element: <AnalyticsDashboard />,
}
```

---

## 🚀 Quick Reference Commands

### Create a Link
```bash
curl -X POST http://localhost:3000/api/v1/analytics/links \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"name":"Test","destinationUrl":"http://localhost:4200/sign-up","utmSource":"test","redirectToSignup":true}'
```

### View All Links
```bash
curl http://localhost:3000/api/v1/analytics/links \
  -H "Authorization: Bearer TOKEN"
```

### View Overview
```bash
curl http://localhost:3000/api/v1/analytics/overview \
  -H "Authorization: Bearer TOKEN"
```

### Delete a Link
```bash
curl -X DELETE http://localhost:3000/api/v1/analytics/links/LINK_ID \
  -H "Authorization: Bearer TOKEN"
```

---

## 📱 Testing Your Links

1. **Create a link** using one of the methods above
2. **Copy the `fullTrackingUrl`** from the response
3. **Open in incognito window** to test as new user
4. **Complete signup flow**
5. **Check analytics** to see the data

Your link will track:
- ✅ Initial click
- ✅ Page views
- ✅ Time spent
- ✅ Signup completion
- ✅ Onboarding survey completion
- ✅ Full user journey

---

## 💡 Pro Tips

1. **Use descriptive names**: Makes it easier to identify campaigns later
2. **Consistent UTM naming**: Use lowercase, underscores for spaces
3. **Set expiration dates**: For time-limited campaigns
4. **Monitor conversion rates**: Aim for >10% signup conversion
5. **A/B test campaigns**: Create multiple links with different utm_content values
6. **Export data regularly**: Build reports from the API data

---

## 🔒 Security Notes

- All analytics endpoints require authentication
- Only admin users can create/delete links
- Track endpoints are public (for collecting data)
- Consider rate limiting for production

---

## Need Help?

- Check browser console for tracking errors
- Verify API is running: `http://localhost:3000/api/health`
- Test tracker script: `window.ThoughtMetrics` in console
- View localStorage: Check for `tm_*` keys
