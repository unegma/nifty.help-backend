const {
  AWS_LAMBDA_FUNCTION_NAME = 'Nifty_Help_getImage',
  // AWS_TIMEOUT_THRESHOLD
  SLACK_ERROR_LOG, // NEED ENVIRONMENT VARIABLES FOR THOSE USED IN IMPORTS
  SLACK_MESSAGE_LOG,
} = process.env;

const IPFS = require('ipfs-core');
const { SlackErrorLogger, SlackLogger } = require('@unegma/logger');
const slackErrorLogger = new SlackErrorLogger(SLACK_ERROR_LOG);
const slackMessageLogger = new SlackLogger(SLACK_MESSAGE_LOG);

/**
 *
 * @param event
 * @param context
 * @returns {Promise<{body: (*|string), statusCode: number}|Buffer>}
 */
exports.handler = async (event, context) => {
  console.log(`# Beginning ${AWS_LAMBDA_FUNCTION_NAME}`); console.log(JSON.stringify(event)); console.log(context);
  let message = "# Success";
  try {

    const node = await IPFS.create();
    let bufs = [];
    for await (const buf of node.cat(event)) {
      bufs.push(buf);
    }
    message = Buffer.concat(bufs); // let blob = new Blob([data], {type:"image/jpg"});

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
 * Low level functions
 */
