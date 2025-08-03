/**
 * Statistics Service
 * Handles API calls for statistics data
 */

/**
 * Fetches statistics data from the API
 * @returns {Promise<Object>} Statistics object with schools, volunteers, children, and contributions
 * @throws {Error} When the API response is not successful
 */
export const getStatistics = async () => {
  try {
    const response = await fetch('/api/statistics');
    
    // Handle non-200 responses
    if (!response.ok) {
      let errorMessage = 'Failed to fetch statistics';
      
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (parseError) {
        // If we can't parse the error response, use the status text
        errorMessage = response.statusText || errorMessage;
      }
      
      throw new Error(errorMessage);
    }
    
    const data = await response.json();
    
    // Transform the response to match the expected shape
    // Map 'students' key to 'children' as specified in requirements
    return {
      schools: data.schools,
      volunteers: data.volunteers,
      children: data.students, // Map students to children
      contributions: data.contributions
    };
  } catch (error) {
    // Re-throw network errors or parsing errors
    if (error instanceof Error) {
      throw error;
    }
    
    // Handle unexpected errors
    throw new Error('An unexpected error occurred while fetching statistics');
  }
};
