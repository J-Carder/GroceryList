// given an object choose which attributes you want to omit
const omit = (obj, ...props) => {
  const result = { ...obj };
  props.forEach(prop => {
    delete result[prop];
  });
  return result;
}

// given an object pick which attributes you wan to keep
const pick = (obj, ...props) => {
  return props.reduce((result, prop) => {
    result[prop] = obj[prop];
    return result;
  }, {});
}

export { omit, pick };