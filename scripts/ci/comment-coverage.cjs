module.exports = async function commentCoverage({ github, context }) {
    const marker = '<!-- trac-crypto-api-coverage -->';
    const legacyMarker = '<!-- trac-wallet-coverage -->';
    const body = [
        marker,
        '## Coverage',
        '',
        '| Metric | Coverage | Covered/Total |',
        '| --- | ---: | ---: |',
        `| Lines | ${process.env.LINES_PCT}% | ${process.env.LINES_COV}/${process.env.LINES_TOTAL} |`,
        `| Statements | ${process.env.STATEMENTS_PCT}% | ${process.env.STATEMENTS_COV}/${process.env.STATEMENTS_TOTAL} |`,
        `| Functions | ${process.env.FUNCTIONS_PCT}% | ${process.env.FUNCTIONS_COV}/${process.env.FUNCTIONS_TOTAL} |`,
        `| Branches | ${process.env.BRANCHES_PCT}% | ${process.env.BRANCHES_COV}/${process.env.BRANCHES_TOTAL} |`
    ].join('\n');

    const { owner, repo } = context.repo;
    const issueNumber = context.payload.pull_request.number;
    const comments = await github.paginate(github.rest.issues.listComments, {
        owner,
        repo,
        issue_number: issueNumber,
        per_page: 100
    });
    const existing = comments.find((comment) =>
        comment.user.type === 'Bot' &&
    (comment.body.includes(marker) || comment.body.includes(legacyMarker))
    );

    if (existing) {
        await github.rest.issues.updateComment({
            owner,
            repo,
            comment_id: existing.id,
            body
        });
        return;
    }

    await github.rest.issues.createComment({
        owner,
        repo,
        issue_number: issueNumber,
        body
    });
};
