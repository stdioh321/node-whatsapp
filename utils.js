const {
  z
} = require("zod");
const _ = require('lodash');

function sanitizeNumber(number) {
  const result = z.number().or(z.string()).safeParse(number)
  if (!result.success) return null
  const {
    data
  } = result
  return `${data}`.trim().replace(/\D/g, '');
}

function addSuffixToNumber(number){
  return `${number}@c.us`;
}

function removeDuplicatesFromArray(arr) {
  if (!_.isArray(arr)) return null
  return _.uniq(arr)
}

module.exports.sanitizeNumber = sanitizeNumber
module.exports.addSuffixToNumber = addSuffixToNumber
module.exports.removeDuplicatesFromArray = removeDuplicatesFromArray
