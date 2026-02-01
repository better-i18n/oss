import { createStart } from "@tanstack/react-start";
import { getRouter } from "./router";
import { i18nMiddleware } from "./middleware/i18n";

export default createStart({
  router: getRouter,
  middleware: [i18nMiddleware],
});
