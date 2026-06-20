import React, { useEffect, useState } from "react";
import api from "./api";
import { useNavigate } from "react-router-dom";

const QuestionList = () => {
  const [questions, setQuestions] = useState([]);
  const navigate = useNavigate();

  // -----------------------------
  // 문제 리스트 가져오기
  // -----------------------------
  const fetchQuestions = async () => {
    try {
      const res = await api.get("quizzes/questions/");
      setQuestions(res.data);
    } catch (err) {
      console.log("Question list error:", err);

      if (err.response) {
        console.log(err.response.data);
      }
    }
  };

  // -----------------------------
  // 초기 로딩
  // -----------------------------
  useEffect(() => {
    fetchQuestions();
  }, []);

  return (
    <div style={{ width: "700px", margin: "30px auto" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h2 style={{ margin: 0 }}>퀴즈 목록</h2>
        <button
          onClick={() => navigate("/questions")}
          style={{
            padding: "8px 16px",
            cursor: "pointer",
            borderRadius: "6px",
            border: "1px solid #ddd",
            backgroundColor: "#fff",
          }}
        >
          문제 생성
        </button>
      </div>

      {questions.length === 0 ? (
        <p>문제가 없습니다.</p>
      ) : (
        questions.map((q) => (
          <div
            key={q.id}
            onClick={() => navigate(`/solve/${q.id}`)}
            style={{
              padding: "15px",
              border: "1px solid #ddd",
              marginBottom: "10px",
              cursor: "pointer",
              borderRadius: "6px",
            }}
          >
            <h3>{q.title}</h3>
            <p>{q.question_text}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default QuestionList;