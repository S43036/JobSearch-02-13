import React from 'react';
import { Container, Typography } from '@mui/material';

const JobList: React.FC = () => {
  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Matching Job Opportunities
      </Typography>
    </Container>
  );
};

export default JobList;
