# Fail the build if this step fails
set -e

if [[ "$TRAVIS_PULL_REQUEST" == "false" ]]; then
  echo "Checking new visual baseline images..."
  node ./node_modules/@blackbaud/skyux-builder-config/scripts/visual-baselines.js
else
  echo "Visual baseline images are not checked during a pull request. Aborting script."
fi
