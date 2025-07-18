import React from "react";

export default function Options({ questions, dispatch, answer }) {
  const hasAnswered = answer !== null;
  return (
    <div className="options">
      {questions.options.map((option, i) => (
        <button
          disabled={hasAnswered}
          className={`btn btn-option ${i === answer ? "answer" : ""} ${
            hasAnswered
              ? i === questions.correctOption
                ? "correct"
                : "wrong"
              : ""
          } `}
          key={option}
          onClick={() => dispatch({ type: "newQuestion", payload: i })}
        >
          {option}{" "}
        </button>
      ))}
    </div>
  );
}
