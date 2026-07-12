import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Questions = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    question_text: "",
    image: null,
    video_url: "",
    choice1: "",
    choice2: "",
    choice3: "",
    choice4: "",
    correct_answer: 1,
  });

  // 입력값 변경
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "image"
          ? files[0]
          : name === "correct_answer"
          ? Number(value)
          : value,
    }));
  };

  // 등록
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

    if (formData.video_url.trim() !== "") {
      data.append("video_url", formData.video_url);
    }

    try {
      const res = await axios.post(
        "http://localhost:8000/api/quizzes/questions/",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("문제가 등록되었습니다.");

      navigate(`/solve/${res.data.id}`);
    } catch (err) {
      console.error(err);

      if (err.response) {
        console.log(err.response.data);
      }

      alert("등록 실패");
    }
  };

  return (
    <div
      style={{
        width: "700px",
        margin: "30px auto",
      }}
    >
      <h2>문제 등록</h2>

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
          placeholder="문제 내용을 입력하세요."
          value={formData.question_text}
          onChange={handleChange}
          required
          style={styles.textarea}
        />

        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
          style={styles.input}
        />

        <input
          type="url"
          name="video_url"
          placeholder="유튜브 URL (선택)"
          value={formData.video_url}
          onChange={handleChange}
          style={styles.input}
        />

        <p
          style={{
            color: "#666",
            fontSize: "14px",
            marginTop: "-10px",
            marginBottom: "15px",
          }}
        >
          지원 형식:
          <br />
          • https://youtu.be/...
          <br />
          • https://www.youtube.com/watch?v=...
        </p>

        <input
          type="text"
          name="choice1"
          placeholder="보기 1"
          value={formData.choice1}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <input
          type="text"
          name="choice2"
          placeholder="보기 2"
          value={formData.choice2}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <input
          type="text"
          name="choice3"
          placeholder="보기 3"
          value={formData.choice3}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <input
          type="text"
          name="choice4"
          placeholder="보기 4"
          value={formData.choice4}
          onChange={handleChange}
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

        <button style={styles.button} type="submit">
          등록
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

export default Questions;