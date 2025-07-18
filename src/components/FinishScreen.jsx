import React from "react";

export default function FinishScreen({
  points,
  maxPosiblePoints,
  highscore,
  dispatch,
}) {
  const percentage = (points / maxPosiblePoints) * 100;
  let emoji;
  if (percentage === 100) emoji = "🎉";
  if (50 < percentage < 80) emoji = "⭐";
  if (25 < percentage < 50) emoji = "🤦‍♂️";
  if (0 < percentage < 25) emoji = "😱";
  if (percentage === 0) emoji = "😡";

  return (
    <>
      <p className="result">
        <span>{emoji}</span> You scored <strong>{points}</strong> out of{" "}
        {maxPosiblePoints}({Math.ceil(percentage)}%)
      </p>
      <p className="highscore">(highscore: {highscore} points)</p>
      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: "reset" })}
      >
        restart
      </button>
    </>
  );
}
