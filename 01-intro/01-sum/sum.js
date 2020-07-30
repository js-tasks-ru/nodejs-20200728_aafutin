function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function sum(a, b) {
  if (!isNumeric(a) || !isNumeric(b)) {
    throw new TypeError('Допускаются только числа', 'sum.js', 7);
  }
  return a + b;
}

module.exports = sum;
