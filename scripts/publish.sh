#!/bin/sh

# turn off cli pager
export AWS_PAGER=""
FUNCTION_NAME=""

#get parameters
while getopts f: flag
do
  case "${flag}" in
    f) FUNCTION_NAME=${OPTARG};;
  esac
done

if [ ! $FUNCTION_NAME ]
then
  echo "Function not specified"
  exit 1
fi

echo "# Beginning Deployment of $FUNCTION_NAME"

echo "## Temporarily moving current node_modules (with dev dependencies)..."
mv ./node_modules ./node_modules--temp || { echo "Failed to move node_modules"; exit 1; }

echo "## Installing production dependencies..."
npm install --only=production || { echo "Failed to install dependencies"; exit 1; }
node-prune

echo "## Preparing zip file for deployment..."
zip -qr function.zip . -x "*.spec.js" "test/*" "node_modules--temp/*" || { echo "Failed to zip"; exit 1; }
# Clean these up here so webstorm doesn't start indexing them
rm -rf ./node_modules
mv ./node_modules--temp ./node_modules || { echo "Failed to restore dev node_modules"; exit 1; }

# deploy
echo "## Deploying..."
aws --profile unegma lambda update-function-code --function-name $FUNCTION_NAME --zip-file fileb://function.zip || { echo "Failed to publish"; exit 1; }

# Bump version
# todo when move all scripts to one place, make sure this is executed on the right package.json
npm version minor

echo "## Cleaning up..."
rm ./function.zip

echo "# Done."
exit 0
