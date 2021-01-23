/**
 * pre: The following environment variables are set:
 *   - GITHUB_REPOSITORY
 *   - GITHUB_REF
 * @return {String} A name for a CDK stack that:
 *   - enables deploying from feature branches
 *   - enables deploying from multiple feature branches in the same account
 *   - enables deploying to multiple regions from the same account, same branch
 */
const stackname = (shortName?: string) => {
  const gitHubRepository: string = process.env.GITHUB_REPOSITORY as string;
  const gitHubRef: string = process.env.GITHUB_REF as string;
  if (gitHubRepository.length < 1) {
    throw "GITHUB_REPOSITORY is too short, length < 1";
  }
  if (gitHubRef.length < 1) {
    throw "GITHUB_REF is too short, length < 1";
  }
  const slashLetterRegex = /\/(.)/;
  const repoFirstLetterMatch = gitHubRepository.match(slashLetterRegex);
  if (!repoFirstLetterMatch || repoFirstLetterMatch.length < 2) {
    throw (
      "Can't figure out repo name. Does GITHUB_REPOSITORY have a '/'?" +
      " It should have a '/' separating the organization or user from the " +
      "repo name."
    );
  }
  return (
    gitHubRepository
      .toLowerCase()
      .replace(
        /^([^/])([^/]*)[/]([^/])/,
        (_, p1, p2, p3) => p1.toUpperCase() + p2 + p3.toUpperCase()
      ) +
    gitHubRef
      .toLowerCase()
      .replace(/^refs\/heads\/(.)/, (_, p1) => p1.toUpperCase()) +
    (shortName ? `-${shortName}` : "")
  );
};
module.exports = stackname;
