import React from 'react';
import { Card, Empty } from 'antd';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface PieChartProps {
  data: { name: string; value: number }[];
  colors: string[];
}

export const DomainsPieChart: React.FC<PieChartProps> = ({ data, colors }) => {
  return (
    <Card title="Stealer Type Distribution">
      <div style={{ width: '100%', height: 300 }}>
        {data.length === 0 ? (
          <Empty description="No Data" />
        ) : (
          <ResponsiveContainer>
            <PieChart>
              <Pie data={data} dataKey="value" nameKey="name" outerRadius={100} fill="#8884d8" label>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
};