import React, { useState, useEffect } from 'react';
import "./styles.css";
function App() {
  const [jobPostings, setJobPostings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchJobPostings();
  }, [page]);

  const fetchJobPostings = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://hacker-news.firebaseio.com/v0/jobstories.json`
      );
      const jobIds = await response.json();

      const startIndex = (page - 1) * 6;
      const endIndex = startIndex + 6;
      const pageJobIds = jobIds.slice(startIndex, endIndex);

      const jobDetailsPromises = pageJobIds.map(async (jobId) => {
        const jobDetailsResponse = await fetch(
          `https://hacker-news.firebaseio.com/v0/item/${jobId}.json`
        );
        return await jobDetailsResponse.json();
      });

      const jobDetails = await Promise.all(jobDetailsPromises);
      setJobPostings([...jobPostings, ...jobDetails]);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching job postings:', error);
      setIsLoading(false);
    }
  };

  const loadMorePostings = () => {
    setPage(page + 1);
  };

  return (
    <div>
      <h3>Hacker News Jobs Board</h3>
      <ul>
        {jobPostings.map((job, index) => (
          <li key={job.id}>
            {job.url ? (
              <a href={job.url} target="_blank" rel="noopener noreferrer">
                {job.title}
              </a>
            ) : (
              job.title
            )}
            <p>Posted by {job.by} on {new Date(job.time * 1000).toLocaleString()}</p>
          </li>
        ))}
      </ul>
      {isLoading && <p>Loading...</p>}
      {jobPostings.length % 6 === 0 && (
        <button onClick={loadMorePostings}>Load More</button>
      )}
    </div>
  );
}

export default App;