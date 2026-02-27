import Cognito from "@auth/core/providers/cognito";
import type { StartAuthJSConfig } from "start-authjs";

export const authConfig: StartAuthJSConfig = {
  secret: process.env.AUTH_SECRET,
  providers: [
    Cognito({}), // AUTH_COGNITO_ID, AUTH_COGNITO_SECRET, AUTH_COGNITO_ISSUER
  ],
};
