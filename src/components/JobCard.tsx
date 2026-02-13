import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  CardActions,
  Grid,
  Box,
  Chip,
} from "@mui/material";

interface JobCardProps {
  title: string;
  company: string;
  description: string;
  match: number;
  url: string;
}

const JobCard: React.FC<JobCardProps> = ({ title, company, description, match, url }) => {
  const matchColor = match > 75 ? 'success' : match > 50 ? 'warning' : 'default';

  return (
    <Card sx={{ mb: 3, p: 2, boxShadow: 3, borderRadius: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <Typography variant="h5" component="div" gutterBottom>
            {title}
          </Typography>
          <Typography color="text.secondary" gutterBottom>
            {company}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5, maxHeight: 100, overflow: 'hidden' }}>
            {description}
          </Typography>
        </Grid>
        <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6">Match Score</Typography>
            <Chip label={`${match}%`} color={matchColor} sx={{ mt: 1, fontSize: '1.1rem' }} />
          </Box>
          <CardActions sx={{ mt: 'auto' }}>
            <Button variant="contained" size="medium" href={url} target="_blank" rel="noopener noreferrer">
              Apply Now
            </Button>
          </CardActions>
        </Grid>
      </Grid>
    </Card>
  );
};

export default JobCard;
