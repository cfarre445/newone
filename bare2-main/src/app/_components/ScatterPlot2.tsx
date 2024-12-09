'use client';
import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';

interface ScatterPlotData2 {
  peptide: string;
  binding_affinity: number;
  reads_with_peptide: number;
}

const ScatterPlot2 = ({ data }: { data: ScatterPlotData2[] }) => {
  const [chartOption, setChartOption] = useState<EChartsOption | null>(null);
  const [minBindingAffinity, setMinBindingAffinity] = useState<number>(0);
  const [maxBindingAffinity, setMaxBindingAffinity] = useState<number>(100);
  const [minReadsWithPeptide, setMinReadsWithPeptide] = useState<number>(0);
  const [maxReadsWithPeptide, setMaxReadsWithPeptide] = useState<number>(100);

  useEffect(() => {
    if (!data || data.length === 0) return;

    const scatterData: [number, number, string][] = data.map(({ peptide, binding_affinity, reads_with_peptide }) => [
      binding_affinity,
      reads_with_peptide,
      peptide,
    ]);

    setMinBindingAffinity(Math.min(...data.map(d => d.binding_affinity)));
    setMaxBindingAffinity(Math.max(...data.map(d => d.binding_affinity)));
    setMinReadsWithPeptide(Math.min(...data.map(d => d.reads_with_peptide)));
    setMaxReadsWithPeptide(Math.max(...data.map(d => d.reads_with_peptide)));

    const option: EChartsOption = {
      title: {
        text: 'Reads with Peptide vs. Binding Affinity',
        left: 'center',
        top: 20,
      },
      tooltip: {
        trigger: 'item',
        formatter: (params) => {
          // Ensure the params is typed and matches the structure of series data
          if ('value' in params && Array.isArray(params.value)) {
            const [x, y, peptide] = params.value as [number, number, string];
            return `Peptide: ${peptide}<br/>Binding Affinity: ${x} nM<br/>Reads with Peptide: ${y} reads`;
          }
          return 'No data available';
        },
      },
      xAxis: {
        type: 'value',
        name: 'Binding Affinity (nM)',
        nameLocation: 'middle',
        nameGap: 22,
        min: minBindingAffinity,
        max: maxBindingAffinity,
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
            },
          },
        },
        {
          type: 'slider',
          yAxisIndex: 0,
          left: '1%',
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
  }, [data, minBindingAffinity, maxBindingAffinity, minReadsWithPeptide, maxReadsWithPeptide]);

  if (!chartOption) return null;

  return <ReactECharts option={chartOption} style={{ height: '400px', width: '100%' }} />;
};

export default ScatterPlot2;
