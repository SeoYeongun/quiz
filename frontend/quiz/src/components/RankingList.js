import React, { useEffect, useState } from "react";
import axios from "axios";
import "./css/RankingList.css";


const RankingList = () => {

  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);


  const fetchRankings = async () => {

    try {

      const res = await axios.get(
        "http://localhost:8000/api/rankings/"
      );

      setRankings(res.data);

    } catch (err) {

      console.log(
        "랭킹 불러오기 실패",
        err
      );

    } finally {

      setLoading(false);

    }
  };


  useEffect(() => {

    fetchRankings();

  }, []);



  if (loading) {
    return (
      <div>
        랭킹 불러오는 중...
      </div>
    );
  }



  return (

    <div className="ranking-container">

      <h2>
        🏆 퀴즈 랭킹
      </h2>


      <table className="ranking-table">

        <thead>

          <tr>
            <th>순위</th>
            <th>사용자</th>
            <th>푼 문제</th>
            <th>정답</th>
            <th>정답률</th>
          </tr>

        </thead>


        <tbody>

          {rankings.map((rank) => (

            <tr key={rank.rank}>


              <td>

                {rank.rank === 1 && "🥇 "}
                {rank.rank === 2 && "🥈 "}
                {rank.rank === 3 && "🥉 "}

                {rank.rank}

              </td>


              <td>
                {rank.username}
              </td>


              <td>
                {rank.solved_count}
              </td>


              <td>
                {rank.correct_count}
              </td>


              <td>
                {rank.accuracy}%
              </td>


            </tr>

          ))}


        </tbody>


      </table>


    </div>

  );

};


export default RankingList;