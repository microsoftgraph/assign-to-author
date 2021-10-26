import { expect, test } from '@jest/globals';

import { parseIssueBody } from '../src/parser';
import { IssueMetadata } from '../src/types';

const wellFormedIssueBody = `This is an issue

---
#### Document Details

⚠ *Do not edit this section. It is required for docs.microsoft.com ➟ GitHub issue linking.*

* ID: a79f1188-8828-5eaa-386a-f18507561ba0
* Version Independent ID: ffcc3cbb-6fd3-ee55-644a-1c6382bcd6e5
* Content: [Create group - Microsoft Graph beta](https://docs.microsoft.com/graph/api/group-post-groups?view=graph-rest-beta&tabs=http)
* Content Source: [api-reference/beta/api/group-post-groups.md](https://github.com/microsoftgraph/microsoft-graph-docs/blob/main/api-reference/beta/api/group-post-groups.md)
* Product: **groups**
* Technology: **microsoft-graph**
* GitHub Login: @Jordanndahl
* Microsoft Alias: **MSGraphDocsVteam**`;

const wellFormedIssueMetadata: IssueMetadata = {
  mdFileUrl:
    'https://github.com/microsoftgraph/microsoft-graph-docs/blob/main/api-reference/beta/api/group-post-groups.md',
  author: 'Jordanndahl',
};

const missingAuthorIssueBody = `This is an issue

---
#### Document Details

⚠ *Do not edit this section. It is required for docs.microsoft.com ➟ GitHub issue linking.*

* ID: a79f1188-8828-5eaa-386a-f18507561ba0
* Version Independent ID: ffcc3cbb-6fd3-ee55-644a-1c6382bcd6e5
* Content: [Create group - Microsoft Graph beta](https://docs.microsoft.com/graph/api/group-post-groups?view=graph-rest-beta&tabs=http)
* Content Source:
* Product: **groups**
* Technology: **microsoft-graph**
* GitHub Login: @Jordanndahl
* Microsoft Alias: **MSGraphDocsVteam**`;

const missingContentSourceIssueBody = `This is an issue

---
#### Document Details

⚠ *Do not edit this section. It is required for docs.microsoft.com ➟ GitHub issue linking.*

* ID: a79f1188-8828-5eaa-386a-f18507561ba0
* Version Independent ID: ffcc3cbb-6fd3-ee55-644a-1c6382bcd6e5
* Content: [Create group - Microsoft Graph beta](https://docs.microsoft.com/graph/api/group-post-groups?view=graph-rest-beta&tabs=http)
* Content Source: [api-reference/beta/api/group-post-groups.md](https://github.com/microsoftgraph/microsoft-graph-docs/blob/main/api-reference/beta/api/group-post-groups.md)
* Product: **groups**
* Technology: **microsoft-graph**
* GitHub Login:
* Microsoft Alias: **MSGraphDocsVteam**`;

test('Issue metadata is parsed properly', () => {
  expect(parseIssueBody(wellFormedIssueBody)).toEqual(wellFormedIssueMetadata);
});

test('Missing author results in null', () => {
  expect(parseIssueBody(missingAuthorIssueBody)).toBeNull();
});

test('Missing content source results in null', () => {
  expect(parseIssueBody(missingContentSourceIssueBody)).toBeNull();
});
