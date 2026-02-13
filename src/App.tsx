import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  CssBaseline,
  ThemeProvider,
  createTheme,
  CircularProgress,
  Typography,
  Box
} from "@mui/material";
import Header from "./components/Header";
import ResumeUpload from "./components/ResumeUpload";
import JobList from "./components/JobList";
import JobCard from "./components/JobCard";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    background: {
      default: "#f5f5f5",
    },
  },
});

interface Job {
  id: string;
  title: string;
  company: string;
  description: string;
  url: string;
  keywords: string[];
  match?: number;
}

function App() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [matchedJobs, setMatchedJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const options = {
          method: 'GET',
          url: 'https://jsearch.p.rapidapi.com/search',
          params: {
            query: 'Software developer in USA',
            num_pages: '1'
          },
          headers: {
            'x-rapidapi-key': import.meta.env.VITE_RAPIDAPI_KEY,
            'x-rapidapi-host': 'jsearch.p.rapidapi.com'
          }
        };

        const response = await axios.request(options);
        const fetchedJobs = response.data.data.map((apiJob: any) => {
            const jobText = (apiJob.job_title + ' ' + apiJob.job_description).toLowerCase();
            const keywords = [...new Set(jobText.match(/\b(\w+)\b/g) || [])].slice(0, 30);

            return {
                id: apiJob.job_id,
                title: apiJob.job_title,
                company: apiJob.employer_name,
                description: apiJob.job_description,
                url: apiJob.job_apply_link,
                keywords: keywords,
                match: 0,
            }
        });

        setJobs(fetchedJobs);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch jobs. Please check your API key and network connection.');
        setLoading(false);
        console.error(err);
      }
    };

    fetchJobs();
  }, []);

  const handleResumeUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const resumeText = e.target?.result as string;
        const newMatchedJobs = jobs.map(job => {
          const matchPercentage = calculateMatch(resumeText, job.keywords);
          return { ...job, match: matchPercentage };
        });
        setMatchedJobs(newMatchedJobs.sort((a, b) => (b.match ?? 0) - (a.match ?? 0)));
      };
      reader.readAsText(file);
    }
  };

  const calculateMatch = (resume: string, keywords: string[]): number => {
    const resumeWords = resume.toLowerCase().split(/\s+/);
    let matchCount = 0;
    keywords.forEach(keyword => {
      if (resumeWords.includes(keyword)) {
        matchCount++;
      }
    });
    return keywords.length > 0 ? Math.round((matchCount / keywords.length) * 100) : 0;
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header />
      <Container sx={{ mt: 4 }}>
        <ResumeUpload onUpload={handleResumeUpload} />
        <JobList />
        {loading && <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}><CircularProgress /></Box>}
        {error && <Typography color="error" align="center" sx={{ my: 4 }}>{error}</Typography>}
        {!loading && !error && (
            (matchedJobs.length > 0 ? matchedJobs : jobs).map((job) => (
            <JobCard
                key={job.id}
                title={job.title}
                company={job.company}
                description={job.description}
                match={job.match || 0}
                url={job.url}
            />
            ))
        )}
      </Container>
    </ThemeProvider>
  );
}

export default App;
