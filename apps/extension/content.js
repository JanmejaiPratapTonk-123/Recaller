console.log("Recaller content script loaded!");

function extractQuestion() {
  const path = window.location.pathname;
  const problem = path.split("/");

  // Title
  const titleElement = document.querySelector(
    `a[href="/problems/${problem[2]}/"]`,
  );

  // Difficulty
  const difficultyElement = document.querySelector('[class*="difficulty-"]');

  // Description
  const descriptionElement = document.querySelector(
    `[data-track-load="description_content"]`,
  );

  const slug = problem[2];

  const title = titleElement?.textContent?.trim();
  const difficulty = difficultyElement?.textContent?.trim();
  const description = descriptionElement?.innerText?.trim();

  return {
    title,
    difficulty,
    description,
    slug,
  };
}

window.addEventListener("submissionAccepted", (event) => {
  console.log("Submission Accepted Event Detected!");

  const question = extractQuestion();

  console.log("Current question:", question);

  const submissionAccepted = {
    submissionId: event.detail.submissionId,
    language: event.detail.language,
    questionId: event.detail.questionId,
    code: event.detail.code,

    title: question.title,
    difficulty: question.difficulty,
    description: question.description,
    slug: question.slug,

    url: `https://leetcode.com/problems/${question.slug}/`,
  };

  console.log("Final submission:", submissionAccepted);

  chrome.runtime.sendMessage({
    type: "SUBMISSION_ACCEPTED",
    data: submissionAccepted,
  });
});

const question = extractQuestion();

chrome.runtime.sendMessage(
  {
    type: "GET_SUBMISSIONS_BY_SLUG",
    data: question.slug,
  },
  (submissions) => {
    console.log("Previous submisssions:", submissions);
  },
);
