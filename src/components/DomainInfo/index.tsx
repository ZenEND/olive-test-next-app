import React from 'react';
import { Table, Card, Grid, Tooltip, Row, Col, Typography } from 'antd';
import { DomainsPieChart } from '@/components/DomainsPieChart';
import { DomainsLineChart } from '@/components/DomainsLineChart';
import styles from './styles.module.css';
import { InfectionLog } from "@/interfaces/InfectionLog";

const { useBreakpoint } = Grid;
const { Text } = Typography;

interface DomainInfoProps {
  data: {
    data: InfectionLog[];
    credits_left: number;
    items_count: number;
    next: string;
    search_consumed_credits: number;
    search_id: string;
    total_items_count: number;
  } | null;
}

const DomainInfo: React.FC<DomainInfoProps> = ({ data }) => {
  const screens = useBreakpoint();

  // Map data for the table
  const dataSource = data?.data?.map((item) => ({
    key: item.id,
    log_file_name: item.log_file_name,
    stealer_type: item.stealer_type,
    infection_date: new Date(item.computer_information.infection_date).toLocaleString(),
    ip: item.computer_information.ip,
    country: item.computer_information.country,
    os: item.computer_information.os,
    malware_path: item.computer_information.malware_path,
    username: item.computer_information.username,
    hwid: item.computer_information.hwid,
  }));

  // Pie Chart: Stealer Type Distribution
  const stealerTypeCounts = data?.data?.reduce((acc, item) => {
    const type = item.stealer_type || 'Unknown';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieChartData = stealerTypeCounts ? Object.keys(stealerTypeCounts).map((type) => ({
    name: type,
    value: stealerTypeCounts[type],
  })) : [];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AA336A'];

  // Line Chart: Infection count by date
  const infectionDateCounts = data?.data?.reduce((acc, item) => {
    const dateStr = new Date(item.computer_information.infection_date).toLocaleDateString();
    acc[dateStr] = (acc[dateStr] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const lineChartData = infectionDateCounts ? Object.keys(infectionDateCounts).map((date) => ({
    date,
    count: infectionDateCounts[date],
  })) : [];

  const isSmallScreen = !screens.md;

  return (
    <Row className={styles.container} gutter={[20, 20]}>
      <Col span={24}>
        <Text strong>Total Items: {data?.total_items_count || 0}</Text>
      </Col>
      <Col span={24}>
        {isSmallScreen ? (
          <Table
            dataSource={dataSource}
            className={styles.table}
            pagination={false}
            columns={[{ title: 'Log File', dataIndex: 'log_file_name', key: 'log_file_name', ellipsis: true }]}
            scroll={{ x: 'max-content' }}
            expandable={{ expandedRowRender: (record) => (
                <Card size="small">
                  <p><strong>Stealer Type:</strong> {record.stealer_type}</p>
                  <p><strong>Infection Date:</strong> {new Date(record.infection_date).toLocaleString()}</p>
                  <p><strong>IP:</strong> {record.ip}</p>
                  <p><strong>Country:</strong> {record.country}</p>
                  <p><strong>OS:</strong> {record.os}</p>
                  <p><strong>Malware Path:</strong> {record.malware_path}</p>
                  <p><strong>Username:</strong> {record.username}</p>
                  <p><strong>HWID:</strong> {record.hwid}</p>
                </Card>
              )}}
          />
        ) : (
          <Table
            dataSource={dataSource}
            columns={[
              { title: 'Log File', dataIndex: 'log_file_name', key: 'log_file_name', width: 160, ellipsis: true },
              { title: 'Stealer Type', dataIndex: 'stealer_type', key: 'stealer_type', width: 130, ellipsis: true },
              { title: 'Infection Date', dataIndex: 'infection_date', key: 'infection_date', width: 180, ellipsis: true, render: (text) => new Date(text).toLocaleString() },
              { title: 'IP', dataIndex: 'ip', key: 'ip', width: 140, ellipsis: true },
              { title: 'Country', dataIndex: 'country', key: 'country', width: 130, ellipsis: true },
              { title: 'OS', dataIndex: 'os', key: 'os', width: 130, ellipsis: true },
              { title: 'Malware Path', dataIndex: 'malware_path', key: 'malware_path', width: 200, ellipsis: true, render: (text) => <Tooltip title={text}>{text}</Tooltip> },
              { title: 'Username', dataIndex: 'username', key: 'username', width: 140, ellipsis: true },
              { title: 'HWID', dataIndex: 'hwid', key: 'hwid', width: 200, ellipsis: true },
            ]}
            scroll={{ x: 'max-content' }}
            pagination={false}
            className={styles.table}
          />
        )}
      </Col>
      <Col xs={24} md={12}>
        <DomainsPieChart data={pieChartData} colors={COLORS} />
      </Col>
      <Col xs={24} md={12}>
        <DomainsLineChart data={lineChartData} />
      </Col>
    </Row>
  );
};

export default DomainInfo;