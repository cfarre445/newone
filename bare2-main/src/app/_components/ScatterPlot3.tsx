'use client';
import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';

interface ScatterPlotData3 {
  peptide: string;
  binding_stability: number;
  reads_with_peptide: number;
}

const ScatterPlot3 = ({ data }: { data: ScatterPlotData3[] }) => {
  const [chartOption, setChartOption] = useState<EChartsOption | null>(null);
  const [minBindingStability, setMinBindingStability] = useState<number>(0);
  const [maxBindingStability, setMaxBindingStability] = useState<number>(100);
  const [minReadsWithPeptide, setMinReadsWithPeptide] = useState<number>(0);
  const [maxReadsWithPeptide, setMaxReadsWithPeptide] = useState<number>(100);

  useEffect(() => {
    if (!data || data.length === 0) return;

    const scatterData: [number, number, string][] = data.map(({ peptide, binding_stability, reads_with_peptide }) => [
      binding_stability,
      reads_with_peptide,
      peptide,
    ]);

    setMinBindingStability(Math.min(...data.map(d => d.binding_stability)));
    setMaxBindingStability(Math.max(...data.map(d => d.binding_stability)));
    setMinReadsWithPeptide(Math.min(...data.map(d => d.reads_with_peptide)));
    setMaxReadsWithPeptide(Math.max(...data.map(d => d.reads_with_peptide)));

    const option: EChartsOption = {
      title: {
        text: 'Reads with Peptide vs. Binding Stability',
        left: 'center',
        top: 20,
      },
      tooltip: {
        trigger: 'item',
        formatter: (params) => {
          // Ensure the params is typed and matches the structure of series data
          if ('value' in params && Array.isArray(params.value)) {
            const [x, y, peptide] = params.value as [number, number, string];
            return `Peptide: ${peptide}<br/>Binding Stability: ${x} hours<br/>Reads with Peptide: ${y}`;
          }
          return 'No data available';
        },
      },
      xAxis: {
        type: 'value',
        name: 'Binding Stability (hours)',
        nameLocation: 'middle',
        nameGap: 22,
        min: minBindingStability,
        max: maxBindingStability,
      },
      yAxis: {
        type: 'value',
        name: 'Reads with Peptide',
        min: minReadsWithPeptide,
        max: maxReadsWithPeptide,
      },
      toolbox: {
        show: true,
        feature: {
          saveAsImage: {
            show: true,
            title: 'Save as Image',
          },
        },
      },
      graphic: [
        {
          type: 'text',
          left: 'left',
          bottom: '5%',
          style: {
            text: 'Zoom sliders',
            fill: '#000',
            font: '14px Arial',
          },
        },
      ],
      dataZoom: [
        {
          type: 'inside',
          xAxisIndex: 0,
          start: 0,
          end: 100,
          zoomOnMouseWheel: true,
          moveOnMouseMove: true,
        },
        {
          type: 'inside',
          yAxisIndex: 0,
          start: 0,
          end: 100,
          zoomOnMouseWheel: true,
          moveOnMouseMove: true,
        },
        {
          type: 'slider',
          xAxisIndex: 0,
          start: 0,
          end: 100,
          zoomOnMouseWheel: true,
          moveOnMouseMove: true,
          dataBackground: {
            lineStyle: {
              width: 50,
            }
          }
        },
        {
          type: 'slider',
          yAxisIndex: 0,
          left: '1%', // Position the y-axis slider on the left-hand side
          start: 0,
          end: 100,
          zoomOnMouseWheel: true,
          moveOnMouseMove: true,
        },
      ],
      series: [
        {
          name: 'Peptides',
          type: 'scatter',
          data: scatterData,
        },
      ],
    };

    setChartOption(option);
  }, [data, minBindingStability, maxBindingStability, minReadsWithPeptide, maxReadsWithPeptide]);

  if (!chartOption) return null;

  return <ReactECharts option={chartOption} style={{ height: '400px', width: '100%' }} />;
};

export default ScatterPlot3;
