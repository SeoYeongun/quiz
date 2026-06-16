import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import api from "./api";


const QuestionList = () => {
  const [questions, setQuestions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await api.get(
          "http://127.0.0.1:8000/api/quizzes/questions/",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access")}`,
            },
          }
        );

        setQuestions(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchQuestions();
  }, []);

  return (
    <div>
      <h2>문제 목록</h2>

      {questions.map((q) => (
        <div key={q.id} style={{ border: "1px solid #ddd", margin: 10, padding: 10 }}>
          <h3>{q.title}</h3>
          <p>{q.question_text}</p>

          <button onClick={() => navigate(`/solve/${q.id}`)}>
            문제 풀기
          </button>
        </div>
      ))}
    </div>
  );
};

export default QuestionList;