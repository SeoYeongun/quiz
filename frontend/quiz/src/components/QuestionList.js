import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const QuestionList = () => {
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [search, setSearch] = useState("");


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

  const filteredQuestions = questions.filter((q) => {

    // 검색어 공백 제거
    const keyword = search
      .replace(/\s/g, "")
      .toLowerCase();


    // 제목 공백 제거
    const title = q.title
      .replace(/\s/g, "")
      .toLowerCase();


    // 작성자 공백 제거
    const author = q.author
      .replace(/\s/g, "")
      .toLowerCase();


    return (
      title.includes(keyword) ||
      author.includes(keyword)
    );

  });

  const getYoutubeThumbnail = (url) => {

    if (!url) return null;


    let videoId = null;


    // youtube.com/watch?v=
    if (url.includes("youtube.com/watch")) {

      videoId = new URL(url).searchParams.get("v");

    }


    // youtu.be/
    else if (url.includes("youtu.be")) {

      videoId = url.split("/").pop();

    }


    if (videoId) {

      return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

    }


    return null;

  };


  // -----------------------------
  // 로그아웃
  // -----------------------------
  const logout = () => {

    localStorage.removeItem("access");
    localStorage.removeItem("refresh");

    setIsLoggedIn(false);

    alert("로그아웃되었습니다.");

    navigate("/quizzes");
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

        <h2 style={{ margin: 0 }}>
          퀴즈 목록
        </h2>



        <div style={{ display: "flex", gap: "10px" }}>


          {/* 비로그인 상태 */}
          {!isLoggedIn && (

            <>

              <button
                onClick={() => navigate("/signup")}
              >
                회원가입
              </button>


              <button
                onClick={() => navigate("/login")}
              >
                로그인
              </button>

            </>

          )}



          {/* 랭킹 - 로그인 여부 상관없이 표시 */}
          <button
            onClick={() => navigate("/rankings/users")}
          >
            🏆 유저 랭킹
          </button>

          <button
            onClick={() => navigate("/rankings/posts")}
          >
            🏆 게시글 랭킹
          </button>




          {/* 로그인 상태 */}
          {isLoggedIn && (

            <>

              <button
                onClick={() => navigate("/questions")}
              >
                문제 만들기
              </button>


              <button
                onClick={() => navigate("/profile")}
              >
                👤 프로필
              </button>


              <button
                onClick={logout}
              >
                🚪 로그아웃
              </button>


            </>

          )}


        </div>
      </div>

      <input
        type="text"
        placeholder="제목 또는 작성자 검색"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          marginTop: "15px",
          marginBottom: "20px",
          fontSize: "16px",
          border: "1px solid #ccc",
          borderRadius: "8px",
        }}
        />




      {/* 문제 목록 */}

      {filteredQuestions.length === 0 ? (

        <p>
          문제가 없습니다.
        </p>


      ) : (


        filteredQuestions.map((q) => (


          <p
            key={q.id}
            onClick={() => navigate(`/solve/${q.id}`)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "15px",
              padding: "12px",
              borderBottom: "1px solid #ddd",
              cursor: "pointer",
            }}
          >

            {/* 썸네일 */}
            <div
              style={{
                width: "80px",
                height: "60px",
                flexShrink: 0,
                overflow: "hidden",
                borderRadius: "8px",
                backgroundColor: "#f3f3f3",
              }}
            >

              {q.image ? (

                <img
                  src={q.image}
                  alt="thumbnail"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />

              ) : getYoutubeThumbnail(q.video_url) ? (

                <img
                  src={getYoutubeThumbnail(q.video_url)}
                  alt="youtube thumbnail"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />

              ) : q.video ? (
                <video
                  src={q.video}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <div>
                  없음
                </div>
              )}
            </div>

            <span style={{ flex: 1 }}>
              title: {q.title}
            </span>

            <span>
              작성자: {q.author}
            </span>

            <span>
              ❤️ {q.like_count}
            </span>

            <span>
              💬 {q.comment_count}
            </span>

            <span>
              📅 {new Date(q.created_at).toLocaleDateString()}
            </span>
          </p>
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

              backgroundColor:
                page === i + 1 ? "#0d6efd" : "white",

              color:
                page === i + 1 ? "white" : "black",

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