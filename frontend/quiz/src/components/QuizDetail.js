import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const QuizDetail = () => {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:8000/api/quizzes/quiz/${id}/`)
      .then((res) => res.json())
      .then(setQuiz);
  }, [id]);

  const checkAnswer = (choice) => {
    if (choice.is_correct) {
      alert("정답!");
    } else {
      alert("틀림!");
    }
  };

  if (!quiz) return <div>loading...</div>;

  return (
    <div>
      <h1>{quiz.title}</h1>
      <p>{quiz.description}</p>

      {quiz.questions.map((q) => (
        <div key={q.id}>
          <h3>{q.text}</h3>

          {q.choices.map((c) => (
            <button key={c.id} onClick={() => checkAnswer(c)}>
              {c.text}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
};

export default QuizDetail;