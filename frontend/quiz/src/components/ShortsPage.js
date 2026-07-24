import React, { useEffect, useState } from "react";
import axios from "axios";

const ShortsPage = () => {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8000/api/quizzes/questions/shorts/"
      );

      // pagination 사용하는 경우
      if (res.data.results) {
        setQuestions(res.data.results);
      } else {
        setQuestions(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  if (loading) {
    return <h2 style={{ textAlign: "center" }}>불러오는 중...</h2>;
  }

  if (questions.length === 0) {
    return <h2 style={{ textAlign: "center" }}>문제가 없습니다.</h2>;
  }

  const question = questions[currentIndex];

  return (
    <div
      style={{
        maxWidth: "500px",
        margin: "0 auto",
        padding: "20px",
      }}
    >
      <h2>{question.title}</h2>

      <p>
        작성자 : <b>{question.author}</b>
      </p>

      {question.image && (
        <img
          src={question.image}
          alt={question.title}
          style={{
            width: "100%",
            borderRadius: "10px",
            marginBottom: "20px",
          }}
        />
      )}

      {question.video && (
        <video
          src={question.video}
          controls
          style={{
            width: "100%",
            marginBottom: "20px",
          }}
        />
      )}

      {question.video_url && (
        <iframe
          title="youtube"
          width="100%"
          height="300"
          src={question.video_url.replace("watch?v=", "embed/")}
          allowFullScreen
        />
      )}

      <h3>{question.question_text}</h3>

      <div
        style={{
          display: "grid",
          gap: "10px",
          marginTop: "20px",
        }}
      >
        <button>{question.choice1}</button>

        <button>{question.choice2}</button>

        <button>{question.choice3}</button>

        <button>{question.choice4}</button>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "30px",
        }}
      >
        <button
          onClick={prevQuestion}
          disabled={currentIndex === 0}
        >
          이전
        </button>

        <span>
          {currentIndex + 1} / {questions.length}
        </span>

        <button
          onClick={nextQuestion}
          disabled={currentIndex === questions.length - 1}
        >
          다음
        </button>
      </div>
    </div>
  );
};

export default ShortsPage;