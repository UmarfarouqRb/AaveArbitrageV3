import { useState, useEffect } from 'react';

const useOwner = () => {
  const [owner, setOwner] = useState(null);

  useEffect(() => {
    const fetchOwner = async () => {
      try {
        const response = await fetch('/api/owner');
        const data = await response.json();
        setOwner(data.owner);
      } catch (error) {
        console.error('Error fetching owner:', error);
      }
    };

    fetchOwner();
  }, []);

  return owner;
};

export default useOwner;
