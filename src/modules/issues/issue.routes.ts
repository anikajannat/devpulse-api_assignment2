import { Router } from 'express';
import { authenticate, authorizeRoles } from '../../middleware/auth';
import {
  createIssueController,
  deleteIssueController,
  getIssuesController,
  getSingleIssueController,
  updateIssueController,
  updateIssueStatusController,
} from './issue.controller';

const router = Router();

router.post('/', authenticate, createIssueController);
router.get('/', getIssuesController);
router.get('/:id', getSingleIssueController);
router.patch('/:id', authenticate, updateIssueController);
router.patch('/:id/status', authenticate, authorizeRoles('maintainer'), updateIssueStatusController);
router.delete('/:id', authenticate, authorizeRoles('maintainer'), deleteIssueController);

export const issueRoutes = router;
