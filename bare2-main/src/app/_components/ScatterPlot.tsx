'use client';
import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';

interface ScatterPlotData {
  peptide: string;
  binding_affinity: number;
  binding_stability: number;
}

const ScatterPlot = ({ data }: { data: ScatterPlotData[] }) => {
  const [chartOption, setChartOption] = useState<EChartsOption | null>(null);
  const [minBindingAffinity, setMinBindingAffinity] = useState<number>(0);
  const [maxBindingAffinity, setMaxBindingAffinity] = useState<number>(100);
  const [minBindingStability, setMinBindingStability] = useState<number>(0);
  const [maxBindingStability, setMaxBindingStability] = useState<number>(100);

  useEffect(() => {
    if (!data || data.length === 0) return;

    const scatterData: [number, number, string][] = data.map(({ peptide, binding_affinity, binding_stability }) => [
      binding_affinity,
      binding_stability,
      peptide,
    ]);

    setMinBindingAffinity(Math.min(...data.map(d => d.binding_affinity)));
    setMaxBindingAffinity(Math.max(...data.map(d => d.binding_affinity)));
    setMinBindingStability(Math.min(...data.map(d => d.binding_stability)));
    setMaxBindingStability(Math.max(...data.map(d => d.binding_stability)));

    const option: EChartsOption = {
      title: {
        text: 'Binding Stability vs. Binding Affinity',
        left: 'center',
        top: 20,
      },
      tooltip: {
        trigger: 'item',
        formatter: (params) => {
          if ('value' in params && Array.isArray(params.value)) {
            const [x, y, peptide] = params.value as [number, number, string];
            return `Peptide: ${peptide}<br/>Binding Affinity: ${x} nM<br/>Binding Stability: ${y} hours`;
          }
          return 'No data available';
        },
      },
      xAxis: {
        type: 'value',
        name: 'Binding Affinity (nM)',
        nameLocation: 'middle',
        nameGap: 10,
        min: minBindingAffinity,
        max: maxBindingAffinity,
      },
      yAxis: {
        type: 'value',
        name: 'Binding Stability (hours)',
        min: minBindingStability,
        max: maxBindingStability,
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
  }, [data, minBindingAffinity, maxBindingAffinity, minBindingStability, maxBindingStability]);

  if (!chartOption) return null;

  return <ReactECharts option={chartOption} style={{ height: '400px', width: '100%' }} />;
};

export default ScatterPlot;
