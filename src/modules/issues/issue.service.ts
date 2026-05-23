import { StatusCodes } from 'http-status-codes';
import { query } from '../../config/db';
import { AppError } from '../../utils/AppError';
import { validateIssueStatus, validateIssueType } from '../../utils/validators';
import { Issue, IssueStatus, IssueType, UserRole } from '../../types';

interface CreateIssueInput {
  title: string;
  description: string;
  type: IssueType;
}

interface UpdateIssueInput {
  title?: string;
  description?: string;
  type?: IssueType;
}

interface Reporter {
  id: number;
  name: string;
  role: UserRole;
}

interface IssueWithReporter extends Omit<Issue, 'reporter_id'> {
  reporter: Reporter | null;
}

interface IssueFilters {
  sort?: string;
  type?: string;
  status?: string;
}

const validateIssueText = (title?: string, description?: string): void => {
  if (title !== undefined && (title.trim().length === 0 || title.length > 150)) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Title must be provided and maximum 150 characters');
  }

  if (description !== undefined && description.trim().length < 20) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Description must be at least 20 characters');
  }
};

const attachReporters = async (issues: Issue[]): Promise<IssueWithReporter[]> => {
  if (issues.length === 0) return [];

  const reporterIds = [...new Set(issues.map((issue) => issue.reporter_id))];
  const placeholders = reporterIds.map((_, index) => `$${index + 1}`).join(', ');

  const reporterResult = await query<Reporter>(
    `SELECT id, name, role FROM users WHERE id IN (${placeholders})`,
    reporterIds,
  );

  return issues.map((issue) => {
    const reporter = reporterResult.rows.find((user) => user.id === issue.reporter_id) || null;
    const { reporter_id, ...issueWithoutReporterId } = issue;

    return {
      ...issueWithoutReporterId,
      reporter,
    };
  });
};

export const createIssue = async (payload: CreateIssueInput, reporterId: number): Promise<Issue> => {
  const { title, description } = payload;
  const type = validateIssueType(payload.type);

  if (!title || !description || !type) {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Title, description and type are required');
  }

  validateIssueText(title, description);

  const reporter = await query('SELECT id FROM users WHERE id = $1', [reporterId]);

  if (reporter.rows.length === 0) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Reporter not found');
  }

  const result = await query<Issue>(
    `INSERT INTO issues (title, description, type, reporter_id)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [title, description, type, reporterId],
  );

  return result.rows[0];
};

export const getAllIssues = async (filters: IssueFilters): Promise<IssueWithReporter[]> => {
  const whereParts: string[] = [];
  const values: string[] = [];

  if (filters.type) {
    const type = validateIssueType(filters.type);
    values.push(type);
    whereParts.push(`type = $${values.length}`);
  }

  if (filters.status) {
    const status = validateIssueStatus(filters.status);
    values.push(status);
    whereParts.push(`status = $${values.length}`);
  }

  if (filters.sort && filters.sort !== 'newest' && filters.sort !== 'oldest') {
    throw new AppError(StatusCodes.BAD_REQUEST, 'Sort must be newest or oldest');
  }

  const sort = filters.sort === 'oldest' ? 'ASC' : 'DESC';
  const whereClause = whereParts.length > 0 ? `WHERE ${whereParts.join(' AND ')}` : '';

  const result = await query<Issue>(
    `SELECT * FROM issues ${whereClause} ORDER BY created_at ${sort}`,
    values,
  );

  return attachReporters(result.rows);
};

export const getIssueById = async (id: number): Promise<IssueWithReporter> => {
  const result = await query<Issue>('SELECT * FROM issues WHERE id = $1', [id]);
  const issue = result.rows[0];

  if (!issue) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Issue not found');
  }

  const [issueWithReporter] = await attachReporters([issue]);
  return issueWithReporter;
};

export const updateIssue = async (
  id: number,
  payload: UpdateIssueInput,
  requesterId: number,
  requesterRole: UserRole,
): Promise<Issue> => {
  const currentResult = await query<Issue>('SELECT * FROM issues WHERE id = $1', [id]);
  const currentIssue = currentResult.rows[0];

  if (!currentIssue) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Issue not found');
  }

  const isMaintainer = requesterRole === 'maintainer';
  const isOwnOpenIssue = currentIssue.reporter_id === requesterId && currentIssue.status === 'open';

  if (!isMaintainer && !isOwnOpenIssue) {
    throw new AppError(StatusCodes.FORBIDDEN, 'Contributors can update only their own open issues');
  }

  const title = payload.title ?? currentIssue.title;
  const description = payload.description ?? currentIssue.description;
  const type = payload.type ? validateIssueType(payload.type) : currentIssue.type;

  validateIssueText(title, description);

  const result = await query<Issue>(
    `UPDATE issues
     SET title = $1, description = $2, type = $3, updated_at = NOW()
     WHERE id = $4
     RETURNING *`,
    [title, description, type, id],
  );

  return result.rows[0];
};

export const updateIssueStatus = async (id: number, status: IssueStatus): Promise<Issue> => {
  const validStatus = validateIssueStatus(status);

  const result = await query<Issue>(
    `UPDATE issues
     SET status = $1, updated_at = NOW()
     WHERE id = $2
     RETURNING *`,
    [validStatus, id],
  );

  if (!result.rows[0]) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Issue not found');
  }

  return result.rows[0];
};

export const deleteIssue = async (id: number): Promise<void> => {
  const result = await query<Issue>('DELETE FROM issues WHERE id = $1 RETURNING *', [id]);

  if (!result.rows[0]) {
    throw new AppError(StatusCodes.NOT_FOUND, 'Issue not found');
  }
};