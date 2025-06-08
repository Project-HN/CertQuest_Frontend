'use client'; // 클라이언트 컴포넌트임을 명시합니다.

import { useState, useEffect } from 'react';
import axios from 'axios'; // axios 라이브러리 임포트

interface User {
  userId: string;
  email: string;
  name: string;
  nickname: string;
  password: string;
  signuptype: string;
  createdat: string;
}

export default function Home() {
  // 백엔드에서 받은 데이터를 저장할 상태 (초기값은 빈 배열)
  const [Users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // 로딩 상태 추가
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBackendData = async () => {
      try {
        const backendApiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;

        if (!backendApiUrl) {
          setError("환경 변수 NEXT_PUBLIC_BACKEND_API_URL이 설정되지 않았습니다.");
          setLoading(false);
          return;
        }

        // 백엔드 API 엔드포인트에 GET 요청 보내기
        const response = await axios.get<User[]>(`${backendApiUrl}/api/users/info`);
        
        // 응답 데이터 상태에 저장
        setUsers(response.data);

      } catch (err) {
        console.error('백엔드에서 데이터를 가져오는 중 오류 발생:', err);
        setError('백엔드에서 데이터를 가져오는 데 실패했습니다. 콘솔을 확인하세요.');
      } finally {
        setLoading(false); // 로딩 완료
      }
    };

    fetchBackendData(); // 함수 호출
  }, []); // 컴포넌트가 처음 마운트될 때 한 번만 실행

  return (
    <div>
      <h1>백엔드 연결 테스트</h1>
      {loading && <p>데이터 로딩 중...</p>} {/* 로딩 중일 때 표시 */}
      {error && <p style={{ color: 'red' }}>{error}</p>} {/* 에러 발생 시 표시 */}

      {/* 데이터가 로드되고 에러가 없을 때만 리스트를 렌더링 */}
      {!loading && !error && Users.length > 0 && (
        <div>
          <h2>백엔드로부터 받은 항목들:</h2>
          <ul>
            {/* Users 배열을 map 함수로 순회하며 각 항목을 렌더링 */}
            {Users.map(User => (
              <li key={User.userId}>ID: {User.userId}, 이메일: {User.email}, 이름: {User.name}, 닉네임: {User.nickname}, 비밀번호: {User.password}, 가입경로: {User.signuptype}, 가입시기: {User.createdat}</li>
            ))}
          </ul>
          {/* 받은 JSON 데이터 전체를 확인하고 싶을 때 (디버깅용) */}
          <div>
            받은 원본 데이터 (디버깅용): <pre>{JSON.stringify(Users, null, 2)}</pre>
          </div>
        </div>
      )}
      {!loading && !error && Users.length === 0 && <p>항목이 없습니다.</p>}
    </div>
  );
}