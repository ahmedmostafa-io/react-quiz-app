import React from "react";

export default function Progress({
  index,
  numQuestions,
  points,
  maxPoints,
  answer,
}) {
  return (
    <>
      <header className="progress">
        <progress
          max={numQuestions - 1}
          value={index + Number(answer !== null)}
        ></progress>
        <p>
          {" "}
          Quetions <strong>{index + 1} /</strong> {numQuestions}
        </p>
        <p>
          {" "}
          <strong>{points}</strong> / {maxPoints}
        </p>
      </header>
    </>
  );
}
