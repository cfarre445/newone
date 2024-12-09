import { defineFunction } from '@aws-amplify/backend';

export const processCSV = defineFunction({
  name: 'processCSV',
  entry: './handler.ts', // points to the handler function file
});
