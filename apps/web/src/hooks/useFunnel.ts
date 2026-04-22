import { useMemo, useState } from 'react';

import { createUseFunnel } from '@use-funnel/core';

// createUseFunnel 함수를 사용하여 useFunnel 훅을 정의해요.
export const useFunnel = createUseFunnel(({ initialState }) => {
  // history는 퍼널의 상태 스냅샷 배열을 관리해요.
  const [history, setHistory] = useState(() => [initialState]);
  // currentIndex는 현재 퍼널 단계의 인덱스를 관리해요.
  const [currentIndex, setCurrentIndex] = useState(0);

  return useMemo(
    () => ({
      // history와 currentIndex를 반환하여 퍼널의 현재 상태를 나타내요.
      history,
      currentIndex,
      // push 함수는 새로운 상태를 추가하고 현재 인덱스를 업데이트해요.
      push(state) {
        setHistory((prev) => {
          const next = prev.slice(0, currentIndex + 1);
          return [...next, state];
        });
        setCurrentIndex((prev) => prev + 1);
      },
      // replace 함수는 현재 상태를 덮어쓰고 상태 스냅샷을 업데이트해요.
      replace(state) {
        setHistory((prev) => {
          const next = prev.slice(0, currentIndex);
          return [...next, state];
        });
      },
      // go 함수는 현재 인덱스를 delta만큼 이동해요.
      go(delta) {
        setCurrentIndex((prev) => prev + delta);
      },
      // cleanup 함수는 funnel이 언마운트될 때 호출돼요.
      cleanup() {}
    }),
    [history, currentIndex] // history와 currentIndex가 변경될 때마다 메모이제이션된 값을 반환해요.
  );
});
