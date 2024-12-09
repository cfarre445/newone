import { type ClientSchema, a, defineData } from "@aws-amplify/backend";
import { processCSV } from "../functions/parse-csv/resource";

const schema = a.schema({
  csvfile: a
    .model({
      id: a.id().required(),
      name: a.string().required(),
    })
    .authorization((allow) => [allow.publicApiKey()]),
  processCSV: a
    .query()
    .arguments({
      name: a.string(),
    })
    .authorization((allow) => [allow.publicApiKey()])
    .returns(a.string())
    .handler(a.handler.function(processCSV)),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "iam",

    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});