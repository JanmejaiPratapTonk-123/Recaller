const originalFetch = window.fetch;

let submission = null;
let currentQuestion = null;
let acceptedSubmission = null;

window.fetch = async function (...args) {
  const url = args[0];

  if (typeof url === "string" && url.includes("/submit/")) {
    const object = JSON.parse(args[1]?.body);

    submission = {
      language: object.lang,
      questionId: object.question_id,
      code: object.typed_code,
    };
  }

  const response = await originalFetch.apply(this, args);

  if (typeof url === "string" && url.includes("/submit/")) {
    const clonedResponse = response.clone();

    clonedResponse.json().then((data) => {
      submission.submissionId = data.submission_id;
    });
  }

  if (
    typeof url === "string" &&
    url.includes("/submissions/detail/") &&
    url.includes("/check/")
  ) {
    const clonedResponse = response.clone();

    clonedResponse.json().then((data) => {
      if (
        data.finished === true &&
        data.status_msg === "Accepted" &&
        submission &&
        String(submission.submissionId) === String(data.submission_id)
      ) {
        const event = new CustomEvent("submissionAccepted", {
          detail: submission,
        });
        window.dispatchEvent(event);
      }
    });
  }

  const body = args[1]?.body;

  return response;
};

const originalOpen = XMLHttpRequest.prototype.open;

XMLHttpRequest.prototype.open = function (method, url, ...args) {
  return originalOpen.call(this, method, url, ...args);
};

const originalSend = XMLHttpRequest.prototype.send;

XMLHttpRequest.prototype.send = function (body) {
  if (typeof body === "string" && body.includes("questionDetail")) {
    this.addEventListener("load", async function () {
      try {
        let text;

        if (this.responseType === "blob") {
          text = await this.response.text();
        } else if (this.responseType === "" || this.responseType === "text") {
          text = this.responseText;
        } else {
          return;
        }

        const data = JSON.parse(text);

        const question = data?.data?.question;

        if (question) {
          currentQuestion = {
            id: question.questionId,
            number: question.questionFrontendId,
            title: question.questionTitle,
            slug: question.titleSlug,
            difficulty: question.difficulty,
            content: question.content,
            topics: question.topicTags,
            hints: question.hints,
            examples: question.exampleTestcaseList,
          };

          console.log("CURRENT QUESTION:", currentQuestion);
        }
      } catch (error) {
        console.error("QUESTION DETAIL RESPONSE ERROR:", error);
      }
    });
  }

  return originalSend.call(this, body);
};

function processAcceptedSubmission() {
  if (!currentQuestion || !acceptedSubmission) {
    return;
  }

  const result = {
    question: currentQuestion,
    submission: acceptedSubmission,
  };

  console.log("===== ACCEPTED SOLUTION =====");
  console.log(result);
}

window.addEventListener("submissionAccepted", (event) => {
  acceptedSubmission = event.detail;

  processAcceptedSubmission();
});
