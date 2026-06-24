import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const QuizDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [liked, setLiked] = useState(false);
  const [question, setQuestion] = useState(null);
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");

  const [selected, setSelected] = useState(null);
  const [result, setResult] = useState(null);

  // -----------------------------
  // token
  // -----------------------------
  const getToken = () => {
    return localStorage.getItem("access");
  };

  // -----------------------------
  // 문제 가져오기
  // -----------------------------
  const fetchQuestion = async () => {
    const token = localStorage.getItem("access");

    try {
      const res = await axios.get(
        `http://localhost:8000/api/quizzes/questions/${id}/`,
        {
          headers: token
            ? { Authorization: `Bearer ${token}` }
            : {},
        }
      );

      setQuestion(res.data);
      setLiked(res.data.liked);
    } catch (err) {
      console.log("question error:", err);
    }
  };

  // -----------------------------
  // 댓글 가져오기
  // -----------------------------
  const fetchComments = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8000/api/quizzes/questions/${id}/comments/`
      );

      setComments(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // -----------------------------
  // 좋아요
  // -----------------------------
  const handleLike = async () => {
    const token = localStorage.getItem("access");

    try {
      const res = await axios.post(
        `http://localhost:8000/api/quizzes/questions/${id}/like/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setLiked(res.data.liked);

      setQuestion((prev) => ({
        ...prev,
        like_count: res.data.like_count ?? prev.like_count,
      }));
    } catch (err) {
      console.log(err);
    }
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
      navigate("/quizzes");
    } catch (err) {
      console.log(err);
    }
  };

  // -----------------------------
  // 댓글 삭제
  // -----------------------------
  const deleteComment = async (commentId) => {
    const token = localStorage.getItem("access");

    try {
      await axios.delete(
        `http://localhost:8000/api/quizzes/questions/${id}/comments/`,
        {
          data: { comment_id: commentId },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchComments();
    } catch (err) {
      console.log(err);
      alert("삭제 실패");
    }
  };

  // -----------------------------
  // 정답 제출
  // -----------------------------
  const submitAnswer = async () => {
    if (selected === null) {
      alert("답을 선택하세요");
      return;
    }

    const token = getToken();

    try {
      const res = await axios.post(
        `http://localhost:8000/api/quizzes/questions/${id}/answer/`,
        { selected_answer: Number(selected) },
        {
          headers: token
            ? { Authorization: `Bearer ${token}` }
            : {},
        }
      );

      setResult(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // -----------------------------
  // 댓글 작성
  // -----------------------------
  const submitComment = async () => {
    if (!text.trim()) return;

    const token = getToken();
    if (!token) {
      alert("로그인이 필요합니다");
      return;
    }

    try {
      await axios.post(
        `http://localhost:8000/api/quizzes/questions/${id}/comments/`,
        { text },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setText("");
      fetchComments();
    } catch (err) {
      console.log(err);
    }
  };

  // -----------------------------
  // init
  // -----------------------------
  useEffect(() => {
    fetchQuestion();
    fetchComments();
  }, [id]);

  if (!question) return <div>로딩중...</div>;

  return (
    <div style={{ width: "700px", margin: "30px auto" }}>
      {/* 목록 */}
      <button onClick={() => navigate("/quizzes")}>
        ← 목록으로
      </button>

      {/* 문제 */}
      <h2>{question.title}</h2>
      <p>{question.question_text}</p>

      {/* 선택지 */}
      <div>
        {[1, 2, 3, 4].map((num) => (
          <div key={num}>
            <label>
              <input
                type="radio"
                value={num}
                checked={Number(selected) === num}
                onChange={() => setSelected(num)}
              />
              {question[`choice${num}`]}
            </label>
          </div>
        ))}
      </div>

      <button onClick={submitAnswer}>정답 제출</button>

      <button onClick={() => deleteQuestion(question.id)}>
        게시글 삭제
      </button>

      {/* 결과 */}
      {result && (
        <div>
          {result.is_correct ? (
            <p style={{ color: "green" }}>정답!</p>
          ) : (
            <p style={{ color: "red" }}>
              틀림 (정답: {result.selected_answer})
            </p>
          )}
        </div>
      )}

      {/* 좋아요 */}
      <button onClick={handleLike}>
        {liked ? "❤️ 좋아요 완료" : "🤍 좋아요"}
      </button>

      <span>좋아요 {question.like_count}개</span>

      <hr />

      {/* 댓글 작성 */}
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="댓글 입력"
      />

      <button onClick={submitComment}>댓글 등록</button>

      <hr />

      {/* 댓글 목록 */}
      {comments.map((c) => (
        <div key={c.id}>
          <b>{c.author}</b>
          <p>{c.text}</p>

          <button onClick={() => deleteComment(c.id)}>
            삭제
          </button>
        </div>
      ))}
    </div>
  );
};

export default QuizDetail;