import React from 'react';
import { Card, Empty } from 'antd';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface LineChartProps {
  data: { date: string; count: number }[];
}

export const DomainsLineChart: React.FC<LineChartProps> = ({ data }) => {
  return (
    <Card title="Infection Timeline">
      <div style={{ width: '100%', height: 300 }}>
        {data.length === 0 ? (
          <Empty description="No Data" />
        ) : (
          <ResponsiveContainer>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#82ca9d" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
};