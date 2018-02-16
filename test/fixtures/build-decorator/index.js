
const calls = [];

function dec(id) {
  calls.push(id);
  return function() {};
}

@dec(1)
// eslint-disable-next-line
class Example {
}

