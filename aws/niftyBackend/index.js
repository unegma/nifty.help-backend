const {
  AWS_REGION,
  AWS_LAMBDA_FUNCTION_NAME = 'Nifty_Help_Backend',
  // AWS_TIMEOUT_THRESHOLD
  SLACK_ERROR_LOG, // NEED ENVIRONMENT VARIABLES FOR THOSE USED IN IMPORTS
  SLACK_MESSAGE_LOG,
  INFURA_ENDPOINT,
  INFURA_SECRET,
  PINATA_KEY,
  PINATA_SECRET
} = process.env;

const { AWSUtilities } = require('@unegma/aws-utilities');
const { SlackErrorLogger, SlackLogger } = require('@unegma/logger');
const Web3 = require('web3');
const pinataSDK = require('@pinata/sdk');
const { RaribleSDK } = require("rarible-sdk");
const slackErrorLogger = new SlackErrorLogger(SLACK_ERROR_LOG);
const slackMessageLogger = new SlackLogger(SLACK_MESSAGE_LOG);
const awsUtilities = new AWSUtilities(AWS_REGION, SLACK_ERROR_LOG);

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

    let exampleCID = 'QmeZNgksPj9oWVysFakn3dUZ8ij4VRXd2ZQWnvgmm6p2Az';
    message = await awsUtilities.invokeLambda("Nifty_Help_getImage", exampleCID, true);

    console.log(message);

    //




    // const web3 = getWeb3();
    // const pinata = pinataSDK(PINATA_KEY, PINATA_SECRET);

    // let items = [];
    // const raribleSDK = new RaribleSDK('mainnet'); // THIS CURRENTLY ONLY WORKS WITH MAINNET
    // const raribleItems = await raribleSDK.getItems();
    // await slackMessageLogger.log('handler', raribleItems);
    // const test = await raribleSDK.getItemMeta('0x0000000000001b84b1cb32787b0d64758d019317:0x0000000000e000836a9560dceec305013898474d009d50ea8d0d3a260d060000');
    // const raribleItemsWithMeta = await Promise.all(raribleItems.map(async (item) => {
    //   let itemMeta = await raribleSDK.getItemMeta(item.id);
    //   item.meta = itemMeta;
    //   return item;
    // }));

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
function getWeb3() {
  return new Web3(
      new Web3.providers.WebsocketProvider(
          `${INFURA_ENDPOINT}${INFURA_SECRET}`,
          {
            timeout: 30000, // ms

            clientConfig: {
              // Useful if requests are large
              maxReceivedFrameSize: 100000000, // bytes - default: 1MiB
              maxReceivedMessageSize: 100000000, // bytes - default: 8MiB

              // Useful to keep a connection alive
              keepalive: true,
              keepaliveInterval: 60000, // ms
            },

            // Enable auto reconnection
            reconnect: {
              auto: true,
              delay: 5000, // ms
              maxAttempts: 5,
              onTimeout: false,
            },
          }
      )
  );
}

