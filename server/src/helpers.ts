const omit = (obj, ...props) => {
  const result = { ...obj };
  props.forEach(prop => {
    delete result[prop];
  });
  return result;
}

const pick = (obj, ...props) => {
  return props.reduce((result, prop) => {
    result[prop] = obj[prop];
    return result;
  }, {});
}

export { omit, pick };