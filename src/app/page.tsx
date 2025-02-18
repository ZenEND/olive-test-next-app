"use client";

import React, { useState, useCallback } from 'react';
import { message } from 'antd';
import SearchBar from '../components/SearchBar';
import DomainInfo from '../components/DomainInfo';
import styles from './page.module.css';
import '@ant-design/v5-patch-for-react-19';
import {ErrorResponse, InfectionsSearchResponse, searchInfections} from "@/api/infections";
import { AxiosError } from "axios";

const Home: React.FC = () => {
  const [data, setData] = useState<InfectionsSearchResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [nextToken, setNextToken] = useState<string | undefined>(undefined);

  const handleSearch = useCallback(async (requestBody: Record<string, string | string[] | number>) => {
    try {
      setLoading(true);
      setNextToken(undefined); // reset next so we show "Search" until we see a new token

      const response = await searchInfections(requestBody)
      const result = response.data;
      setData(result);

      // If the result contains "next", store it so we can do "Process next"
      if (result?.next) {
        setNextToken(result.next);
      }

    } catch (error: unknown) {
      if ((error as AxiosError).isAxiosError && (error as AxiosError).response) {
        const errorResponse = (error as AxiosError).response!.data as ErrorResponse;
        let errorMsg = '';

        if (Array.isArray(errorResponse.details)) {
          errorMsg = errorResponse.details.map(detail => `${detail.loc.join(' -> ')}: ${detail.msg}`).join(', ');
        } else {
          errorMsg = errorResponse.details || errorResponse.error_message || 'An unexpected error occurred';
        }

        message.error(`Failed to fetch domain information: ${errorMsg}`);
      } else {
        message.error('Failed to fetch domain information');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const clearNextToken = useCallback(() => {
    setNextToken(undefined);
  }, [setNextToken]);

  return (
    <div className={styles.page}>
      <SearchBar onSearch={handleSearch} clearNextToken={clearNextToken} nextToken={nextToken} loading={loading} />
      <DomainInfo data={data} />
    </div>
  );
};

export default Home;