import React from 'react';
import { Card, CardContent, Typography, Button, CardActions } from '@mui/material';

interface JobCardProps {
  title: string;
  company: string;
  description: string;
  match: number;
  url: string;
}

const JobCard: React.FC<JobCardProps> = ({ title, company, description, match, url }) => {
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6">{title}</Typography>
        <Typography color="text.secondary">{company}</Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>{description}</Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          <strong>Match:</strong> {match}%
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" href={url} target="_blank" rel="noopener noreferrer">
          Apply Now
        </Button>
      </CardActions>
    </Card>
  );
};

export default JobCard;
