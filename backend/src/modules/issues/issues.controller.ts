import type { Request, Response } from 'express';
import { issuesService } from './issues.service';

// Validated input is placed on res.locals by the validate() middleware.
export const issuesController = {
  async list(_req: Request, res: Response) {
    res.json(await issuesService.listIssues(res.locals.query));
  },

  async stats(_req: Request, res: Response) {
    res.json({ data: await issuesService.getStats() });
  },

  async get(_req: Request, res: Response) {
    res.json({ data: await issuesService.getIssue(res.locals.params.id) });
  },

  async create(_req: Request, res: Response) {
    const issue = await issuesService.createIssue(res.locals.body);
    res.status(201).location(`/api/issues/${issue.id}`).json({ data: issue });
  },

  async upvote(_req: Request, res: Response) {
    res.json({ data: await issuesService.upvoteIssue(res.locals.params.id) });
  },

  async updateStatus(_req: Request, res: Response) {
    const { id } = res.locals.params;
    res.json({ data: await issuesService.updateStatus(id, res.locals.body.status) });
  },
};
