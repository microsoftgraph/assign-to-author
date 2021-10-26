import * as core from '@actions/core';
import * as github from '@actions/github';
import { IssuesOpenedEvent } from '@octokit/webhooks-definitions/schema';

import { parseIssueBody } from './parser';
import { getAssignmentComment } from './strings';

async function run(): Promise<void> {
  try {
    // Add a repository secret called ACTIONS_STEP_DEBUG set to true to
    // see this output in the logs
    core.info(
      `Event: ${github.context.eventName}, Action: ${github.context.action}`
    );
    core.info(`Payload: ${JSON.stringify(github.context.payload)}`);

    if (
      github.context.eventName === 'issues' &&
      github.context.payload.action === 'opened'
    ) {
      const openedEvent = github.context.payload as IssuesOpenedEvent;
      const body = openedEvent.issue.body;
      core.info(`Issue opened: ${openedEvent.issue.number}`);

      const repoToken = core.getInput('repoToken', { required: true });
      const octokit = github.getOctokit(repoToken);

      let needsLabel: boolean = true;
      const metadata = parseIssueBody(body);
      if (metadata) {
        core.info(`Metadata: ${JSON.stringify(metadata)}`);

        // Add author as an assignee
        try {
          await octokit.rest.issues.addAssignees({
            owner: openedEvent.repository.owner.login,
            repo: openedEvent.repository.name,
            issue_number: openedEvent.issue.number,
            assignees: [metadata.author],
          });

          needsLabel = false;
        } catch (addAssigneeError) {
          core.warning(
            `Unable to add assignee\n${JSON.stringify(addAssigneeError)}`
          );
        }

        // Add a comment @-mentioning author
        try {
          await octokit.rest.issues.createComment({
            owner: openedEvent.repository.owner.login,
            repo: openedEvent.repository.name,
            issue_number: openedEvent.issue.number,
            body: getAssignmentComment(metadata.author),
          });
        } catch (createCommentError) {
          core.warning(
            `Unable to create comment\n${JSON.stringify(createCommentError)}`
          );
        }
      }

      if (needsLabel) {
        // Missing metadata or failure to assign, add label
        const label = core.getInput('needAssignLabel', { required: true });
        try {
          await octokit.rest.issues.addLabels({
            owner: openedEvent.repository.owner.login,
            repo: openedEvent.repository.name,
            issue_number: openedEvent.issue.number,
            labels: [label],
          });
        } catch (addLabelError) {
          core.warning(`Unable to add label\n${JSON.stringify(addLabelError)}`);
        }
      }
    }
  } catch (error) {
    // General error
    core.setFailed(`Unexpected error: \n${JSON.stringify(error)}`);
  }
}

run();
