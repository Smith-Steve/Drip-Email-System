// export default function Email(subject, emailBody, scriptId, emailNumberInSequence = 1, sendOn = null, createdAt = null, sentAt = null) {
//   this.subject = subject;
//   this.emailBody = emailBody;
//   this.scriptId = scriptId;
//   this.emailNumberInSequence = emailNumberInSequence;
//   this.sendOn = sendOn;
//   this.createdAt = createdAt;
//   this.sentAt = sentAt;
// }

class Email {
  constructor(subject, emailBody, scriptId, emailNumberInSequence = 1, sendOn = null, createdAt = null, sentAt = null) {
    this.subject = subject;
    this.emailBody = emailBody;
    this.scriptId = scriptId;
    this.emailNumberInSequence = emailNumberInSequence;
    this.sendOn = sendOn;
    this.createdAt = createdAt;
    this.sentAt = sentAt;
  }
}

export default Email;
