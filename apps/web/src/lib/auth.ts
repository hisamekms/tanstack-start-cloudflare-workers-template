import Cognito from "@auth/core/providers/cognito";
import type { StartAuthJSConfig } from "start-authjs";

import { config } from "~/config";

export const authConfig: StartAuthJSConfig = {
  secret: config.isLocalDev ? "local-dev-dummy-secret" : config.authSecret,
  providers: [
    Cognito({}), // AUTH_COGNITO_ID, AUTH_COGNITO_SECRET, AUTH_COGNITO_ISSUER
  ],
};
