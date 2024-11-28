function debugMe(debug, string, res) {
  return debug ? console.log(`[💬 - ${string}]: `, res) : null;
}
module.exports = debugMe;
