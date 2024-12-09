import React, { useState } from 'react';
import * as Papa from 'papaparse';

type Row = {
  binding_affinity: string;
  antigen_source: string;
  peptide: string;
  binding_stability: string;
  reads_with_peptide: string;
};

type ParseTsvProps = {
  onDataParsed: (parsedData: {
    boxPlotData: Record<string, number[]>;
    scatterPlotData1: { peptide: string, binding_affinity: number, binding_stability: number, reads_with_peptide: number, antigen_source: string }[];
    scatterPlotData2: { peptide: string, binding_affinity: number, reads_with_peptide: number }[];
    scatterPlotData3: { peptide: string, binding_stability: number, reads_with_peptide: number }[];
    stabilityBoxPlotData: Record<string, number[]>;
  }) => void;
};

export const ParseTsv = ({ onDataParsed }: ParseTsvProps) => {
  const [fileContent, setFileContent] = useState<string | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target?.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setFileContent(reader.result as string);
      };
      reader.readAsText(file);
    }
  };

  const parseFileContent = () => {
    if (!fileContent) return;

    const parsed = Papa.parse<Row>(fileContent, {
      delimiter: '\t',
      header: true,
      skipEmptyLines: true,
    });

    const data = parsed.data;

    const boxPlotData: Record<string, number[]> = {};
    const stabilityBoxPlotData: Record<string, number[]> = {};
    const scatterPlotData1: { peptide: string, binding_affinity: number, binding_stability: number, reads_with_peptide: number, antigen_source: string }[] = [];
    const scatterPlotData2: { peptide: string, binding_affinity: number, reads_with_peptide: number }[] = [];
    const scatterPlotData3: { peptide: string, binding_stability: number, reads_with_peptide: number }[] = [];

    data.forEach((row) => {
      const { antigen_source, binding_affinity, peptide, binding_stability, reads_with_peptide } = row;
      const readsWithPeptideNum = parseFloat(reads_with_peptide);

      if (antigen_source && binding_affinity) {
        if (!boxPlotData[antigen_source]) {
          boxPlotData[antigen_source] = [];
        }
        boxPlotData[antigen_source].push(parseFloat(binding_affinity));
      }

      if (antigen_source && binding_stability) {
        if (!stabilityBoxPlotData[antigen_source]) {
          stabilityBoxPlotData[antigen_source] = [];
        }
        stabilityBoxPlotData[antigen_source].push(parseFloat(binding_stability));
      }

      if (peptide && binding_affinity && binding_stability && reads_with_peptide) {
        scatterPlotData1.push({
          peptide,
          binding_affinity: parseFloat(binding_affinity),
          binding_stability: parseFloat(binding_stability),
          reads_with_peptide: readsWithPeptideNum,
          antigen_source, // Ensure antigen_source is included
        });
      }

      if (peptide && binding_affinity && reads_with_peptide) {
        scatterPlotData2.push({
          peptide,
          binding_affinity: parseFloat(binding_affinity),
          reads_with_peptide: readsWithPeptideNum,
        });
      }

      if (peptide && binding_stability && reads_with_peptide) {
        scatterPlotData3.push({
          peptide,
          binding_stability: parseFloat(binding_stability),
          reads_with_peptide: readsWithPeptideNum,
        });
      }
    });

    onDataParsed({ boxPlotData, scatterPlotData1, scatterPlotData2, scatterPlotData3, stabilityBoxPlotData });
  };

  return (
    <div>
      <input type="file" accept=".tsv" onChange={handleFileUpload} className="mb-4" />
      <button
        onClick={parseFileContent}
        disabled={!fileContent}
        className={`px-4 py-2 rounded ${
          fileContent
            ? 'bg-blue-500 hover:bg-blue-700 text-white'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        Visualise Output
      </button>
    </div>
  );
};