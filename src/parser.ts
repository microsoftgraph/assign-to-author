import { IssueMetadata } from './types';

const mdFileUrlRegex = /^\*\s*Content\s*Source:\s*\[.*\]\((?<mdFile>.*)\)/gim;
const authorRegex = /^\*\s*GitHub\s*Login:\s*@(?<gitHubLogin>.*)/gim;

export function parseIssueBody(body: string | null): IssueMetadata | null {
  if (body) {
    // Find the content source in the issue metadata if present
    const fileUrlMatch = mdFileUrlRegex.exec(body);
    if (fileUrlMatch?.groups?.mdFile) {
      // Find the author in the issue metadat if present
      const authorMatch = authorRegex.exec(body);
      if (authorMatch?.groups?.gitHubLogin) {
        // We have required data
        return {
          mdFileUrl: fileUrlMatch.groups.mdFile,
          author: authorMatch.groups.gitHubLogin,
        };
      }
    }
  }

  return null;
}
