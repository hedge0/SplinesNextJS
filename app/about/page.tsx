'use client';

import { Box, Typography, Link, IconButton } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

/**
 * About component that provides an overview of the application and its purpose.
 *
 * @returns {JSX.Element} - The rendered component describing the app's features and goals.
 */
export default function About() {
    return (
        <Box className="bg-gray-700 rounded-lg shadow-lg p-6">
            <Typography variant="h5" sx={{ color: 'white', marginBottom: 2 }}>
                About
            </Typography>
            <Typography variant="body1" sx={{ color: 'white', marginBottom: 3 }}>
                This website serves as a demonstration of my interpolation models, showcasing real-time visualization of
                implied volatility data. Built with Next.js and React, it allows users to explore financial models such as
                RFV, SLV, SABR, and SVI, which are widely used in the trading industry to model and predict volatility smiles.
                You can interactively filter and display options data, fit model curves, and visualize key metrics related to
                volatility surfaces.
            </Typography>
            <Typography variant="body1" sx={{ color: 'white', marginBottom: 3 }}>
                The models available on this platform are critical tools for quants and traders, allowing for more accurate
                predictions of options prices across different strikes and maturities. By utilizing cutting edge interpolation
                techniques, this application aims to optimize the efficiency of options trading analysis.
            </Typography>
            <Typography variant="body1" sx={{ color: 'white', marginBottom: 3 }}>
                With a background in fullstack software engineering and a deep interest in financial applications and performance
                optimization, I&apos;ve designed this platform to showcase my passion and expertise in building tools
                for financial markets.
            </Typography>
            <Typography variant="body1" sx={{ color: 'white', marginBottom: 3 }}>
                You can check out my professional profile and projects on LinkedIn and GitHub:
            </Typography>
            <Box display="flex" alignItems="center" sx={{ marginBottom: 2 }}>
                <IconButton href="https://www.linkedin.com/in/cselias/" target="_blank" rel="noopener noreferrer" sx={{ color: '#8884d8' }}>
                    <LinkedInIcon />
                </IconButton>
                <Link href="https://www.linkedin.com/in/cselias/" target="_blank" rel="noopener noreferrer" sx={{ color: '#8884d8', marginLeft: 1 }}>
                    LinkedIn Profile
                </Link>
            </Box>
            <Box display="flex" alignItems="center">
                <IconButton href="https://github.com/hedge0" target="_blank" rel="noopener noreferrer" sx={{ color: '#8884d8' }}>
                    <GitHubIcon />
                </IconButton>
                <Link href="https://github.com/hedge0" target="_blank" rel="noopener noreferrer" sx={{ color: '#8884d8', marginLeft: 1 }}>
                    GitHub Projects
                </Link>
            </Box>
        </Box>
    );
}
