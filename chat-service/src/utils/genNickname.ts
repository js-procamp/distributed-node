const capitalize = require('lodash/capitalize');
/**
 * this file is just for fun, to generate random nckname while we don't have Auth system
 */
const intesifiers = [
  'absolutely',
  'quite',
  'totally',
  'utterly',
  'particilarly',
  'complettely',
  'totally',
  'really',
];

const adjectives = [
  'great',
  'cool',
  'ambitious',
  'generous',
  'cute',
  'dear',
  'nice',
  'reliable',
  'solid',
  'trusty',
  'simple',
  'pure',
  'brave',
  'manly',
  'fearless',
  'artful',
  'vivid',
  'utopic',
  'lucid',
  'radiant',
  'stinky',
  'supreme',
  'successful',
  'holly',
  'happy',
  'giant',
  'lucky',
  'weird',
  'extreme',
];

const names = [
  'phoenix',
  'centaur',
  'mermaid',
  'leviathan',
  'dragon',
  'pegasus',
  'siren',
  'hydra',
  'sphinx',
  'unicorn',
  'wyvern',
  'behemoth',
  'griffon',
  'dodo',
  'mammoth',
  'pirate',
  'eminem',
  'hacker',
  'parrot',
  'derp',
];

function random(limit) {
  return Math.floor(Math.random() * limit);
}

function getRandomElement(arr) {
  return capitalize(arr[random(arr.length)]);
}

function randomLogin() {
  return []
    .concat(Math.random() > 0.5 ? getRandomElement(intesifiers) : '')
    .concat(getRandomElement(adjectives))
    .concat(getRandomElement(names))
    .join('');
}

export default randomLogin;