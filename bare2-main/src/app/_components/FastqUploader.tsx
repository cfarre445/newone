'use client'
import React from 'react';
import { FileUploader } from '@aws-amplify/ui-react-storage';
import '@aws-amplify/ui-react/styles.css';

const FileUploaderFastq = () => {
  const newFolders = 'new_folder'
  return (
    <FileUploader
      acceptedFileTypes={['.gz']}
      path={({ identityId }) => `fastqs/${identityId}/${newFolders}/`}
      maxFileCount={4}
      isResumable
      autoUpload={false}
    />
  );
};
  
export default FileUploaderFastq;
