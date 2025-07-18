import React, { useEffect, useReducer } from "react";
import Header from "./Header";
import Box from "./Box";
import Loader from "./Loader";
import Error from "./Error";
import StartScreen from "./StartScreen";
import Questions from "./Questions";
import NextQuestion from "./components/NextQuestion";
import Progress from "./components/Progress";
import FinishScreen from "./components/FinishScreen";
import Footer from "./Footer";
import Timer from "./Timer";
const SEC_PER_QUES = 30;
const initialState = {
  questions: [],
  status: "loading",
  index: 0,
  answer: null,
  points: 0,
  highscore: JSON.parse(localStorage.getItem("score")) || 0,
  secondsRemaining: null,
};
function reducer(state, action) {
  switch (action.type) {
    case "dataRecieved":
      return { ...state, questions: action.payload, status: "ready" };
    case "dataFailed":
      return { ...state, status: "error" };
    case "start":
      return {
        ...state,
        status: "active",
        secondsRemaining: state.questions.length * SEC_PER_QUES,
      };
    case "newQuestion": {
      const question = state.questions.at(state.index);
      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === question.correctOption
            ? state.points + question.points
            : state.points,
      };
    }
    case "reset":
      return { ...initialState, questions: state.questions, status: "ready" };
    case "nextQuestion":
      return { ...state, index: state.index + 1, answer: null };
    case "finish": {
      const score =
        state.highscore > state.points ? state.highscore : state.points;
      localStorage.setItem("score", JSON.stringify(score));
      return {
        ...state,
        status: "finished",
        highscore: score,
      };
    }
    case "tick":
      return {
        ...state,
        secondsRemaining: state.secondsRemaining - 1,
        status: state.secondsRemaining === 0 ? "finished" : state.status,
      };
    default:
      throw new Error("action is unknown" + action.type);
  }
}
export default function App() {
  const [
    { questions, status, index, answer, points, highscore, secondsRemaining },
    dispatch,
  ] = useReducer(reducer, initialState);
  const numQuestions = questions.length;
  const maxPoints = questions.reduce((prev, cur) => prev + cur.points, 0);
  useEffect(function () {
    fetch("http://localhost:8000/questions")
      .then((res) => res.json())
      .then((data) => dispatch({ type: "dataRecieved", payload: data }))
      .catch(() => dispatch({ type: "dataFailed" }));
  }, []);
  return (
    <div className="app">
      <Header />
      <Box>
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && (
          <StartScreen numQuestions={numQuestions} dispatch={dispatch} />
        )}
        {status === "active" && (
          <>
            <Progress
              numQuestions={numQuestions}
              index={index}
              points={points}
              maxPoints={maxPoints}
              answer={answer}
            />
            <Questions
              questions={questions[index]}
              dispatch={dispatch}
              answer={answer}
            />
            <Footer>
              <Timer dispatch={dispatch} secondsRemaining={secondsRemaining} />
              <NextQuestion
                answer={answer}
                dispatch={dispatch}
                numQuestions={numQuestions}
                index={index}
              />
            </Footer>
          </>
        )}
        {status === "finished" && (
          <FinishScreen
            maxPosiblePoints={maxPoints}
            points={points}
            highscore={highscore}
            dispatch={dispatch}
          />
        )}
      </Box>
    </div>
  );
}
