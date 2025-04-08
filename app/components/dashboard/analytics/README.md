# Analytics Dashboard Components

This directory contains modular components for the analytics dashboard in the Drone Community App.

## Component Structure

- `analytics-dashboard.tsx`: The main dashboard wrapper with tab navigation between Overview and Insights.
- `overview-analytics.tsx`: Implementation of the main analytics overview section. Shows key metrics, charts, and profile completion prompts. Used both in the full Analytics page and embedded in the Photographer Dashboard.
- `premium-analytics.tsx`: Implementation of premium analytics features (available under the Insights tab).
- `analytics-card.tsx`: Reusable card for displaying individual analytics metrics.
- `visitor-chart.tsx`: Chart component for visualizing visitor statistics.
- `booking-chart.tsx`: Chart component for visualizing booking statistics.
- `analytics-tip.tsx`: Component for displaying actionable insights and tips.
- Various other chart components for specific analytics visualizations (e.g., GeographicMap, EngagementFunnelChart, etc.).

## Usage

### Full Analytics Dashboard (Analytics Page)

To use the full analytics dashboard on a dedicated page (e.g., `/dashboard/analytics`):

```tsx
import { AnalyticsDashboard } from "@/components/dashboard/analytics/analytics-dashboard"

export default function AnalyticsPage() {
  // Fetch user data, subscription status, etc.
  const userIsPremium = true // Example
  const isProfileComplete = true // Example
  const isPortfolioComplete = true // Example

  return (
    <AnalyticsDashboard
      isPremium={userIsPremium}
      isPortfolioComplete={isProfileComplete}
      isPortfolioComplete={isPortfolioComplete}
    />
  )
}
```

### Embedded Analytics Overview (Photographer Dashboard)

To embed the analytics overview directly into a tab within the photographer dashboard:

```tsx
import { OverviewAnalytics } from "@/components/dashboard/analytics/overview-analytics"

export function PhotographerDashboard() {
  // Get user state (profile completion, portfolio completion, premium status, etc.)
  const isProfileComplete = true // Example
  const isPortfolioComplete = false // Example
  const isPremium = false // Example

  return (
    <Tabs>
      <TabsContent value="analytics">
        <OverviewAnalytics
          isProfileComplete={isProfileComplete}
          isPortfolioComplete={isPortfolioComplete}
          isPremium={isPremium}
          // OverviewAnalytics handles its own internal loading state
        />
      </TabsContent>
      {/* Other tabs */}
    </Tabs>
  )
}
```

### Individual Components

You can also use individual components if needed:

```tsx
import { AnalyticsCard } from "@/components/dashboard/analytics/analytics-card"
import { VisitorChart } from "@/components/dashboard/analytics/visitor-chart"

<AnalyticsCard
  title="Profile Views"
  value="243"
  description="Last 30 days"
  icon={Eye}
  trend={+15}
  isLoading={false} // Pass loading state if needed
/>

<VisitorChart isLoading={false} />
```

## Props Reference

### OverviewAnalytics

| Prop                | Type    | Default | Description                                                  |
| ------------------- | ------- | ------- | ------------------------------------------------------------ |
| `isPremium`         | boolean | `false` | Indicates if the user has premium access.                    |
| `isProfileComplete` | boolean | `false` | Whether the user has completed their basic profile.          |
| `isPortfolioComplete`| boolean | `false` | Whether the user has uploaded portfolio items.             |

### AnalyticsCard

| Prop          | Type         | Default | Description                                                  |
| ------------- | ------------ | ------- | ------------------------------------------------------------ |
| `title`       | string       | -       | The metric title.                                            |
| `value`       | string       | -       | The metric value.                                            |
| `description` | string       | -       | Additional description (e.g., time period).                |
| `icon`        | `LucideIcon` | -       | Icon to display next to the title.                           |
| `trend`       | number       | -       | Percentage change (positive or negative) to show trend.      |
| `isLoading`   | boolean      | `false` | If true, displays a loading skeleton.                        |
| `isPremium`   | boolean      | `false` | If true, hides the value and shows a lock icon (premium feature). |

## Development Guidelines

1.  **Loading States:** Components fetching data should handle their own loading states internally (e.g., `OverviewAnalytics`). Components receiving data via props (e.g., `AnalyticsCard`) can accept an `isLoading` prop.
2.  **Premium Features:** Use the `isPremium` prop consistently to conditionally render UI elements or show upgrade prompts.
3.  **User Guidance:** Provide clear prompts (like in `OverviewAnalytics`) guiding users to complete their profiles/portfolios to unlock full analytics.
4.  **Consistency:** Maintain styling and layout consistent with the rest of the dashboard using Shadcn UI and Tailwind CSS.
5.  **Responsiveness:** Ensure all components are responsive across different screen sizes.
6.  **TypeScript:** Use clear TypeScript interfaces for all component props. 