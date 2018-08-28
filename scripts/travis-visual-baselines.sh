# Fail the build if this step fails
set -e

# Update the webdriver-screenshots folder of the current branch, as long as it's a push and not a savage- branch.
echo -e "Pull request? $TRAVIS_PULL_REQUEST"
echo -e "TRAVIS_BRANCH: $TRAVIS_BRANCH"
echo -e "SAVAG_BRANCH: $SAVAGE_BRANCH"
if [[ "$TRAVIS_PULL_REQUEST" == "false" && ! $TRAVIS_BRANCH =~ $SAVAGE_BRANCH ]]; then
  echo -e "Checking new visual baseline images...\n"
  node ./node_modules/@blackbaud/skyux-builder-config/scripts/visual-baselines.js
else
  echo -e "Visual baseline images are not saved during a pull request. Aborting.\n"
fi
