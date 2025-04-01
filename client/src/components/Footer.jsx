import React from 'react';
import { Box, Typography, Link } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';

const Footer = () => {
  return (
    <Box 
      component="footer" 
      sx={{ 
        py: 3,
        mt: 'auto',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderTop: '1px solid rgba(255, 255, 255, 0.12)'
      }}
    >
      <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        Made with ❤️ by 
        <Link 
          href="https://github.com/Guru322" 
          target="_blank" 
          rel="noopener noreferrer" 
          sx={{ 
            display: 'inline-flex', 
            alignItems: 'center',
            fontWeight: 600,
            color: 'primary.main',
            textDecoration: 'none',
            '&:hover': {
              textDecoration: 'underline'
            }
          }}
        >
          GURU
          <GitHubIcon fontSize="small" sx={{ ml: 0.5 }} />
        </Link>
      </Typography>
    </Box>
  );
};

export default Footer;