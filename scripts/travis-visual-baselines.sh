# Fail the build if this step fails
set -e

# Update the webdriver-screenshots folder of the current branch, as long as it's a push and not a savage- branch.
if [[ "$TRAVIS_PULL_REQUEST" == "false" && ! $TRAVIS_BRANCH =~ $SAVAGE_BRANCH ]]; then
  node ./node_modules/@blackbaud/skyux-builder-config/scripts/visual-baseline.js
fi
