import React, { useState, useEffect } from 'react';

const ContributionsTracker = () => {
    const [contributions, setContributions] = useState(0);

    useEffect(() => {
        const fetchContributions = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_BASE || ''}/api/statistics`);
                const data = await res.json();
                setContributions(data.contributions);
            } catch (error) {
                console.error('Failed to fetch contributions:', error);
            }
        };

        // Fetch initially
        fetchContributions();

        // Polling every minute
        const intervalId = setInterval(fetchContributions, 60000);

        // Cleanup interval
        return () => clearInterval(intervalId);
    }, []);

    return (
        <div>
            <h3>Contributions: {contributions}</h3>
        </div>
    );
};

export default ContributionsTracker;
