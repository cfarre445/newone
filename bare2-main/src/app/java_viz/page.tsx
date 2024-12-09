'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ParseTsv } from '../_components/ParseTsv';
import BoxPlotTest from '../_components/BoxPlotTest';
import BoxPlotStability from '../_components/BoxPlotStability';
import ScatterPlot from '../_components/ScatterPlot';
import ScatterPlot2 from '../_components/ScatterPlot2';
import ScatterPlot3 from '../_components/ScatterPlot3';
import { saveAs } from 'file-saver';
import Slider from '@mui/material/Slider';

interface ScatterPlotData {
  peptide: string;
  binding_affinity: number;
  binding_stability: number;
  reads_with_peptide: number;
  antigen_source: string;
}

const downloadTSV = (data: ScatterPlotData[], filename: string) => {
  const header = 'Peptide\tBinding Affinity\tBinding Stability\tReads with Peptide\n';
  const rows = data.map(({ peptide, binding_affinity, binding_stability, reads_with_peptide }) =>
    `${peptide}\t${binding_affinity}\t${binding_stability}\t${reads_with_peptide}`
  ).join('\n');
  const tsvContent = header + rows;
  const blob = new Blob([tsvContent], { type: 'text/tab-separated-values;charset=utf-8;' });
  saveAs(blob, filename);
};

const groupDataByAntigenSource = (
  data: ScatterPlotData[],
  bindingAffinityRange: [number, number],
  bindingStabilityRange: [number, number],
  readsThreshold: number
) => {
  const groupedByAffinity = data.reduce((acc, curr) => {
    const { antigen_source, binding_affinity, reads_with_peptide } = curr;
    if (
      binding_affinity >= bindingAffinityRange[0] &&
      binding_affinity <= bindingAffinityRange[1] &&
      reads_with_peptide >= readsThreshold
    ) {
      if (!acc[antigen_source]) {
        acc[antigen_source] = [];
      }
      acc[antigen_source].push(binding_affinity);
    }
    return acc;
  }, {} as Record<string, number[]>);

  const groupedByStability = data.reduce((acc, curr) => {
    const { antigen_source, binding_stability, reads_with_peptide } = curr;
    if (
      binding_stability >= bindingStabilityRange[0] &&
      binding_stability <= bindingStabilityRange[1] &&
      reads_with_peptide >= readsThreshold
    ) {
      if (!acc[antigen_source]) {
        acc[antigen_source] = [];
      }
      acc[antigen_source].push(binding_stability);
    }
    return acc;
  }, {} as Record<string, number[]>);

  return { groupedByAffinity, groupedByStability };
};

const throttle = <T extends unknown[]>(
  callback: (...args: T) => void,
  delay: number,
) => {
  let lastCall = 0;
  return (...args: T) => {
    const now = new Date().getTime();
    if (now - lastCall < delay) {
      return;
    }
    lastCall = now;
    return callback(...args);
  };
};

const JavaVizPage = () => {
  const [parsedData, setParsedData] = useState<{
    boxPlotData: Record<string, number[]> | null;
    scatterPlotData1: ScatterPlotData[];
    scatterPlotData2: { peptide: string; binding_affinity: number; reads_with_peptide: number }[];
    scatterPlotData3: { peptide: string; binding_stability: number; reads_with_peptide: number }[];
    stabilityBoxPlotData: Record<string, number[]> | null;
  }>({
    boxPlotData: null,
    scatterPlotData1: [],
    scatterPlotData2: [],
    scatterPlotData3: [],
    stabilityBoxPlotData: null,
  });

  const [readsThreshold, setReadsThreshold] = useState(0);
  const [bindingAffinityRange, setBindingAffinityRange] = useState<[number, number]>([0, 100]);
  const [bindingStabilityRange, setBindingStabilityRange] = useState<[number, number]>([0, 100]);
  const [filteredScatterPlotData1, setFilteredScatterPlotData1] = useState<ScatterPlotData[]>([]);
  const [groupedByAffinity, setGroupedByAffinity] = useState<Record<string, number[]>>({});
  const [groupedByStability, setGroupedByStability] = useState<Record<string, number[]>>({});
  const [warning, setWarning] = useState<string>('');

  const maxBindingStability = Math.max(
    ...(parsedData.scatterPlotData3.map(d => d.binding_stability).filter(d => !isNaN(d)) ?? [0])
  );

  const maxReadsWithPeptide = Math.max(...(parsedData.scatterPlotData1.map(d => d.reads_with_peptide).filter(d => !isNaN(d)) ?? [0]));

  useEffect(() => {
    setBindingAffinityRange([0, Math.max(...(parsedData.scatterPlotData1.map(d => d.binding_affinity) ?? [100]))]);
    setBindingStabilityRange([0, maxBindingStability]);
  }, [parsedData.scatterPlotData1, maxReadsWithPeptide, maxBindingStability]);

  const updateData = useCallback(() => {
    const filteredData = parsedData.scatterPlotData1.filter((d) => d.reads_with_peptide >= readsThreshold);
    setFilteredScatterPlotData1(filteredData);
    const { groupedByAffinity, groupedByStability } = groupDataByAntigenSource(filteredData, bindingAffinityRange, bindingStabilityRange, readsThreshold);
    setGroupedByAffinity(groupedByAffinity);
    setGroupedByStability(groupedByStability);
  }, [parsedData, readsThreshold, bindingAffinityRange, bindingStabilityRange]);

  useEffect(() => {
    updateData();
  }, [updateData]);

  const throttledRender = useCallback(throttle(updateData, 300), [
    readsThreshold,
    bindingAffinityRange,
    bindingStabilityRange,
    parsedData.scatterPlotData1,
  ]);

  const handleBindingStabilityRangeChange = (newValue: [number, number]) => {
    setBindingStabilityRange(newValue);
    throttledRender();
  };

  const handleReadsThresholdChange = (value: number) => {
    setReadsThreshold(value);
    throttledRender();
    if (value > maxReadsWithPeptide) {
      setWarning(`The entered value exceeds the maximum reads_with_peptide value of ${maxReadsWithPeptide}`);
    } else {
      setWarning('');
    }
  };

  const handleBindingAffinityRangeChange = (value: [number, number]) => {
    setBindingAffinityRange(value);
    throttledRender();
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <header className="flex justify-center items-center p-6">
        <h1 className="text-5xl font-extrabold">Java Visualization</h1>
      </header>
      <main className="flex-grow flex flex-col items-center justify-center p-8 space-y-6">
        <div className="w-full max-w-4xl bg-gray-100 p-4 rounded-lg shadow-lg text-black">
          <ParseTsv onDataParsed={setParsedData} />
        </div>

        {(parsedData.boxPlotData && Object.keys(parsedData.boxPlotData).length > 0) || parsedData.scatterPlotData1.length > 0 || parsedData.scatterPlotData2.length > 0 || parsedData.scatterPlotData3.length > 0 ? (
          <>
            <div id="boxplot1" className="bg-white w-full max-w-4xl h-[600px] p-4 rounded-lg shadow-lg flex flex-col items-center justify-center">
              <BoxPlotTest groupedData={groupedByAffinity} />
              <div className="w-full bg-gray-100 rounded-lg shadow-lg text-black mt-4">
                <label htmlFor="readsThresholdBoxPlot1" className="block text-sm font-medium text-gray-700">
                  Reads with Peptide Threshold
                </label>
                <input
                  type="number"
                  id="readsThresholdBoxPlot1"
                  value={readsThreshold}
                  onChange={(e) => handleReadsThresholdChange(parseInt(e.target.value))}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                <Slider
                  value={readsThreshold}
                  onChange={(e, newValue) => handleReadsThresholdChange(newValue as number)}
                  aria-labelledby="discrete-slider-boxplot1"
                  valueLabelDisplay="auto"
                  step={1}
                  marks
                  min={0}
                  max={maxReadsWithPeptide}
                />
              </div>
              {/* Binding Affinity Range Filter */}
              <div className="w-full bg-gray-100 rounded-lg shadow-lg text-black mt-4">
                <label htmlFor="bindingAffinityRange" className="block text-sm font-medium text-gray-700">
                  Binding Affinity Range
                </label>
                <Slider
                  value={bindingAffinityRange}
                  onChange={(e, newValue) => handleBindingAffinityRangeChange(newValue as [number, number])}
                  aria-labelledby="range-slider-binding-affinity"
                  valueLabelDisplay="auto"
                  step={1}
                  marks
                  min={0}
                  max={Math.max(...(parsedData.scatterPlotData1.map(d => d.binding_affinity) ?? [0]))}
                />
              </div>
            </div>
            {/* Boxplot for Binding Stability */}
            <div id="stabilityBoxPlot" className="bg-white w-full max-w-4xl h-auto p-4 rounded-lg shadow-lg flex flex-col items-center justify-center">
              <BoxPlotStability groupedData={groupedByStability} /> {/* BoxPlotStability component with filtered data as a prop */}
              
              {/* Reads with Peptide Threshold Filter */}
              <div className="w-full bg-gray-100 rounded-lg shadow-lg text-black mt-4">
                <label htmlFor="readsThresholdBoxPlot2" className="block text-sm font-medium text-gray-700">
                  Reads with Peptide Threshold
                </label>
                <input
                  type="number"
                  id="readsThresholdBoxPlot2"
                  value={readsThreshold}
                  onChange={(e) => handleReadsThresholdChange(parseInt(e.target.value))}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                {warning && <p className="text-red-500 text-sm">{warning}</p>}
                <Slider
                  value={readsThreshold}
                  onChange={(e, newValue) => handleReadsThresholdChange(newValue as number)}
                  aria-labelledby="discrete-slider-boxplot2"
                  valueLabelDisplay="auto"
                  step={1}
                  marks
                  min={0}
                  max={maxReadsWithPeptide}
                />
              </div>
              {/* Binding Stability Range Filter */}
              <div className="w-full bg-gray-100 rounded-lg shadow-lg text-black mt-4">
                <label htmlFor="bindingStabilityRange" className="block text-sm font-medium text-gray-700">
                  Binding Stability Range
                </label>
                <Slider
                  value={bindingStabilityRange}
                  onChange={(e, newValue) => handleBindingStabilityRangeChange(newValue as [number, number])}
                  aria-labelledby="range-slider-binding-stability"
                  valueLabelDisplay="auto"
                  step={0.1}
                  marks
                  min={0}
                  max={maxBindingStability}
                />
              </div>
            </div>
            {/* Scatter plot 1 */}
            <div className="bg-white w-full max-w-4xl p-4 rounded-lg shadow-lg flex flex-col items-center justify-center" style={{ marginBottom: 0 }}>
              <ScatterPlot data={filteredScatterPlotData1} /> {/* ScatterPlot component with data as a prop */}
              {/* Filter control */}
              <div className="w-full bg-gray-100 rounded-lg shadow-lg text-black mt-4">
                <label htmlFor="readsThresholdScatter" className="block text-sm font-medium text-gray-700">
                  Reads with Peptide Threshold
                </label>
                <input
                  type="number"
                  id="readsThresholdScatter"
                  value={readsThreshold}
                  onChange={(e) => handleReadsThresholdChange(parseInt(e.target.value))}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                {warning && <p className="text-red-500 text-sm">{warning}</p>}
                <Slider
                  value={readsThreshold}
                  onChange={(e, newValue) => handleReadsThresholdChange(newValue as number)}
                  aria-labelledby="discrete-slider-scatter"
                  valueLabelDisplay="auto"
                  step={1}
                  marks
                  min={0}
                  max={maxReadsWithPeptide}
                />
              </div>
            </div>
            {/* Scatter plot 2 */}
            <div className="bg-white w-full max-w-4xl h-97 p-4 rounded-lg shadow-lg flex items-center justify-center">
              <ScatterPlot2 data={parsedData.scatterPlotData2} /> {/* ScatterPlot2 component with data as a prop */}
            </div>
            {/* Scatter plot 3 */}
            <div className="bg-white w-full max-w-4xl h-99 p-4 rounded-lg shadow-lg flex items-center justify-center">
              <ScatterPlot3 data={parsedData.scatterPlotData3} /> {/* ScatterPlot3 component with data as a prop */}
            </div>
            {/* Download button */}
            <div className="w-full max-w-4xl flex justify-end">
              <button
                onClick={() => downloadTSV(parsedData.scatterPlotData1, 'scatter_plot_data.tsv')}
                className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Download Scatter Plot Data as TSV
              </button>
            </div>
          </>
        ) : (
          // Message to show if no data is uploaded
          <p className="text-xl font-semibold">Upload a TSV file to see visualizations.</p>
        )}
      </main>
    </div>
  );
};

export default JavaVizPage; // Export the JavaVizPage component as the default export
