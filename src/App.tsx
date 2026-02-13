import React, { useState, useEffect } from 'react';
import axios from 'axios';
import mammoth from 'mammoth';
import * as pdfjs from 'pdfjs-dist';
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
import ResumeSuggestions from './components/ResumeSuggestions';

// Set up the worker for pdfjs-dist
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

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

interface ApiJob {
  job_id: string;
  job_title: string;
  employer_name: string;
  job_description: string;
  job_apply_link: string;
}

function App() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [matchedJobs, setMatchedJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [resumeError, setResumeError] = useState<string | null>(null);
  const [resumeSuggestions, setResumeSuggestions] = useState<string[]>([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const options = {
          method: 'GET',
          url: 'https://jsearch.p.rapidapi.com/search',
          params: {
            query: 'Software developer in Singapore',
            num_pages: '1'
          },
          headers: {
            'x-rapidapi-key': import.meta.env.VITE_RAPIDAPI_KEY,
            'x-rapidapi-host': 'jsearch.p.rapidapi.com'
          }
        };

        const response = await axios.request(options);
        const fetchedJobs = response.data.data.map((apiJob: ApiJob) => {
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
        setResumeError(null);
        const reader = new FileReader();

        if (file.name.endsWith('.docx')) {
            reader.onload = async (e) => {
                try {
                    const arrayBuffer = e.target?.result as ArrayBuffer;
                    const result = await mammoth.extractRawText({ arrayBuffer });
                    const resumeText = result.value;
                    processResume(resumeText);
                } catch (err) {
                    console.error("Error parsing .docx file:", err);
                    setResumeError("Error parsing .docx file. Please try again.");
                }
            };
            reader.readAsArrayBuffer(file);
        } else if (file.name.endsWith('.txt')) {
            reader.onload = (e) => {
                const resumeText = e.target?.result as string;
                processResume(resumeText);
            };
            reader.readAsText(file);
        } else if (file.name.endsWith('.pdf')) {
            reader.onload = async (e) => {
                try {
                    const arrayBuffer = e.target?.result as ArrayBuffer;
                    const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
                    let resumeText = '';
                    for (let i = 1; i <= pdf.numPages; i++) {
                        const page = await pdf.getPage(i);
                        const textContent = await page.getTextContent();
                        resumeText += textContent.items.map(item => (item as any).str).join(' ');
                    }
                    processResume(resumeText);
                } catch (err) {
                    console.error("Error parsing .pdf file:", err);
                    setResumeError("Error parsing .pdf file. Please try again.");
                }
            };
            reader.readAsArrayBuffer(file);
        } else {
            setResumeError("Unsupported file type. Please upload a .txt, .docx, or .pdf file.");
        }
    }
  };

  const processResume = (resumeText: string) => {
    const newMatchedJobs = jobs.map(job => {
        const matchPercentage = calculateMatch(resumeText, job.keywords);
        return { ...job, match: matchPercentage };
    });
    const sortedJobs = newMatchedJobs.sort((a, b) => (b.match ?? 0) - (a.match ?? 0));
    setMatchedJobs(sortedJobs);
    generateResumeSuggestions(resumeText, sortedJobs.slice(0, 10));
  }

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

  const generateResumeSuggestions = (resume: string, topJobs: Job[]) => {
    const resumeWords = new Set(resume.toLowerCase().split(/\s+/));
    const suggestions = new Set<string>();
    topJobs.forEach(job => {
      job.keywords.forEach(keyword => {
        if (!resumeWords.has(keyword)) {
          suggestions.add(keyword);
        }
      });
    });
    setResumeSuggestions(Array.from(suggestions).slice(0, 10));
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header />
      <Container sx={{ mt: 4 }}>
        <ResumeUpload onUpload={handleResumeUpload} />
        {resumeError && <Typography color="error" align="center" sx={{ my: 2 }}>{resumeError}</Typography>}
        {matchedJobs.length > 0 && <ResumeSuggestions suggestions={resumeSuggestions} />}
        <JobList />
        {loading && <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}><CircularProgress /></Box>}
        {error && <Typography color="error" align="center" sx={{ my: 4 }}>{error}</Typography>}
        {!loading && !error && (
            (matchedJobs.length > 0 ? matchedJobs.slice(0, 10) : jobs).map((job) => (
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
