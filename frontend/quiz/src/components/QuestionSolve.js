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
  // 토큰 안전하게 가져오기
  // -----------------------------
  const getToken = () => {
    const token = localStorage.getItem("access");
    return token ? token : null;
  };


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

      setLiked(res.data.liked); // 상태 반영
    } catch (err) {
      console.log(err);
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
      navigate("/quizzes");

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
  // 문제 가져오기
  // -----------------------------
  const fetchQuestion = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8000/api/quizzes/questions/${id}/`
      );
      setQuestion(res.data);
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
      console.log("comments error:", err);
    }
  };

  // -----------------------------
  // 정답 제출 (핵심)
  // -----------------------------
  const submitAnswer = async () => {
    if (selected === null) {
      alert("답을 선택하세요");
      return;
    }

    const token = getToken();
    const config = token
      ? { headers: { Authorization: `Bearer ${token}` } }
      : {};

    try {
      const res = await axios.post(
        `http://localhost:8000/api/quizzes/questions/${id}/answer/`,
        { selected_answer: Number(selected) },
        config
      );

      setResult(res.data);
    } catch (err) {
      console.log("answer error:", err);
    }
  };

  // -----------------------------
  // 댓글 작성 (핵심)
  // -----------------------------
  const submitComment = async () => {
    if (!text.trim()) return;

    const token = getToken();
    if (!token) {
      alert("댓글 작성은 로그인이 필요합니다");
      return;
    }

    try {
      await axios.post(
        `http://localhost:8000/api/quizzes/questions/${id}/comments/`,
        { text },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setText("");
      fetchComments();
    } catch (err) {
      console.log("comment error:", err);
      if (err.response?.status === 401) {
        alert("로그인이 필요합니다");
      }
    }
  };

  // -----------------------------
  // 초기 로딩
  // -----------------------------
  useEffect(() => {
    fetchQuestion();
    fetchComments();
  }, [id]);

  if (!question) return <div>로딩중...</div>;

  return (
    <div style={{ width: "700px", margin: "30px auto" }}>
      {/* 문제 */}
      <h2>{question.title}</h2>
      <p>{question.question_text}</p>

      {/* 보기 */}
      <div style={{ marginTop: "20px" }}>
        {[1, 2, 3, 4].map((num) => {
          const choice = question[`choice${num}`];

          return (
            <div key={num} style={{ marginBottom: "10px" }}>
              <label>
                <input
                  type="radio"
                  name="choice"
                  value={num}
                  checked={Number(selected) === num}
                  onChange={() => setSelected(Number(num))}
                />
                {" " + choice}
              </label>
            </div>
          );
        })}
      </div>

      <button onClick={submitAnswer} style={{ marginTop: "10px" }}>
        정답 제출
      </button>

      <button onClick={() => deleteQuestion(question.id)}>
        게시글 삭제
      </button>

      {/* 결과 */}
      {result && (
        <div>
          {result.is_correct ? (
            <p style={{ color: "green" }}>정답입니다 🎉</p>
          ) : (
            <p style={{ color: "red" }}>
              틀렸습니다 (정답: {result.selected_answer})
            </p>
          )}
        </div>
      )}
      <button onClick={handleLike}>
        {liked ? "❤️ 좋아요 완료" : "🤍 좋아요"}
      </button>
      <hr />

      {/* 댓글 */}
      <h3>댓글</h3>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="댓글 입력"
        style={{ width: "100%", height: "80px" }}
      />

      <button onClick={submitComment} style={{ marginTop: "10px" }}>
        댓글 등록
      </button>

      <hr />

      {/* 댓글 리스트 */}
      {comments.length === 0 ? (
        <p>댓글이 없습니다.</p>
      ) : (
        comments.map((c) => (
          <div
            key={c.id}
            style={{
              padding: "10px",
              borderBottom: "1px solid #ddd",
            }}
          >
            <b>{c.author}</b>
            <p>{c.text}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default QuizDetail;