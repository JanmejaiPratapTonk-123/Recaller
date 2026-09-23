chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "SUBMISSION_ACCEPTED") {
    const submission = message.data;

    processSubmission(submission);
  }

  if (message.type == "GET_SUBMISSIONS_BY_SLUG") {
    const slug = message.data;

    getSubmissionsBySlug(slug).then((submissions) => {
      sendResponse(submissions);
    });

    return true;
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

function getSubmissionsBySlug(slug) {
  return new Promise((resolve) => {
    chrome.storage.local.get("submissions", (result) => {
      const submissions = result.submissions ?? [];

      const filteredSubmissions = submissions.filter((submission) => {
        return String(submission.slug) === String(slug);
      });

      resolve(filteredSubmissions);
    });
  });
}
