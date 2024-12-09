'use client'
import React from 'react';
import { FileUploader } from '@aws-amplify/ui-react-storage';
import '@aws-amplify/ui-react/styles.css';

const FileUploaderCSV = () => {
  return (
    <FileUploader
      acceptedFileTypes={['.csv','.tsv']}
      path={({ identityId }) => `csvs/${identityId}/`}
      maxFileCount={1}
      isResumable
      autoUpload={false}
    />
  );
};

export default FileUploaderCSV;