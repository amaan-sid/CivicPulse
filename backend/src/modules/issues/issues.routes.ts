import { Router } from 'express';
import { validate } from '../../middlewares/validate.middleware';
import { rateLimit } from '../../middlewares/rateLimit.middleware';
import { idParams } from '../../utils/validators';
import { issuesController } from './issues.controller';
import { createIssueSchema, listIssuesQuery, updateStatusSchema } from './issues.validation';

const writeLimit = rateLimit({ windowMs: 60_000, max: 30 });

export const issuesRoutes = Router();

issuesRoutes.get('/', validate({ query: listIssuesQuery }), issuesController.list);
issuesRoutes.get('/stats', issuesController.stats);
issuesRoutes.get('/:id', validate({ params: idParams }), issuesController.get);
issuesRoutes.post('/', writeLimit, validate({ body: createIssueSchema }), issuesController.create);
issuesRoutes.post('/:id/upvote', writeLimit, validate({ params: idParams }), issuesController.upvote);
issuesRoutes.patch(
  '/:id/status',
  writeLimit,
  validate({ params: idParams, body: updateStatusSchema }),
  issuesController.updateStatus,
);
