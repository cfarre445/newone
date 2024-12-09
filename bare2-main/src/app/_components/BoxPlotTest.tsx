'use client'; // Directive for Next.js to treat this component as a client-side component
import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';

// Function to calculate statistics for a boxplot (min, Q1, median, Q3, max) and identify outliers
const calculateBoxPlotStats = (data: number[]): { stats: number[], outliers: number[] } => {
  if (data.length === 0) return { stats: [0, 0, 0, 0, 0], outliers: [] };
  if (data.length === 1 && data[0] !== undefined) data.push(data[0]); // Duplicate the single data point safely

  const sortedData = data.slice().sort((a, b) => a - b);
  const min = sortedData[0] ?? 0;
  const max = sortedData[sortedData.length - 1] ?? 0;
  const q1 = sortedData[Math.round((sortedData.length - 1) * 0.25)] ?? 0;
  const median = sortedData[Math.round((sortedData.length - 1) * 0.5)] ?? 0;
  const q3 = sortedData[Math.round((sortedData.length - 1) * 0.75)] ?? 0;
  const iqr = q3 - q1;
  const lowerFence = q1 - 1.5 * iqr;
  const upperFence = q3 + 1.5 * iqr;
  const outliers = sortedData.filter(num => num < lowerFence || num > upperFence);
  const stats = [min, q1, median, q3, max];
  return { stats, outliers };
};

// Define an interface for the chart options
interface ChartOption {
  title: { text: string; left: string; top: number };
  tooltip: { trigger: string };
  xAxis: { type: string; name: string; nameLocation: string; nameGap: number; data: string[] };
  yAxis: { type: string; name: string };
  toolbox: { show: boolean; feature: { saveAsImage: { show: boolean; title: string } } };
  dataZoom?: Array<{ type: string; yAxisIndex?: number[]; start?: number; end?: number }>;
  series: Array<{ name: string; type: string; data: number[][]; itemStyle?: { borderColor: string } } | { name: string; type: string; data: number[][] }>;
}

// Functional component to render the boxplot chart
const BoxPlotTest = ({ groupedData }: { groupedData: Record<string, number[]> }) => {
  const [chartOption, setChartOption] = useState<ChartOption | null>(null);

  useEffect(() => {
    if (!groupedData || Object.keys(groupedData).length === 0) return;
    // Extract and clean data, ensuring each group has at least two data points
    const sourceData = Object.keys(groupedData).map(key => {
      const data = groupedData[key] ?? [];
      if (data.length < 2 && data[0] !== undefined) {
        data.push(data[0]); // Add a duplicate value if only one data point exists
      }
      return data.filter(num => !isNaN(num)); // Remove non-numeric values
    });

    const boxData: number[][] = [];
    const outliersData: number[][] = [];

    // Calculate boxplot statistics and identify outliers for each group
    sourceData.forEach((data, index) => {
      const { stats, outliers } = calculateBoxPlotStats(data);
      boxData.push(stats);
      outliers.forEach(outlier => {
        outliersData.push([index, outlier]);
      });
    });

    // Define chart options with dataZoom on yAxis
    const option: ChartOption = {
      title: {
        text: 'Binding Affinity by Antigen Source', // Chart title
        left: 'center', // Center align title
        top: 20, // Adjust this value to move the title lower
      },
      tooltip: {
        trigger: 'item', // Trigger tooltip on item hover
      },
      xAxis: {
        type: 'category',
        name: 'Antigen Source', // Label for x-axis
        nameLocation: 'middle', // Position label underneath the axis
        nameGap: 30, // Adjust this value to move the label lower
        data: Object.keys(groupedData), // Categories based on antigen sources
      },
      yAxis: {
        type: 'value',
        name: 'Binding Affinity', // Label for y-axis
      },
      toolbox: {
        show: true, // Display toolbox
        feature: {
          saveAsImage: {
            show: true, // Enable save as image feature
            title: 'Save as Image', // Title for the save as image button
          }
        }
      },
      series: [
        {
          name: 'boxplot',
          type: 'boxplot',
          data: boxData, // Data for the boxplot
          itemStyle: {
            borderColor: '#111721', // Color for the boxplot border
          },
        },
        {
          name: 'outlier',
          type: 'scatter',
          data: outliersData, // Data for outliers
        },
      ],
    };
    setChartOption(option); // Update chart options
  }, [groupedData]); // Re-run effect when groupedData changes

  if (!chartOption) return null; // Wait for chart option to be set

  return (
    <ReactECharts option={chartOption} style={{ height: '400px', width: '100%' }} />
  );
};

export default BoxPlotTest; // Export the component as default
