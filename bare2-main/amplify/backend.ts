import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { csvStorage, fastqStorage } from './storage/resource'
import { processCSV } from './functions/parse-csv/resource';
/**
 * @see https://docs.amplify.aws/react/build-a-backend/ to add storage, functions, and more
 */
defineBackend({
  auth,
  data,
  csvStorage,
  fastqStorage,
  processCSV
});
