import browser from 'webextension-polyfill';

async function queryElement(query) {
  let element = document.querySelector(query);
  if (element) {
    return element;
  } else {
    throw new Error(`No element found for query: ${query}`);
  }
}

function wait(ms) {
  new Promise((resolve, reject) => setTimeout(resolve, ms));
}

export async function waitForElement(query, retryTime, retries = 3) {
  let error;
  for (let i = 0; i < retries; i++) {
    try {
      return await queryElement(query);
    } catch (err) {
      error = err;
    }
    await wait(retryTime);
  }
  throw error;
}

/**
 * Add listener to recrawl page on important changes
 */
export function addPageChangeListener(listener) {
  browser.runtime.onMessage.addListener(message => {
    if (message.type === 'pageChange') {
      listener();
    }
  });
}

/**
 * Send message to background.js mapping url to creator
 */
export function sendCreator(url, creator) {
  browser.runtime.sendMessage({
    type: 'creatorFound',
    activity: {
      url: url,
    },
    creator: creator,
  });
}
