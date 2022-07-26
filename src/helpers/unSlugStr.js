const { default: capitalizeFirstLetter } = require('./capitalizeFirstLetter');

function unSlugStr(str) {
  return capitalizeFirstLetter(str.split('-').join(' '));
}

export default unSlugStr;
