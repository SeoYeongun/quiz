import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const QuestionEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    title: "",
    question_text: "",
    image: null,
    video: null,
    choice1: "",
    choice2: "",
    choice3: "",
    choice4: "",
    correct_answer: 1,
  });

  const [previewImage, setPreviewImage] = useState("");
  const [previewVideo, setPreviewVideo] = useState("");

  // -----------------------------
  // 기존 게시글 불러오기
  // -----------------------------
  useEffect(() => {
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

        setFormData({
          title: res.data.title,
          question_text: res.data.question_text,
          image: null,
          video: null,
          choice1: res.data.choice1,
          choice2: res.data.choice2,
          choice3: res.data.choice3,
          choice4: res.data.choice4,
          correct_answer: res.data.correct_answer,
        });

        setPreviewImage(res.data.image);
        setPreviewVideo(res.data.video);

      } catch (err) {
        console.log(err);
      }
    };

    fetchQuestion();
  }, [id]);

  // -----------------------------
  // 입력 변경
  // -----------------------------
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      setFormData((prev) => ({
        ...prev,
        image: files[0],
      }));

      if (files[0]) {
        setPreviewImage(URL.createObjectURL(files[0]));
      }

      return;
    }

    if (name === "video") {
      setFormData((prev) => ({
        ...prev,
        video: files[0],
      }));

      if (files[0]) {
        setPreviewVideo(URL.createObjectURL(files[0]));
      }

      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "correct_answer"
          ? Number(value)
          : value,
    }));
  };

  // -----------------------------
  // 수정
  // -----------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("access");

    const data = new FormData();

    data.append("title", formData.title);
    data.append("question_text", formData.question_text);
    data.append("choice1", formData.choice1);
    data.append("choice2", formData.choice2);
    data.append("choice3", formData.choice3);
    data.append("choice4", formData.choice4);
    data.append("correct_answer", formData.correct_answer);

    if (formData.image) {
      data.append("image", formData.image);
    }

    if (formData.video) {
      data.append("video", formData.video);
    }

    try {
      await axios.put(
        `http://localhost:8000/api/quizzes/questions/${id}/`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("수정되었습니다.");

      navigate(`/solve/${id}`);

    } catch (err) {
      console.log(err);

      if (err.response) {
        console.log(err.response.data);
      }

      alert("수정 실패");
    }
  };

  return (
    <div
      style={{
        width: "700px",
        margin: "30px auto",
      }}
    >
      <h2>문제 수정</h2>

      <form onSubmit={handleSubmit}>

        <input
          type="text"
          name="title"
          placeholder="제목"
          value={formData.title}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <textarea
          name="question_text"
          placeholder="문제 내용"
          value={formData.question_text}
          onChange={handleChange}
          required
          style={styles.textarea}
        />

        {previewImage && (
          <img
            src={previewImage}
            alt=""
            style={{
              width: "100%",
              marginBottom: "15px",
            }}
          />
        )}

        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
          style={styles.input}
        />

        {previewVideo && (
          <video
            controls
            style={{
              width: "100%",
              marginBottom: "15px",
            }}
          >
            <source src={previewVideo} />
          </video>
        )}

        <input
          type="file"
          name="video"
          accept="video/*"
          onChange={handleChange}
          style={styles.input}
        />

        <input
          type="text"
          name="choice1"
          value={formData.choice1}
          onChange={handleChange}
          placeholder="보기 1"
          required
          style={styles.input}
        />

        <input
          type="text"
          name="choice2"
          value={formData.choice2}
          onChange={handleChange}
          placeholder="보기 2"
          required
          style={styles.input}
        />

        <input
          type="text"
          name="choice3"
          value={formData.choice3}
          onChange={handleChange}
          placeholder="보기 3"
          required
          style={styles.input}
        />

        <input
          type="text"
          name="choice4"
          value={formData.choice4}
          onChange={handleChange}
          placeholder="보기 4"
          required
          style={styles.input}
        />

        <div style={{ marginBottom: "20px" }}>
          <label>정답</label>

          <select
            name="correct_answer"
            value={formData.correct_answer}
            onChange={handleChange}
            style={styles.select}
          >
            <option value={1}>1번</option>
            <option value={2}>2번</option>
            <option value={3}>3번</option>
            <option value={4}>4번</option>
          </select>
        </div>

        <button
          type="submit"
          style={styles.button}
        >
          수정 완료
        </button>

      </form>
    </div>
  );
};

const styles = {
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "15px",
    fontSize: "16px",
  },

  textarea: {
    width: "100%",
    height: "120px",
    padding: "10px",
    marginBottom: "15px",
    fontSize: "16px",
  },

  select: {
    width: "100%",
    padding: "10px",
    marginTop: "10px",
    fontSize: "16px",
  },

  button: {
    padding: "10px 25px",
    fontSize: "16px",
    cursor: "pointer",
  },
};

export default QuestionEdit;