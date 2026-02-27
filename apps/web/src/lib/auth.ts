import Cognito from "@auth/core/providers/cognito";
import type { StartAuthJSConfig } from "start-authjs";

const isAuthBypass = process.env.APP_ENV === "local";

export const authConfig: StartAuthJSConfig = {
  secret: isAuthBypass ? "local-dev-dummy-secret" : process.env.AUTH_SECRET,
  providers: [
    Cognito({}), // AUTH_COGNITO_ID, AUTH_COGNITO_SECRET, AUTH_COGNITO_ISSUER
  ],
};
