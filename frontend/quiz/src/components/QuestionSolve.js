import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const QuestionSolve = () => {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const [selected, setSelected] = useState(null);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const fetchQuestion = async () => {
      const res = await axios.get(
        `http://127.0.0.1:8000/api/quizzes/questions/${id}/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
        }
      );

      setQuestion(res.data);
    };

    fetchQuestion();
  }, [id]);

  const submitAnswer = async () => {
    try {
      const res = await axios.post(
        `http://127.0.0.1:8000/api/quizzes/questions/${id}/answer/`,
        {
          selected_answer: selected,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
        }
      );

      setResult(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  if (!question) return <div>로딩중...</div>;

  return (
    <div>
      <h2>{question.title}</h2>
      <p>{question.question_text}</p>

      <div>
        <label>
          <input
            type="radio"
            name="answer"
            onChange={() => setSelected(1)}
          />
          {question.choice1}
        </label>

        <label>
          <input
            type="radio"
            name="answer"
            onChange={() => setSelected(2)}
          />
          {question.choice2}
        </label>

        <label>
          <input
            type="radio"
            name="answer"
            onChange={() => setSelected(3)}
          />
          {question.choice3}
        </label>

        <label>
          <input
            type="radio"
            name="answer"
            onChange={() => setSelected(4)}
          />
          {question.choice4}
        </label>
      </div>

      <button onClick={submitAnswer}>제출</button>

      {result && (
        <div>
          <h3>
            {result.is_correct ? "정답입니다 🎉" : "틀렸습니다 ❌"}
          </h3>
        </div>
      )}
    </div>
  );
};

export default QuestionSolve;