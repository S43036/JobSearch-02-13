import React from 'react';
import {
  Paper,
  Typography,
  List,
  ListItem,
  Chip
} from '@mui/material';
import { LightbulbOutlined as LightbulbIcon } from '@mui/icons-material';

interface ResumeSuggestionsProps {
  suggestions: string[];
}

const ResumeSuggestions: React.FC<ResumeSuggestionsProps> = ({ suggestions }) => {
  if (suggestions.length === 0) {
    return null;
  }

  return (
    <Paper elevation={3} sx={{ p: 3, my: 4, borderRadius: 2 }}>
      <Typography variant="h5" gutterBottom>
        <LightbulbIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
        Resume Suggestions
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        Consider adding these keywords to your resume to better match the top job listings:
      </Typography>
      <List>
        {suggestions.map((suggestion, index) => (
          <ListItem key={index} disablePadding>
            <Chip label={suggestion} sx={{ m: 0.5 }} />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default ResumeSuggestions;
