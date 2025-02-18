import React, {useEffect, useState} from 'react';
import { Button, Card, Col, DatePicker, Form, Input, Row, Select } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import styles from './styles.module.css';

/**
 * Helper to convert a Dayjs date to the exact format: yyyy-MM-dd'T'HH:mm:ss'Z'
 */
function formatToApiDate(value: Dayjs) {
  return dayjs(value).format("YYYY-MM-DDTHH:mm:ss[Z]");
}

// List of available search fields
const SEARCH_FIELDS = [
  { label: 'Emails', value: 'emails' },
  { label: 'Domains', value: 'domains' },
  { label: 'Root Domains', value: 'root_domains' },
  { label: 'App Domains', value: 'app_domains' },
  { label: 'Email Domains', value: 'email_domains' },
  { label: 'IPs', value: 'ips' },
  { label: 'Country', value: 'country' },
  { label: 'HWID', value: 'hwid' },
  { label: 'User Name', value: 'user_name' },
  { label: 'Stealer Type', value: 'stealer_type' },
  { label: 'Infection Date From', value: 'infection_date_from' },
  { label: 'Infection Date To', value: 'infection_date_to' },
  { label: 'Created Date From', value: 'created_date_from' },
  { label: 'Created Date To', value: 'created_date_to' },
];

// Fields that should use a DatePicker instead of a text input
const DATE_FIELDS = [
  'infection_date_from',
  'infection_date_to',
  'created_date_from',
  'created_date_to',
];

interface Filter {
  field: string;
  value: string;
}

interface SearchBarProps {
  onSearch: (requestBody: Record<string, string | string[] | number>) => void;
  nextToken?: string;
  loading?: boolean;
  clearNextToken: () => void
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, nextToken, clearNextToken, loading }) => {
  const [filters, setFilters] = useState<Filter[]>([{ field: 'domains', value: '' }]);
  const [processSize, setProcessSize] = useState<number>(10);

  useEffect(() => {
    clearNextToken()
  }, [clearNextToken, filters]);

  // Adds a new empty filter row
  const handleAddFilter = () => {
    setFilters((prev) => [...prev, { field: '', value: '' }]);
  };

  // Removes a filter row by index
  const handleRemoveFilter = (index: number) => {
    setFilters((prev) => prev.filter((_, i) => i !== index));
  };

  // Updates a specific filter’s field or value
  const handleFilterChange = (index: number, key: 'field' | 'value', val: string) => {
    setFilters((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [key]: val };
      return copy;
    });
  };

  // Decide if a field is a date field
  const isDateField = (field: string) => DATE_FIELDS.includes(field);

  // Renders the filter-value input or date picker
  const renderFilterValueInput = (filter: Filter, index: number) => {
    if (isDateField(filter.field)) {
      const currentVal = filter.value ? dayjs(filter.value) : null;
      return (
        <DatePicker
          style={{ width: '100%' }}
          showTime
          value={currentVal}
          onChange={(date) => {
            const formatted = date ? formatToApiDate(date) : '';
            handleFilterChange(index, 'value', formatted);
          }}
        />
      );
    }
    return (
      <Input
        style={{ width: '100%' }}
        value={filter.value}
        onChange={(e) => handleFilterChange(index, 'value', e.target.value)}
      />
    );
  };

  // Build the request payload from the user-selected filters
  const buildRequestBody = (withNext: boolean): Record<string, string | string[] | number> => {
    const requestBody: Record<string, string | string[] | number> = {};

    // Always include the user-defined size
    requestBody.size = processSize;

    // If we want to "Process next" and have a nextToken
    if (withNext && nextToken) {
      requestBody.next = nextToken;
    }

    // For each filter row, add to the request
    const arrayFields = [
      'emails',
      'domains',
      'root_domains',
      'app_domains',
      'email_domains',
      'ips',
    ];

    filters.forEach((f) => {
      if (!f.field) return;
      if (arrayFields.includes(f.field)) {
        if (!requestBody[f.field]) {
          requestBody[f.field] = [];
        }
        (requestBody[f.field] as string[]).push(f.value);
      } else {
        requestBody[f.field] = f.value;
      }
    });

    return requestBody;
  };

  // Called when user clicks button (Search or Process next)
  const handleSearch = () => {
    const isProcessNext = !!nextToken;
    const requestBody = buildRequestBody(isProcessNext);
    onSearch(requestBody);
  };

  return (
    <Row className={styles.container}>
      <Card className={styles.card}>
        <Form layout="vertical">
          <Row gutter={[16, 16]}>
            {/* Process size */}
            <Col xs={24} md={6}>
              <Form.Item label="Process size">
                <Input
                  type="number"
                  min={1}
                  value={processSize}
                  onChange={(e) => setProcessSize(parseInt(e.target.value, 10) || 1)}
                />
              </Form.Item>
            </Col>

            {/* Add Filter Button (positioned on the right on bigger screens) */}
            <Col xs={24} md={6}>
              <Form.Item label=" ">
                <Button onClick={handleAddFilter} block>
                  + Add Filter
                </Button>
              </Form.Item>
            </Col>

            {/* Search / Process next button */}
            <Col xs={24} md={6}>
              <Form.Item label=" ">
                <Button
                  type="primary"
                  onClick={handleSearch}
                  block
                  disabled={loading === true}
                >
                  {nextToken ? 'Process next' : 'Search'}
                </Button>
              </Form.Item>
            </Col>
          </Row>

          {/* Dynamic Filters */}
          {filters.map((filter, index) => (
            <Row key={index} gutter={[16, 16]} align="middle">
              <Col xs={24} md={5}>
                <Form.Item label="Search by">
                  <Select
                    style={{ width: '100%' }}
                    placeholder="Select a field"
                    value={filter.field}
                    onChange={(val) => handleFilterChange(index, 'field', val)}
                    disabled={filter.field === 'domains'}
                  >
                    {SEARCH_FIELDS.map((field) => (
                      <Select.Option key={field.value} value={field.value}>
                        {field.label}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} md={5}>
                <Form.Item label="Value">
                  {renderFilterValueInput(filter, index)}
                </Form.Item>
              </Col>
              <Col xs={24} md={2}>
                <Form.Item label=" ">
                  <Button
                    danger
                    onClick={() => handleRemoveFilter(index)}
                    block
                    disabled={filter.field === 'domains'}
                  >
                    Remove
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          ))}
        </Form>
      </Card>
    </Row>
  );
};

export default SearchBar;