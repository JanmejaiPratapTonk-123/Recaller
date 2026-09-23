import { useEffect, useState } from "react";
import RecallCard from "./components/RecallCard";

function App() {
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    const path = window.location.pathname;
    const problem = path.split("/");
    const slug = problem[2];

    chrome.runtime.sendMessage(
      {
        type: "GET_SUBMISSIONS_BY_SLUG",
        data: slug,
      },
      (submissions) => {
        setSubmissions(submissions);
      },
    );
  }, []);

  return <RecallCard submissions={submissions} />;
}

export default App;
