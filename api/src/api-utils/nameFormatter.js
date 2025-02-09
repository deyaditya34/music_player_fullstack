function nameFormatter(string = '') {
  let result = [];

  for (let i = 0; i < string.length; i++) {
    if (i === 0) {
      result.push(string[i].toUpperCase());
    } else if (string[i] === ',') {
      result.push(string[i]);
      if (string[i + 1] === ' ') {
        i++;
      }
      result.push(string[i + 1].toUpperCase());
      i++;
    } else if (string[i] === ' ') {
      result.push(' ');
      result.push(string[i + 1].toUpperCase());
      i++;
    } else result.push(string[i].toLowerCase());
  }

  return result.join('');
}

module.exports = nameFormatter;

