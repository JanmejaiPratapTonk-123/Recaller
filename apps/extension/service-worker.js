chrome.runtime.onMessage.addListener((message, sender, sendResponese) => {
  if (message.type === "SUBMISSION_ACCEPTED") {
    const submission = message.data;

    processSubmission(submission);
  }
});

function processSubmission(submission) {
  console.log("Accepted submission: ");
  console.log(submission);

  chrome.storage.local.get("submissions", (result) => {
    const submissions = result.submissions ?? [];

    submissions.push(submission);

    chrome.storage.local.set({
      submissions: submissions,
    });
  });
}

function getSubmissions() {
  chrome.storage.local.get("submissions", (result) => {
    console.log(result.submissions);
  });
}

getSubmissions();

function getSubmissionsByQuestionId(questionId) {
  return new Promise((resolve) => {
    chrome.storage.local.get("submissions", (result) => {
      const submissions = result.submissions ?? [];

      const filteredSubmissions = submissions.filter((submission) => {
        return submission.questionId === questionId;
      });

      resolve(filteredSubmissions);
    });
  });
}
