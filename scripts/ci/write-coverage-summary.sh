#!/usr/bin/env bash
set -euo pipefail

: "${GITHUB_STEP_SUMMARY:?GITHUB_STEP_SUMMARY is not set}"

: "${LINES_PCT:?LINES_PCT is not set}"
: "${LINES_COV:?LINES_COV is not set}"
: "${LINES_TOTAL:?LINES_TOTAL is not set}"
: "${STATEMENTS_PCT:?STATEMENTS_PCT is not set}"
: "${STATEMENTS_COV:?STATEMENTS_COV is not set}"
: "${STATEMENTS_TOTAL:?STATEMENTS_TOTAL is not set}"
: "${FUNCTIONS_PCT:?FUNCTIONS_PCT is not set}"
: "${FUNCTIONS_COV:?FUNCTIONS_COV is not set}"
: "${FUNCTIONS_TOTAL:?FUNCTIONS_TOTAL is not set}"
: "${BRANCHES_PCT:?BRANCHES_PCT is not set}"
: "${BRANCHES_COV:?BRANCHES_COV is not set}"
: "${BRANCHES_TOTAL:?BRANCHES_TOTAL is not set}"

{
  echo "## Coverage"
  echo ""
  echo "| Metric | Coverage | Covered/Total |"
  echo "| --- | ---: | ---: |"
  echo "| Lines | ${LINES_PCT}% | ${LINES_COV}/${LINES_TOTAL} |"
  echo "| Statements | ${STATEMENTS_PCT}% | ${STATEMENTS_COV}/${STATEMENTS_TOTAL} |"
  echo "| Functions | ${FUNCTIONS_PCT}% | ${FUNCTIONS_COV}/${FUNCTIONS_TOTAL} |"
  echo "| Branches | ${BRANCHES_PCT}% | ${BRANCHES_COV}/${BRANCHES_TOTAL} |"
} >> "${GITHUB_STEP_SUMMARY}"
