import * as routes from './manifest.js';

export const createRouterMiddleware = ({ app }) => Object.values(routes).map((route) => {
  const { path, handlers } = route();

  return app.use(path, handlers);
});
