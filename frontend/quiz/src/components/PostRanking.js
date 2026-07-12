import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./css/PostRanking.css";

const PostRanking = () => {
    const navigate = useNavigate();

    const [posts, setPosts] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    // -----------------------------
    // 게시글 랭킹 가져오기
    // -----------------------------
    const fetchRankings = async () => {
        try {
            const res = await axios.get(
                "http://127.0.0.1:8000/api/rankings/posts/"
            );

            setPosts(res.data);
            setFilteredPosts(res.data);

        } catch (err) {
            console.error("게시글 랭킹 불러오기 실패", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRankings();
    }, []);

    // -----------------------------
    // 검색 (제목 + 작성자)
    // -----------------------------
    useEffect(() => {

        const keyword = search.toLowerCase();

        const result = posts.filter((post) =>
            post.title.toLowerCase().includes(keyword) ||
            post.author.toLowerCase().includes(keyword)
        );

        setFilteredPosts(result);

    }, [search, posts]);

    // -----------------------------
    // 날짜 포맷
    // -----------------------------
    const formatDate = (dateString) => {

        const date = new Date(dateString);

        return date.toLocaleDateString("ko-KR");

    };

    if (loading) {
        return (
            <div className="post-ranking-container">
                <h2>불러오는 중...</h2>
            </div>
        );
    }

    return (
        <div className="post-ranking-container">

            <h2>🏆 인기 게시글 TOP100</h2>

            <input
                type="text"
                placeholder="제목 또는 작성자 검색"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="search-input"
            />

            <table className="post-ranking-table">

                <thead>

                    <tr>
                        <th>순위</th>
                        <th>제목</th>
                        <th>작성자</th>
                        <th>❤️ 좋아요</th>
                        <th>💬 댓글</th>
                        <th>작성일</th>
                    </tr>

                </thead>

                <tbody>
                    {filteredPosts.map((post) => (

                        <tr key={post.id}>

                            {/* 순위 */}
                            <td className="rank-number">

                                {post.rank === 1 && "🥇 "}
                                {post.rank === 2 && "🥈 "}
                                {post.rank === 3 && "🥉 "}

                                {post.rank}

                            </td>


                            {/* 제목 */}
                            <td
                                className="post-title"
                                onClick={() => navigate(`/solve/${post.id}`)}
                            >
                                {post.title}
                            </td>


                            {/* 작성자 */}
                            <td>
                                {post.author}
                            </td>


                            {/* 좋아요 */}
                            <td>
                                ❤️ {post.like_count}
                            </td>


                            {/* 댓글 */}
                            <td>
                                💬 {post.comment_count}
                            </td>


                            {/* 작성일 */}
                            <td>
                                {formatDate(post.created_at)}
                            </td>

                        </tr>

                    ))}


                    {filteredPosts.length === 0 && (

                        <tr>

                            <td
                                colSpan="6"
                                style={{
                                    textAlign: "center",
                                    padding: "30px"
                                }}
                            >
                                검색 결과가 없습니다.
                            </td>

                        </tr>

                    )}

                </tbody>

            </table>

        </div>
    );
};


export default PostRanking;