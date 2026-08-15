const originalFetch = window.fetch;

let submission = null;

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
  return response;
};
