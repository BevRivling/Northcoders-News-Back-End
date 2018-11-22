const validateQueries = (rawQs, ...validQs) => validQs.reduce((filteredQs, validQ) => {
  if (rawQs.hasOwnProperty(validQ)) {
    // const numberOrString =
    // Number(rawQs[validQ]) === NaN ? rawQs[validQ] : Number(rawQs[validQ]);
    filteredQs[validQ] = rawQs[validQ];
  }
  return filteredQs;
}, {});

module.exports = { validateQueries };
