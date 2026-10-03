export type AsyncHandler = (req: any, res: any, next: (err?: any) => void) => Promise<any>;

export function asyncCatch(fn: AsyncHandler) {
  return (req: any, res: any, next: (err?: any) => void) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

export function wrapRouter(router: any) {
  const methods = ['get', 'post', 'put', 'delete', 'patch'];
  for (const method of methods) {
    const original = router[method];
    if (typeof original === 'function') {
      router[method] = function (path: string, ...handlers: any[]) {
        const wrapped = handlers.map((h) => (typeof h === 'function' ? asyncCatch(h) : h));
        return original.call(this, path, ...wrapped);
      };
    }
  }
  return router;
}
