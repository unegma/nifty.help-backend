const {
  AWS_LAMBDA_FUNCTION_NAME = 'Nifty_Help_Backend',
  // AWS_TIMEOUT_THRESHOLD
  SLACK_ERROR_LOG, // NEED ENVIRONMENT VARIABLES FOR THOSE USED IN IMPORTS
  SLACK_MESSAGE_LOG
} = process.env;

const { RaribleSDK } = require("rarible-sdk");
const { SlackErrorLogger, SlackLogger } = require('@unegma/logger');
const slackErrorLogger = new SlackErrorLogger(SLACK_ERROR_LOG);
const slackMessageLogger = new SlackLogger(SLACK_MESSAGE_LOG);

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
    let items = [];
    // const raribleSDK = new RaribleSDK('mainnet'); // THIS CURRENTLY ONLY WORKS WITH MAINNET
    // const raribleItems = await raribleSDK.getItems();
    // await slackMessageLogger.log('handler', raribleItems);
    // const test = await raribleSDK.getItemMeta('0x0000000000001b84b1cb32787b0d64758d019317:0x0000000000e000836a9560dceec305013898474d009d50ea8d0d3a260d060000');
    // const raribleItemsWithMeta = await Promise.all(raribleItems.map(async (item) => {
    //   let itemMeta = await raribleSDK.getItemMeta(item.id);
    //   item.meta = itemMeta;
    //   return item;
    // }));

    return items;
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
