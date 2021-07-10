export default function Email(subject, emailBody, scriptId, emailNumberInSequence = 1, sendOn = null) {
  this.subject = subject;
  this.emailBody = emailBody;
  this.scriptId = scriptId;
  this.emailNumberInSequence = emailNumberInSequence;
  this.sendOn = sendOn;
}
