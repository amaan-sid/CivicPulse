import type { RequestHandler } from 'express';
import type { ZodType } from 'zod';

type Schemas = { body?: ZodType; query?: ZodType; params?: ZodType };

/**
 * Validates request input against Zod schemas. Parsed (coerced, defaulted)
 * values are stored on res.locals so handlers receive clean, typed data.
 */
export const validate =
  (schemas: Schemas): RequestHandler =>
  (req, res, next) => {
    if (schemas.params) res.locals.params = schemas.params.parse(req.params);
    if (schemas.query) res.locals.query = schemas.query.parse(req.query);
    if (schemas.body) res.locals.body = schemas.body.parse(req.body ?? {});
    next();
  };
