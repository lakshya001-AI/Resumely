import React from 'react';
import { CircularProgress, Box, Typography } from '@mui/material';

function ResumeGauge({ score }) {
  const getColor = () => {
    if (score < 30) return 'error'; // Red
    if (score >= 30 && score < 75) return 'warning'; // Orange
    return 'success'; // Green
  };

  return (
    <Box position="relative" display="inline-flex" alignItems="center" justifyContent="center" width={100} height={100}>
      <CircularProgress
        variant="determinate"
        value={score}
        size={100}
        thickness={4}
        color={getColor()}
      />
      <Box
        position="absolute"
        top="50%"
        left="50%"
        style={{ transform: 'translate(-50%, -50%)' }}
      >
        <Typography variant="body1" color="textSecondary" style={{ fontWeight: 'bold' }}>
          {score}%
        </Typography>
      </Box>
    </Box>
  );
}

export default ResumeGauge;
