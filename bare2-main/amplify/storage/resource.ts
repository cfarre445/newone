import { defineStorage } from "@aws-amplify/backend";

export const csvStorage = defineStorage({
  name: "lensCsvs",
  isDefault: true,
  access: (allow) => ({
    // the commented code will be used after testing to restrict S3 folders 
    // to admins and owners only. Admin group must be set up first.
    // "csvs"/{entity_id}/*:[
    // allow.entity('identity').to(['write'],
    // allow.groups(['admin']).to(['read', 'write', 'delete']) 
    "csvs/*": [allow.authenticated.to(["read", "write", "delete"])],
    "fastqs/*": [allow.authenticated.to(["read", "write", "delete"])]
  }),
});

export const fastqStorage = defineStorage({
  name: "lensFastqs",
  isDefault: false,
  access: (allow) => ({
    "fastqs/*": [allow.authenticated.to(["read", "write", "delete"])]
  }),
});