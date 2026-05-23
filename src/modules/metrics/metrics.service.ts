import { query } from '../../config/db';

interface MetricsResponse {
  total_users: number;
  total_issues: number;
  open_issues: number;
  in_progress_issues: number;
  resolved_issues: number;
  bug_count: number;
  feature_request_count: number;
}

interface CountRow {
  count: string;
}

const count = async (sql: string, params?: unknown[]): Promise<number> => {
  const result = await query<CountRow>(sql, params);
  return Number(result.rows[0].count);
};

export const getSystemMetrics = async (): Promise<MetricsResponse> => {
  const [
    totalUsers,
    totalIssues,
    openIssues,
    inProgressIssues,
    resolvedIssues,
    bugCount,
    featureRequestCount,
  ] = await Promise.all([
    count('SELECT COUNT(*) FROM users'),
    count('SELECT COUNT(*) FROM issues'),
    count('SELECT COUNT(*) FROM issues WHERE status = $1', ['open']),
    count('SELECT COUNT(*) FROM issues WHERE status = $1', ['in_progress']),
    count('SELECT COUNT(*) FROM issues WHERE status = $1', ['resolved']),
    count('SELECT COUNT(*) FROM issues WHERE type = $1', ['bug']),
    count('SELECT COUNT(*) FROM issues WHERE type = $1', ['feature_request']),
  ]);

  return {
    total_users: totalUsers,
    total_issues: totalIssues,
    open_issues: openIssues,
    in_progress_issues: inProgressIssues,
    resolved_issues: resolvedIssues,
    bug_count: bugCount,
    feature_request_count: featureRequestCount,
  };
};
