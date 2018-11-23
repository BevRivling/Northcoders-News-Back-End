const validateQueries = (rawQs, ...validQs) => validQs.reduce((filteredQs, validQ) => {
  if (Object.keys(rawQs).includes(validQ)) {
    filteredQs[validQ] = rawQs[validQ];
  }
  return filteredQs;
}, {});

module.exports = { validateQueries };
