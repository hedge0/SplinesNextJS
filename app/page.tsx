'use client';

import React, { useState } from 'react';
import InteractiblePlot from "@/components/InteractiblePlot";
import { Button, TextField, MenuItem, Select, InputLabel, FormControl, SelectChangeEvent } from '@mui/material';

export default function Home() {
  const [currentPage, setCurrentPage] = useState<number>(1);

  const [ticker, setTicker] = useState<string>('');
  const [isValidTicker, setIsValidTicker] = useState<boolean>(true);
  const [expirationDate, setExpirationDate] = useState<string>('');
  const [optionType, setOptionType] = useState<string>('calls');
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);

  const S = 566.345;
  const T = 0.015708354371353372;
  const q = 0.0035192;
  const r = 0.0486;

  // Handler functions
  const handleTickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTicker(e.target.value);
  };

  const handleExpirationChange = (event: SelectChangeEvent<string>) => {
    setExpirationDate(event.target.value);
  };

  const handleOptionTypeChange = (event: SelectChangeEvent<string>) => {
    setOptionType(event.target.value);
  };

  // Verify the ticker and navigate to Page 2 if valid
  const goToPage2 = async () => {
    try {
      const response = await fetch(`/api/quotes?ticker=${ticker}`);
      const data = await response.json();
      const price = data?.quote?.regularMarketPrice;

      if (price !== undefined) {
        setCurrentPrice(price);
        setIsValidTicker(true);
        setCurrentPage(2);  // Navigate to Page 2 only if the ticker is valid
      } else {
        setIsValidTicker(false);  // Show error if ticker is invalid
      }
    } catch (error) {
      setIsValidTicker(false);  // Handle error in fetching ticker
      console.error(`Error fetching price for ${ticker}:`, error);
    }
  };

  const goToPage3 = () => setCurrentPage(3);
  const goToPage1 = () => {
    setCurrentPage(1);
    setExpirationDate('');
    setOptionType('calls');
    setCurrentPrice(null);
  };
  const goBackToPage2 = () => setCurrentPage(2);
  const goBackToPage1 = () => setCurrentPage(1);

  return (
    <div className="flex flex-col items-center justify-start min-h-[95vh] py-4 mt-10">
      {currentPage === 1 && (
        <>
          <h1>Enter Ticker</h1>
          <TextField
            label="Ticker"
            variant="outlined"
            value={ticker}
            onChange={handleTickerChange}
            error={!isValidTicker}
            helperText={!isValidTicker ? "Invalid ticker" : ""}
          />
          <Button variant="contained" color="primary" onClick={goToPage2} disabled={!ticker}>
            Search
          </Button>
        </>
      )}

      {currentPage === 2 && (
        <>
          <Button onClick={goBackToPage1}>← Back</Button>
          <h1>Select Expiration Date and Option Type</h1>
          <FormControl fullWidth margin="normal">
            <InputLabel>Select Expiration Date</InputLabel>
            <Select value={expirationDate} onChange={handleExpirationChange}>
              <MenuItem value="2024-01-19">2024-01-19</MenuItem>
              <MenuItem value="2024-02-16">2024-02-16</MenuItem>
              <MenuItem value="2024-03-15">2024-03-15</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Select Option Type</InputLabel>
            <Select value={optionType} onChange={handleOptionTypeChange}>
              <MenuItem value="calls">Calls</MenuItem>
              <MenuItem value="puts">Puts</MenuItem>
            </Select>
          </FormControl>
          <Button variant="contained" color="primary" onClick={goToPage3} disabled={!expirationDate || !optionType}>
            Enter
          </Button>
        </>
      )}

      {currentPage === 3 && (
        <>
          <Button onClick={goBackToPage2}>← Back</Button>
          <InteractiblePlot S={S} T={T} q={q} r={r} option_type={optionType} />
        </>
      )}
    </div>
  );
}
