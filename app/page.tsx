'use client';

import React, { useState, useEffect } from 'react';
import InteractiblePlot from "@/components/InteractiblePlot";
import { Button, TextField, MenuItem, Select, InputLabel, FormControl, SelectChangeEvent, Box, IconButton, CircularProgress } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { DateTime } from 'luxon';

/**
 * Home component that allows users to enter a ticker, select an expiration date and option type,
 * and view an interactive implied volatility plot for the selected options.
 * 
 * @returns {JSX.Element} The Home component with a form for user input and chart display.
 */
export default function Home() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [ticker, setTicker] = useState<string>('');
  const [isValidTicker, setIsValidTicker] = useState<boolean>(true);
  const [showDropdowns, setShowDropdowns] = useState<boolean>(false);
  const [expirationDate, setExpirationDate] = useState<string>('');
  const [optionType, setOptionType] = useState<string>('calls');
  const [loading, setLoading] = useState<boolean>(false);
  const [expirationDates, setExpirationDates] = useState<string[]>([]);

  const [r, setr] = useState<number>(0.0);
  const [S, setS] = useState<number>(0.0);
  const [q, setQ] = useState<number>(0.0);
  const [quoteData, setQuoteData] = useState<any>({});
  const [T, setT] = useState<number>(0.0);
  const [loadingPage2, setLoadingPage2] = useState<boolean>(false);

  const fullText = 'Enter Ticker  ';
  const [displayedText, setDisplayedText] = useState('');
  const [isFullTextDisplayed, setIsFullTextDisplayed] = useState(false);

  useEffect(() => {
    let index = 0;
    const typingSpeed = 100;

    /**
     * Fetches SOFR data and sets the risk-free rate (r).
     */
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

  /**
   * Handles changes to the ticker input field.
   * 
   * @param {React.ChangeEvent<HTMLInputElement>} e - The input event.
   */
  const handleTickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTicker(e.target.value);
    setShowDropdowns(false);
  };

  /**
   * Handles changes to the selected expiration date.
   * 
   * @param {SelectChangeEvent<string>} event - The select change event.
   */
  const handleExpirationChange = (event: SelectChangeEvent<string>) => {
    setExpirationDate(event.target.value);
  };

  /**
   * Handles changes to the selected option type (calls or puts).
   * 
   * @param {SelectChangeEvent<string>} event - The select change event.
   */
  const handleOptionTypeChange = (event: SelectChangeEvent<string>) => {
    setOptionType(event.target.value);
  };

  /**
   * Verifies the validity of the entered ticker by fetching market data.
   */
  const verifyTicker = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/quotes?ticker=${ticker}`);
      const data = await response.json();

      const price = data?.marketPrice;
      const dividendYield = data?.dividendYield;

      if (price !== undefined) {
        setS(price);
        setQ(dividendYield || 0.0);
        setIsValidTicker(true);
        setShowDropdowns(true);

        const optionsResponse = await fetch(`/api/options?ticker=${ticker}`);
        const optionsData = await optionsResponse.json();
        const { expirationDates } = optionsData;

        if (expirationDates.length > 0) {
          setExpirationDates(expirationDates);
          setExpirationDate(expirationDates[0]);
        }
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

  /**
   * Calculates the time to expiration (T) in years based on the selected expiration date.
   * 
   * @param {string} expirationDate - The selected expiration date.
   */
  const calculateT = (expirationDate: string) => {
    const estZone = 'America/New_York';
    const currentTime = DateTime.now().setZone(estZone);

    const expirationTime = DateTime.fromISO(expirationDate, { zone: estZone }).set({
      hour: 16,
      minute: 0,
      second: 0,
    });

    const secondsToExpiration = expirationTime.diff(currentTime, 'seconds').seconds;
    const timeToExpiration = secondsToExpiration / (365 * 24 * 3600);

    setT(timeToExpiration);
  };

  /**
   * Fetches options prices based on the selected ticker and option type, then proceeds to page 2.
   */
  const goToPage2 = async () => {
    setLoadingPage2(true);
    try {
      const response = await fetch(`/api/options-prices?ticker=${ticker}&expirationDate=${expirationDate}&optionType=${optionType}`);
      const data = await response.json();

      calculateT(expirationDate);

      const parsedQuoteData: any = {};
      data.options.forEach((option: any) => {
        const { strike, bid, ask } = option;
        const mid = (bid + ask) / 2;
        parsedQuoteData[strike] = [bid, ask, mid];
      });

      setQuoteData(parsedQuoteData);
    } catch (error) {
      console.error("Error fetching options prices:", error);
    }
    setLoadingPage2(false);
    setCurrentPage(2);
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
                    {expirationDates.map((date) => (
                      <MenuItem key={date} value={date}>{date}</MenuItem>
                    ))}
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
                  {loadingPage2 ? (
                    <CircularProgress sx={{ color: 'white', width: '35px', height: '35px' }} />
                  ) : (
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
                  )}
                </Box>
              </>
            )}
          </Box>
        </Box>
      )}
      {currentPage === 2 && (
        <>
          <Button
            onClick={() => {
              setShowDropdowns(false);
              setCurrentPage(1);
              setExpirationDate('');
              setOptionType('calls');
            }}
            sx={{
              color: 'white',
              '&:hover': {
                color: '#cccccc',
              }
            }}
          >
            ← Back
          </Button>
          <InteractiblePlot
            S={S}
            T={T}
            q={q}
            r={r}
            option_type={optionType}
            expirationDate={expirationDate}
            ticker={ticker}
            quoteData={quoteData}
          />
        </>
      )}
    </div>
  );
}
