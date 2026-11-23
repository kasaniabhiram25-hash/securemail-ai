/* SecureMail AI v1.0: local, deterministic CLASSROOM DEMO — NOT an AI model or security product. */
(function(root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.SecureMailAnalyzer = api;
})(typeof window !== 'undefined' ? window : globalThis, function() {
  'use strict';
  const SAMPLE = `From: IT Helpdesk <support-account@secure-login-example.com>\nSubject: Urgent: Your university mailbox will be disabled\n\nYour mailbox will be permanently suspended today. Verify your password immediately using the link below to avoid losing access:\nhttp://secure-login-example.com/verify\n\nDo not contact the help desk because this is an automated security notice.`;
  function analyze(input) {
    const value = String(input == null ? '' : input).trim();
    if (value.length < 20) return {valid:false, error:'Please paste a fuller email message (at least 20 characters).'};
    const s = value.toLowerCase();
    let score = 8;
    const signals = [];
    if (/(urgent|immediately|today|within 24)/.test(s)) {
      score += 24; signals.push('Urgency or deadline pressure may push the recipient to act without checking.');
    }
    if (/(password|verify|login|account)/.test(s)) {
      score += 25; signals.push('The message requests account or credential-related action.');
    }
    if (/(http:\/\/|https:\/\/|click|link)/.test(s)) {
      score += 20; signals.push('A link or call to action should be checked independently before opening.');
    }
    if (/(suspended|disabled|permanently)/.test(s)) {
      score += 15; signals.push('Threat of account loss is a common social-engineering pressure tactic.');
    }
    if (/(do not contact|do not reply|confidential)/.test(s)) {
      score += 12; signals.push('Discouraging independent verification is a warning sign.');
    }
    score = Math.max(5, Math.min(98,score));
    if (!signals.length) signals.push('No obvious high-risk phrases were detected. This is not proof that the email is safe.');
    if (score >= 65) return {valid:true,label:'HIGH RISK',score,signals,summary:'This message contains multiple warning signs consistent with a possible phishing attempt.',action:'Do not click links or share credentials. Verify through the organization’s official website or a known phone number.'};
    if (score >= 35) return {valid:true,label:'CAUTION',score,signals,summary:'Some warning signs were detected. Verify the sender and request using a trusted channel.',action:'Pause before acting. Inspect the sender address and navigate to the official site yourself.'};
    return {valid:true,label:'LOW SIGNAL',score,signals,summary:'The prototype found few common warning signs. Automated checks can miss sophisticated attacks.',action:'If unexpected, confirm the sender and destination independently before sharing sensitive information.'};
  }
  return {analyze,SAMPLE};
});
