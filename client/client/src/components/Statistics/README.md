# Statistics Components

This directory contains the Statistics components for displaying application statistics.

## Components

### StatisticsCard
Displays a single statistic with icon, label, and animated count.

**Props:**
- `icon` (string/React element): The icon to display
- `label` (string): The label for the statistic
- `count` (number): The numeric value to display

**Example:**
```jsx
import StatisticsCard from './StatisticsCard';

<StatisticsCard 
  icon="👥" 
  label="Students" 
  count={1234} 
/>
```

### StatisticsGrid
Fetches statistics data and displays four StatisticsCard components in a responsive grid layout.

**Features:**
- Fetches data on mount via `statisticsService`
- Handles loading states with skeleton UI
- Handles error states with retry functionality
- Responsive CSS Grid layout
- Consistent hover elevation with `.request-card`

**Example:**
```jsx
import StatisticsGrid from './StatisticsGrid';

<StatisticsGrid />
```

## Usage Example

```jsx
import React from 'react';
import { StatisticsGrid } from '../components/Statistics';

const Dashboard = () => {
  return (
    <div>
      <h1>Dashboard</h1>
      <StatisticsGrid />
    </div>
  );
};

export default Dashboard;
```

## Styling

The components use the project's design system variables defined in `src/styles/root.css`. The hover effects are consistent with the existing `.request-card` styles for a cohesive user experience.

## Responsive Breakpoints

- **Desktop (1200px+)**: 4 columns
- **Tablet (768px-1200px)**: 2 columns  
- **Mobile (480px-768px)**: 2 columns
- **Small Mobile (< 480px)**: 1 column
