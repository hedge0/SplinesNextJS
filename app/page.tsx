'use client';

import React, { useState, useEffect } from 'react';
import InteractiblePlot from "@/components/InteractiblePlot";
import { Button, TextField, MenuItem, Select, InputLabel, FormControl, SelectChangeEvent, Box, IconButton, CircularProgress } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

export default function Home() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [ticker, setTicker] = useState<string>('');
  const [isValidTicker, setIsValidTicker] = useState<boolean>(true);
  const [showDropdowns, setShowDropdowns] = useState<boolean>(false);
  const [expirationDate, setExpirationDate] = useState<string>('');
  const [optionType, setOptionType] = useState<string>('calls');
  const [loading, setLoading] = useState<boolean>(false);

  const [r, setr] = useState<number>(0.0);
  const [S, setS] = useState<number>(0.0);
  const [q, setQ] = useState<number>(0.0);

  const T = 0.015708354371353372;
  const fullText = 'Enter Ticker  ';
  const [displayedText, setDisplayedText] = useState('');
  const [isFullTextDisplayed, setIsFullTextDisplayed] = useState(false);

  useEffect(() => {
    let index = 0;
    const typingSpeed = 100;

    const fetchSOFRData = async () => {
      try {
        const response = await fetch('/api/sofr');
        const result = await response.json();
        if (result.rate) {
          setr(result.rate);
        }
      } catch (error) {
        console.error('Error fetching SOFR data:', error);
      }
    };

    const typingEffect = setInterval(() => {
      if (index < fullText.length) {
        setDisplayedText(fullText.slice(0, index + 1));
        index++;
      } else {
        clearInterval(typingEffect);
        setIsFullTextDisplayed(true);
        fetchSOFRData();
      }
    }, typingSpeed);

    return () => clearInterval(typingEffect);
  }, []);

  useEffect(() => {
    if (currentPage === 1 && isFullTextDisplayed) {
      const blinkCursor = setInterval(() => {
        setDisplayedText((prevText) =>
          prevText.endsWith('▌') ? prevText.slice(0, -1) : prevText + '▌'
        );
      }, 500);

      return () => clearInterval(blinkCursor);
    }
  }, [isFullTextDisplayed, currentPage]);

  const handleTickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTicker(e.target.value);
    setShowDropdowns(false);
  };

  const handleExpirationChange = (event: SelectChangeEvent<string>) => {
    setExpirationDate(event.target.value);
  };

  const handleOptionTypeChange = (event: SelectChangeEvent<string>) => {
    setOptionType(event.target.value);
  };

  const verifyTicker = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/quotes?ticker=${ticker}`);
      const data = await response.json();

      const price = data?.marketPrice; // Updated to match the new API response
      const dividendYield = data?.dividendYield; // Updated to match the new API response

      if (price !== undefined) {
        setS(price);
        setQ(dividendYield || 0.0); // Set q to 0 if dividendYield is undefined
        setIsValidTicker(true);
        setShowDropdowns(true);
      } else {
        setIsValidTicker(false);
        setShowDropdowns(false);
      }
    } catch (error) {
      setIsValidTicker(false);
      setShowDropdowns(false);
    }
    setLoading(false);
  };

  const goToPage2 = () => {
    setCurrentPage(2);
    setExpirationDate('');
    setOptionType('calls');
    setShowDropdowns(false);
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-[95vh] py-4" style={{ marginTop: '60px' }}>
      {currentPage === 1 && (
        <Box
          className="bg-gray-700 rounded-lg shadow-lg p-6"
          sx={{
            width: '100%',
            maxWidth: '800px',
            transition: 'all 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            height: showDropdowns ? 'auto' : 'fit-content',
            overflow: 'hidden',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
            <TextField
              label=""
              variant="outlined"
              fullWidth
              placeholder={displayedText}
              value={ticker}
              onChange={handleTickerChange}
              error={!isValidTicker}
              helperText={!isValidTicker ? "Invalid ticker" : ""}
              autoComplete="off"
              sx={{
                '& .MuiInputBase-input': { color: 'white' },
                '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': { borderColor: '#8884d8' },
                '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#8884d8' },
                '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#8884d8' },
                '& .MuiInputBase-input::placeholder': { color: '#cccccc', opacity: 1 },
                '& .MuiFormHelperText-root': {
                  marginTop: '4px',
                  position: 'absolute',
                  bottom: '-22px',
                  left: '10px',
                  color: '#f44336',
                },
              }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minWidth: '64px', minHeight: '64px' }}>
              {loading ? (
                <CircularProgress sx={{ color: 'white', width: '35px', height: '35px' }} />
              ) : (
                <IconButton
                  onClick={verifyTicker}
                  disabled={!ticker}
                  sx={{ color: 'white', width: '64px', height: '64px' }}
                >
                  <SearchIcon sx={{ fontSize: 35 }} />
                </IconButton>
              )}
            </Box>
          </Box>

          <Box
            sx={{
              maxHeight: showDropdowns ? '500px' : '0',
              opacity: showDropdowns ? 1 : 0,
              transition: 'all 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              overflow: 'hidden',
              marginTop: showDropdowns ? 3 : 0,
            }}
          >
            {showDropdowns && (
              <>
                <FormControl fullWidth margin="normal">
                  <InputLabel sx={{ color: 'white', '&.Mui-focused': { color: 'white' } }}>
                    Select Expiration Date
                  </InputLabel>
                  <Select
                    value={expirationDate}
                    onChange={handleExpirationChange}
                    sx={{
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: '#8884d8' },
                      '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#8884d8' },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#8884d8' },
                      '& .MuiSelect-icon': { color: 'white' },
                      '& .MuiInputBase-input': { color: 'white' },
                    }}
                  >
                    <MenuItem value="2024-01-19">2024-01-19</MenuItem>
                    <MenuItem value="2024-02-16">2024-02-16</MenuItem>
                    <MenuItem value="2024-03-15">2024-03-15</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth margin="normal">
                  <InputLabel sx={{ color: 'white', '&.Mui-focused': { color: 'white' } }}>
                    Select Option Type
                  </InputLabel>
                  <Select
                    value={optionType}
                    onChange={handleOptionTypeChange}
                    sx={{
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: '#8884d8' },
                      '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#8884d8' },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#8884d8' },
                      '& .MuiSelect-icon': { color: 'white' },
                      '& .MuiInputBase-input': { color: 'white' },
                    }}
                  >
                    <MenuItem value="calls">Calls</MenuItem>
                    <MenuItem value="puts">Puts</MenuItem>
                  </Select>
                </FormControl>
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
                  <Button
                    variant="text"
                    onClick={goToPage2}
                    disabled={!expirationDate || !optionType}
                    sx={{
                      color: 'white',
                      '&:hover': {
                        color: '#cccccc',
                      },
                    }}
                  >
                    Enter
                  </Button>
                </Box>
              </>
            )}
          </Box>
        </Box>
      )}

      {currentPage === 2 && (
        <>
          <Button
            onClick={() => setCurrentPage(1)}
            sx={{
              color: 'white',
              '&:hover': {
                color: '#cccccc',
              }
            }}
          >
            ← Back
          </Button>

          <InteractiblePlot S={S} T={T} q={q} r={r} option_type={optionType} />
        </>
      )}
    </div>
  );
}
