const dataset = require('./data/spam_dataset.json');

function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

let model = null;

function train() {
  const spamDocs = [];
  const hamDocs = [];

  dataset.forEach((item) => {
    if (item.label === 'spam') {
      spamDocs.push(item);
    } else {
      hamDocs.push(item);
    }
  });

  const priorSpam = spamDocs.length / dataset.length;
  const priorHam = hamDocs.length / dataset.length;
  const spamCounts = {};
  const hamCounts = {};
  let spamTotal = 0;
  let hamTotal = 0;

  function countWords(text) {
    const counts = {};
    tokenize(text).forEach((token) => {
      counts[token] = (counts[token] || 0) + 1;
    });
    return counts;
  }

  spamDocs.forEach((item) => {
    const counts = countWords(`${item.subject} ${item.body}`);
    Object.entries(counts).forEach(([token, count]) => {
      spamCounts[token] = (spamCounts[token] || 0) + count;
      spamTotal += count;
    });
  });

  hamDocs.forEach((item) => {
    const counts = countWords(`${item.subject} ${item.body}`);
    Object.entries(counts).forEach(([token, count]) => {
      hamCounts[token] = (hamCounts[token] || 0) + count;
      hamTotal += count;
    });
  });

  const vocab = new Set([...Object.keys(spamCounts), ...Object.keys(hamCounts)]);
  const alpha = 1;

  model = {
    priorSpam,
    priorHam,
    spamCounts,
    hamCounts,
    spamTotal,
    hamTotal,
    vocabSize: vocab.size,
    alpha,
  };
}

function predict({ subject = '', body = '' }) {
  if (!model) {
    train();
  }

  const tokens = tokenize(`${subject} ${body}`);
  const spamScore = Math.log(model.priorSpam) + tokens.reduce((sum, token) => {
    const count = model.spamCounts[token] || 0;
    return sum + Math.log((count + model.alpha) / (model.spamTotal + model.alpha * model.vocabSize));
  }, 0);

  const hamScore = Math.log(model.priorHam) + tokens.reduce((sum, token) => {
    const count = model.hamCounts[token] || 0;
    return sum + Math.log((count + model.alpha) / (model.hamTotal + model.alpha * model.vocabSize));
  }, 0);

  const prediction = spamScore > hamScore ? 'spam' : 'ham';
  const confidence = 1 / (1 + Math.exp(-(spamScore - hamScore)));

  return {
    prediction,
    confidence: Number(confidence.toFixed(4)),
    spamScore,
    hamScore,
  };
}

train();

module.exports = { predict, train };
