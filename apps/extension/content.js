console.log("Recaller content script loaded!");

const path = window.location.pathname;
const problem = path.split("/");

// Title
const titleElement = document.querySelector(
  `a[href="/problems/${problem[2]}/"]`,
);

// Difficulty
const difficultyElement = document.querySelector('[class*="difficulty-"]');

const slug = problem[2];

window.addEventListener("submissionAccepted", (event) => {
  console.log("Submission Accepted Event Detected!");
  const submissionAccepted = {
    submissionId: event.detail.submissionId,
    language: event.detail.language,
    questionId: event.detail.questionId,
    code: event.detail.code,
    title: titleElement?.textContent ?? "Unknown",
    difficulty: difficultyElement?.textContent ?? "Unknown",
    url: `https://leetcode.com/problems/${slug}/`,
  };

  chrome.runtime.sendMessage({
    type: "SUBMISSION_ACCEPTED",
    data: submissionAccepted,
  });
});
