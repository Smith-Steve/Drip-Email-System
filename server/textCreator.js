function textCreator(emailInfo) {
  const emailTextLines = emailInfo.emailBody.split('\n');
  const emailArray = [];
  for (let i = 0; i < emailTextLines.length; i++) {
    const person = emailInfo.json_agg[i];
    const line = emailTextLines[i];
    if (line.includes('{{PersonName}}')) {
      const newLine = line.replace('{{PersonName}}', person.firstName);
      emailArray.push(newLine);
    } else if (line.includes('{{Company}}')) {
      const companyNewLine = line.replace('{{Company}}', person.company);
      emailArray.push(companyNewLine);
    } else if (line.includes('')) {
      const removedNonText = line.replace('', '\n');
      emailArray.push(removedNonText);
    } else {
      emailArray.push(line);
    }
  }
  const finalEmail = emailArray.join('');
  return finalEmail;
}

module.exports = textCreator;
