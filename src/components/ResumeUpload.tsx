import React from 'react';
import { Button, Container, Typography } from '@mui/material';

interface ResumeUploadProps {
  onUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const ResumeUpload: React.FC<ResumeUploadProps> = ({ onUpload }) => {
  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Upload Your Resume
      </Typography>
      <input
        accept=".txt,.docx,.pdf"
        style={{ display: 'none' }}
        id="resume-upload"
        type="file"
        onChange={onUpload}
      />
      <label htmlFor="resume-upload">
        <Button variant="contained" component="span">
          Choose File
        </Button>
      </label>
    </Container>
  );
};

export default ResumeUpload;
