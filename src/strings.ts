export function getAssignmentComment(author: string): string {
  return `This issue has been assigned to you, @${author}. You are listed as the author for the document associated with this issue. If this is not correct, please take the following actions.

- Assign this issue to the correct author
- Create a pull request to update the \`author\` field in the YAML front-matter of this topic`;
}
