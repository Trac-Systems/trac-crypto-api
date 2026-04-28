import { readFileSync, appendFileSync } from 'node:fs';

const output = process.env.GITHUB_OUTPUT;

if (!output) {
  throw new Error('GITHUB_OUTPUT is not set');
}

const summaryPath = process.argv[2] ?? 'coverage/coverage-summary.json';
const summary = JSON.parse(readFileSync(summaryPath, 'utf8')).total;

const values = {
  lines_pct: summary.lines.pct,
  lines_cov: summary.lines.covered,
  lines_total: summary.lines.total,
  statements_pct: summary.statements.pct,
  statements_cov: summary.statements.covered,
  statements_total: summary.statements.total,
  functions_pct: summary.functions.pct,
  functions_cov: summary.functions.covered,
  functions_total: summary.functions.total,
  branches_pct: summary.branches.pct,
  branches_cov: summary.branches.covered,
  branches_total: summary.branches.total
};

for (const [key, value] of Object.entries(values)) {
  appendFileSync(output, `${key}=${value}\n`);
}
