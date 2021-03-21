const {
  AWS_LAMBDA_FUNCTION_NAME = 'Nifty_Help_Backend',
  // AWS_TIMEOUT_THRESHOLD
  SLACK_ERROR_LOG, // NEED ENVIRONMENT VARIABLES FOR THOSE USED IN IMPORTS
} = process.env;

const { RaribleSDK } = require("rarible-sdk");
const { SlackErrorLogger } = require('@unegma/logger');
const slackErrorLogger = new SlackErrorLogger(SLACK_ERROR_LOG);

/**
 *
 * @param event
 * @param context
 * @returns {Promise<{body: string, statusCode: number}>}
 */
exports.handler = async (event, context) => {
  console.log(`# Beginning ${AWS_LAMBDA_FUNCTION_NAME}`); console.log(JSON.stringify(event)); console.log(context);
  let message = "# Success";
  try {
    const raribleSDK = new RaribleSDK('mainnet'); // THIS CURRENTLY ONLY WORKS WITH MAINNET
    const raribleItems = await raribleSDK.getItems();

    return raribleItems;
  } catch(error) {
    message = error.message;
    await slackErrorLogger.logError('handler', `${AWS_LAMBDA_FUNCTION_NAME} failed.`, error);
  }
  console.log(`Completed ${AWS_LAMBDA_FUNCTION_NAME}`);
  return { statusCode: 200, body: message };
};

/**
 * Handler Functions
 */

/**
 * Sub Functions
 */

/**
 * Low level functions (todo move to library?)
 */
