import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const QuestionList = () => {
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // -----------------------------
  // 문제 리스트 가져오기
  // -----------------------------
  const fetchQuestions = async (pageNumber = 1) => {
    try {
      const res = await axios.get(
        `http://localhost:8000/api/quizzes/questions/?page=${pageNumber}`
      );

      setQuestions(res.data.results);
      setPage(pageNumber);
      setTotalPages(Math.ceil(res.data.count / 20));
    } catch (err) {
      console.log("Question list error:", err);

      if (err.response) {
        console.log(err.response.data);
      }
    }
  };

  // -----------------------------
  // 로그아웃
  // -----------------------------
  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");

    setIsLoggedIn(false);

    alert("로그아웃되었습니다.");

    navigate("/login");
  };

  // -----------------------------
  // 게시글 삭제
  // -----------------------------
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

      fetchQuestions(page);
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

    const token = localStorage.getItem("access");
    setIsLoggedIn(!!token);
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

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={() => navigate("/questions")}
            style={{
              padding: "8px 16px",
              cursor: "pointer",
            }}
          >
            문제 생성
          </button>

          <button onClick={() => navigate("/profile")}>
            프로필
          </button>

          {isLoggedIn ? (
            <button onClick={logout}>
              로그아웃
            </button>
          ) : (
            <button onClick={() => navigate("/login")}>
              로그인
            </button>
          )}
        </div>
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

      {/* 페이지 번호 */}
      <div
        style={{
          marginTop: "30px",
          display: "flex",
          justifyContent: "center",
          gap: "5px",
        }}
      >
        <button
          disabled={page === 1}
          onClick={() => fetchQuestions(page - 1)}
        >
          이전
        </button>

        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => fetchQuestions(i + 1)}
            style={{
              fontWeight: page === i + 1 ? "bold" : "normal",
              backgroundColor: page === i + 1 ? "#0d6efd" : "white",
              color: page === i + 1 ? "white" : "black",
              border: "1px solid #ccc",
              padding: "5px 10px",
            }}
          >
            {i + 1}
          </button>
        ))}

        <button
          disabled={page === totalPages}
          onClick={() => fetchQuestions(page + 1)}
        >
          다음
        </button>
      </div>
    </div>
  );
};

export default QuestionList;