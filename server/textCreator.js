
async function textCreator(text) {
  const result = text.emailBody.split('\n');
  const result2 = result.forEach(await (item, index) => {
    const person = text.json_agg[index];
    item.replace('{{PersonName}}', person.firstName);
  });
}

module.exports = textCreator;
