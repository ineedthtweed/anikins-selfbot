function choice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randint(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = { choice, randint };
