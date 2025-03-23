/**
 * Button component module
 */
const utils = require('../utils');

/**
 * Create a new button with the specified label
 * @param {string} label - Button text label
 * @return {Object} - Button object
 */
function createButton(label) {
  const id = `btn_${Math.floor(Math.random() * 1000)}`;
  const formattedLabel = utils.formatString(label);
  
  return {
    id,
    label: formattedLabel,
    render: () => `<button id="${id}">${formattedLabel}</button>`,
    onClick: (callback) => {
      console.log(`Button ${id} clicked`);
      if (callback) callback();
    }
  };
}

module.exports = {
  createButton
};
