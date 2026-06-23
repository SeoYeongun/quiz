import React, { useEffect, useState } from "react";
import axios from "axios";
import api from "../hooks/axios";
import { useNavigate } from "react-router-dom";

const QuestionList = () => {
  const [questions, setQuestions] = useState([]);
  const navigate = useNavigate();

  // -----------------------------
  // 문제 리스트 가져오기
  // -----------------------------
  const fetchQuestions = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/quizzes/questions/");
      setQuestions(res.data);
    } catch (err) {
      console.log("Question list error:", err);

      if (err.response) {
        console.log(err.response.data);
      }
    }
  };

  const deleteQuestion = async (id) => {
  const ok = window.confirm("정말 삭제하시겠습니까?");

  if (!ok) return;

  try {
    await axios.delete(
      `http://localhost:8000/api/quizzes/questions/${id}/`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
      }
    );

    alert("삭제되었습니다.");

    // 목록 새로 불러오기
    fetchQuestions();

    // 또는 상세페이지라면
    // navigate("/questions");
  } catch (err) {
    console.error(err);

    if (err.response?.status === 403) {
      alert("본인이 작성한 게시글만 삭제할 수 있습니다.");
    } else {
      alert("삭제에 실패했습니다.");
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
            <p>❤️ {q.like_count} likes</p>
          </div>
        ))
      )}
    </div>
  );
};

export default QuestionList;