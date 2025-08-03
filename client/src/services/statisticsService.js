/**
 * Statistics Service
 * Provides statistics data for the application
 */

/**
 * Get statistics data
 * Fetches real-time statistics from the API, falls back to zeros if failed
 * @returns {Promise<Object>} Promise resolving to statistics object
 */
export const getStatistics = async () => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_BASE || ''}/api/statistics`);
    if (!res.ok) {
      console.warn('Failed to fetch statistics from API, using fallback data');
      return {
        students: 0,
        schools: 0,
        volunteers: 0,
        contributions: 0
      };
    }
    return res.json();
  } catch (error) {
    console.warn('Error fetching statistics, using fallback data:', error);
    // Return fallback data instead of throwing
    return {
      students: 0,
      schools: 0,
      volunteers: 0,
      contributions: 0
    };
  }
};
