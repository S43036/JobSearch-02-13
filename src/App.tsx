import React, { useState } from 'react';
import {
  Container,
  CssBaseline,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import Header from "./components/Header";
import ResumeUpload from "./components/ResumeUpload";
import JobList from "./components/JobList";
import JobCard from "./components/JobCard";
import jobs from "./jobs.json";

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

function App() {
  const [matchedJobs, setMatchedJobs] = useState<any[]>([]);

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
        setMatchedJobs(newMatchedJobs.sort((a, b) => b.match - a.match));
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
    return Math.round((matchCount / keywords.length) * 100);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header />
      <Container sx={{ mt: 4 }}>
        <ResumeUpload onUpload={handleResumeUpload} />
        <JobList />
        {
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
        }
      </Container>
    </ThemeProvider>
  );
}

export default App;
