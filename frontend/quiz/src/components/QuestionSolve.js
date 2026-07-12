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

  const [showComments, setShowComments] = useState(false);

  // -----------------------------
  // token
  // -----------------------------
  const getToken = () => {
    return localStorage.getItem("access");
  };

  const getYoutubeEmbedUrl = (url) => {
    if (!url) return null;

    // https://youtu.be/xxxx
    if (url.includes("youtu.be/")) {
      const videoId = url.split("youtu.be/")[1].split("?")[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }

    // https://www.youtube.com/watch?v=xxxx
    if (url.includes("watch?v=")) {
      const videoId = url.split("watch?v=")[1].split("&")[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }

    return null;
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

  //신고하기
  const reportQuestion = async () => {
    const token = localStorage.getItem("access");

    try {
      const res = await axios.post(
        `http://localhost:8000/api/quizzes/questions/${id}/report/`,
        {
          reason: "spam",
          description: "광고성 게시글입니다."
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert("신고되었습니다.");
      console.log(res.data);
    } catch (error) {
      console.log(error.response);
      console.log(error.response?.data);
      alert(JSON.stringify(error.response?.data));
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

  const likeComment = async (commentId) => {
      const token = localStorage.getItem("access");

      const res = await axios.post(
          `http://localhost:8000/api/quizzes/questions/${id}/comments/${commentId}/like/`,
          {},
          {
              headers: {
                  Authorization: `Bearer ${token}`,
              },
          }
      );

      setComments((prev) =>
          prev.map((comment) =>
              comment.id === commentId
                  ? {
                        ...comment,
                        liked: res.data.liked,
                        like_count: res.data.like_count,
                    }
                  : comment
          )
      );
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

      {/* 이미지 */}
      {question.image && (
        <div style={{ margin: "20px 0" }}>
          <img
            src={question.image}
            alt="문제 이미지"
            style={{
              maxWidth: "100%",
              maxHeight: "500px",
              borderRadius: "8px",
            }}
          />
        </div>
      )}

      {/* 유튜브 영상 */}
      {question.video_url && (
        <div style={{ margin: "20px 0" }}>
          <iframe
            width="100%"
            height="450"
            src={getYoutubeEmbedUrl(question.video_url)}
            title="YouTube video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{
              borderRadius: "8px",
            }}
          />
        </div>
      )}

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

      {question.is_owner && (
        <div
          style={{
            display: "flex",
            gap: "10px",
            marginTop: "10px",
            marginBottom: "10px",
          }}
        >
          <button
            onClick={() => navigate(`/questions/${question.id}/edit`)}
          >
            ✏️ 편집하기
          </button>

          <button
            onClick={() => deleteQuestion(question.id)}
          >
            🗑 게시글 삭제
          </button>
        </div>
      )}

      {/* 결과 */}
      {result && (
        <div>
          {result.is_correct ? (
            <p style={{ color: "green" }}>정답!</p>
          ) : (
            <p style={{ color: "red" }}>
              틀림!
            </p>
          )}
        </div>
      )}

      {/* 좋아요 */}
      <button onClick={handleLike}>
        {liked ? "❤️ 좋아요 완료" : "🤍 좋아요"}
      </button>

      <span>좋아요 {question.like_count}개</span>

      <button
        color="error"
        onClick={reportQuestion}
      >
    🚨 신고하기
      </button>
      <hr />

      <button
        onClick={() => setShowComments(!showComments)}
        style={{
          marginTop: "20px",
          marginBottom: "15px",
        }}
      >
        {showComments ? "댓글 가리기 ▲" : `댓글 보기 (${comments.length}) ▼`}
      </button>

{showComments && (
  <>
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
    {comments.length === 0 ? (
      <p>아직 댓글이 없습니다.</p>
    ) : (
      comments.map((c) => (
        <div key={c.id} style={{ marginBottom: "15px" }}>
          <b>{c.author}</b>
          <p>{c.text}</p>

          <div
            style={{
              display: "flex",
              gap: "10px",
              alignItems: "center",
            }}
          >
            <button onClick={() => likeComment(c.id)}>
              {c.liked ? "❤️" : "🤍"} {c.like_count}
            </button>

            <button onClick={() => deleteComment(c.id)}>
              삭제
            </button>
          </div>
        </div>
      ))
    )}
  </>
)}
    </div>
  );
};

export default QuizDetail;