Setup steps:
1. `npm install`
2. `npm run test`

PWW Team,

Here's a few items that reveal how I test and develop features.

1. Commits that start with `working on mutations and validating authentication on mutations with middleware` have a new feature, debugging steps memorialized, and tests validating the feature.
2. History of `graphql/bowling/bowlingGame.ts` and `tests/bowling/bowlingGame.test.ts` shows how I iterate using the TDD process of add the simplest possible test, get it passing with the simplest possible solution, clean ugly things, repeat. i.e. red, green, refactor.
3. History of `graphql/bowling/scoreSheet.ts` and `tests/bowling/scoreSheet.test.ts` ditto 2.
4. `graphql/bowling/bowlingAdapter.ts` demonstrates a class that wraps existing bowlingGame functionality in a GraphQL compatible way without needing to change bowlingGame.

I never read a commit log sequentially. This is why intermediate commits that show steps including failing tests do not bother me. In fact, it helps remind the reader of all the steps and failures along the way, to avoid wasting time on the same errors in the future.

"git blame" explains the most recent reasons behind each line, which is often the most important information when understanding what is going on before making a change.