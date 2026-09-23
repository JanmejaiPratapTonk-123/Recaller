import { useState } from "react";

function RecallCard({ submissions }) {
  const [showCode, setShowCode] = useState(false);

  const submission = submissions[0];

  return (
    <div>
      <h2>You solved this problem before!</h2>
      <p>Language: {submission?.language}</p>
      <p>Total submissions: {submissions.length}</p>
      <button onClick={() => setShowCode(true)}>Recall solution</button>
      {showCode && <pre>{submission?.code}</pre>}
    </div>
  );
}

export default RecallCard;
