import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./css/Quizzes.css";

const Quizzes = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [error, setError] = useState(null);

  // =========================
  // 구조화된 Quiz 생성 state
  // =========================
  const [newQuiz, setNewQuiz] = useState({
    title: "",
    description: "",
    questions: [
      {
        text: "",
        answer_type: "multiple",
        choices: [
          { text: "", is_correct: true },
          { text: "", is_correct: false },
        ],
      },
    ],
  });

  // =========================
  // GET (전체 조회)
  // =========================
  useEffect(() => {
    fetch("http://localhost:8000/api/quizzes/quiz/")
      .then((res) => res.json())
      .then((data) => {
        const list = Array.isArray(data) ? data : data?.results || [];
        setQuizzes(list);
      })
      .catch(() => setError("퀴즈 목록 로딩 실패"));
  }, []);

  // =========================
  // POST (JWT 인증 필요)
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("access");

    if (!token) {
      setError("로그인이 필요합니다.");
      return;
    }

    try {
      const res = await fetch(
        "http://localhost:8000/api/quizzes/quiz/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newQuiz),
        }
      );

      if (!res.ok) {
        const text = await res.text();
        console.log("ERROR:", text);
        throw new Error("생성 실패");
      }

      const data = await res.json();

      setQuizzes((prev) => [data, ...prev]);

      // reset
      setNewQuiz({
        title: "",
        description: "",
        questions: [
          {
            text: "",
            answer_type: "multiple",
            choices: [
              { text: "", is_correct: true },
              { text: "", is_correct: false },
            ],
          },
        ],
      });

      setError(null);
    } catch (err) {
      setError("퀴즈 생성 실패");
    }
  };

  // =========================
  // UI
  // =========================
  return (
    <div className="quiz-container">
      <h1>퀴즈 게시판</h1>

      {/* ================= FORM ================= */}
      <form onSubmit={handleSubmit}>
        <input
          placeholder="제목"
          value={newQuiz.title}
          onChange={(e) =>
            setNewQuiz({ ...newQuiz, title: e.target.value })
          }
        />

        <textarea
          placeholder="설명"
          value={newQuiz.description}
          onChange={(e) =>
            setNewQuiz({
              ...newQuiz,
              description: e.target.value,
            })
          }
        />

        {/* ================= QUESTION ================= */}
        <input
          placeholder="문제"
          value={newQuiz.questions[0].text}
          onChange={(e) => {
            const updated = { ...newQuiz };
            updated.questions[0].text = e.target.value;
            setNewQuiz(updated);
          }}
        />

        {/* ================= CHOICES ================= */}
        {newQuiz.questions[0].choices.map((c, idx) => (
          <div key={idx}>
            <input
              placeholder={`선택지 ${idx + 1}`}
              value={c.text}
              onChange={(e) => {
                const updated = { ...newQuiz };
                updated.questions[0].choices[idx].text =
                  e.target.value;
                setNewQuiz(updated);
              }}
            />

            <label>
              <input
                type="radio"
                checked={c.is_correct}
                onChange={() => {
                  const updated = { ...newQuiz };

                  updated.questions[0].choices.forEach(
                    (ch, i) => {
                      ch.is_correct = i === idx;
                    }
                  );

                  setNewQuiz(updated);
                }}
              />
              정답
            </label>
          </div>
        ))}

        <button type="submit">퀴즈 생성</button>
      </form>

      {/* ================= ERROR ================= */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <hr />

      {/* ================= LIST ================= */}
      <h2>퀴즈 목록</h2>

      {quizzes.length === 0 ? (
        <p>등록된 퀴즈가 없습니다.</p>
      ) : (
        <ul>
          {quizzes.map((quiz) => (
            <li key={quiz.id}>
              <Link to={`/quizzes/${quiz.id}`}>
                {quiz.title}
              </Link>

              <p>{quiz.description}</p>

              <small>
                {quiz.author ? quiz.author : "익명"}
              </small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Quizzes;