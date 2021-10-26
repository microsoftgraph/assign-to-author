import * as core from '@actions/core';
import * as github from '@actions/github';
import { IssuesOpenedEvent } from '@octokit/webhooks-definitions/schema';

import { parseIssueBody } from './parser';

async function run(): Promise<void> {
  try {
    core.info(
      `Event: ${github.context.eventName}, Action: ${github.context.action}`
    );
    core.info(`Payload: ${JSON.stringify(github.context.payload)}`);
    if (
      github.context.eventName === 'issues' &&
      github.context.action === 'opened'
    ) {
      const openedEvent = github.context.payload as IssuesOpenedEvent;
      const body = openedEvent.issue.body;
      core.info(`Issue opened: ${body}`);

      const metadata = parseIssueBody(body);
      if (metadata) {
        core.info(`Metadata: ${JSON.stringify(metadata)}`);
      }
    }
  } catch (error) {
    // General error
    core.setFailed(`Unexpected error: \n${JSON.stringify(error)}`);
  }
}

run();