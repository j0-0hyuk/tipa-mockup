export type ScriptStep =
  | { kind: 'ai'; text: string; typingMs: number; delayBeforeMs: number; instant?: boolean }
  | { kind: 'user'; text: string; typingMs: number; delayBeforeMs: number }
  | { kind: 'cta'; delayBeforeMs: number; target?: 'rnd' | 'company' }
  | { kind: 'chips'; delayBeforeMs: number; disabled?: boolean; selectedId?: string; continueAfterMs?: number };

export const BOT_NAME = 'TIPANI';
export const BOT_TAGLINE = 'R&D 지원사업 AI 안내 챗봇';

export interface Scenario {
  id: string;
  icon: string;
  label: string;
  chipText: string;
  steps: ScriptStep[];
}

export const INTRO_SCRIPT: ScriptStep[] = [
  {
    kind: 'ai',
    text:
      '안녕하세요, 김민수님 👋\n' +
      '저는 R&D 지원사업을 더 쉽게 찾고 준비할 수 있도록 돕는 AI 안내 챗봇 **TIPANI**예요.\n\n' +
      '어떤 사업에 지원할 수 있는지, 필요한 서류는 무엇인지, 규정이나 연구비 편성은 어떻게 봐야 하는지 함께 확인해드릴게요.\n' +
      '처음이라 막막하셔도 괜찮아요. 아래에서 궁금한 주제를 골라주시거나 편하게 질문해 주세요!',
    typingMs: 1400,
    delayBeforeMs: 500,
  },
  {
    kind: 'chips',
    delayBeforeMs: 400,
  },
];

export const SCENARIOS: Scenario[] = [
  {
    id: 'recommend',
    icon: '💼',
    label: '지원사업 추천',
    chipText: '우리 회사에 맞는 지원사업을 찾아볼까요?',
    steps: [
      {
        kind: 'user',
        text: '우리 회사에 맞는 지원사업 찾아줘',
        typingMs: 500,
        delayBeforeMs: 300,
      },
      {
        kind: 'ai',
        text: '기업정보를 알려주시면 일치율 높은 공고를 추천해드릴게요.',
        typingMs: 500,
        delayBeforeMs: 500,
      },
      {
        kind: 'cta',
        target: 'company',
        delayBeforeMs: 400,
      },
      {
        kind: 'chips',
        delayBeforeMs: 600,
      },
    ],
  },
  {
    id: 'regulation',
    icon: '📖',
    label: '법령·규정 안내',
    chipText: '과제 수행 규정을 함께 확인해볼까요?',
    steps: [
      {
        kind: 'user',
        text: '과제 수행 중에 회사 상호 변경하려는데\n절차가 어떻게 돼?',
        typingMs: 600,
        delayBeforeMs: 300,
      },
      {
        kind: 'ai',
        text:
          '🧠 **분석 중입니다**\n' +
          '「국가연구개발혁신법 시행령」에서 협약 변경 절차를 확인해드릴게요.',
        typingMs: 800,
        delayBeforeMs: 600,
      },
      {
        kind: 'ai',
        instant: true,
        text:
          '상호 변경은 **「국가연구개발혁신법 시행령」 제35조**(협약의 변경)에 따라\n' +
          '**전문기관 사전 승인**이 필수입니다.\n\n' +
          '📋 **변경 절차 (4단계)**\n' +
          '  1️⃣ IRIS에서 변경 신청 등록 — https://www.iris.go.kr\n' +
          '  2️⃣ 서류 제출 — 사유서·법인등기부등본·사업자등록증·이사회 의사록\n' +
          '  3️⃣ 전문기관 검토 (5~10영업일)\n' +
          '  4️⃣ 승인 → 협약 변경 체결\n\n' +
          '⚠️ 사전 승인 없이 변경 시 **협약 해지·출연금 환수** 사유\n\n' +
          '📎 **출처**\n' +
          '  • 국가법령정보센터: https://www.law.go.kr\n' +
          '  • IRIS 변경 신청: https://www.iris.go.kr',
        typingMs: 200,
        delayBeforeMs: 700,
      },
      {
        kind: 'chips',
        delayBeforeMs: 600,
      },
    ],
  },
  {
    id: 'evidence',
    icon: '🧾',
    label: '증빙자료 안내',
    chipText: '필요한 서류와 발급 방법을 알아볼까요?',
    steps: [
      {
        kind: 'user',
        text: '수출입실적증명서 발급처랑\n발급 요령 좀 알려줘',
        typingMs: 600,
        delayBeforeMs: 300,
      },
      {
        kind: 'ai',
        text:
          '🧠 **분석 중입니다**\n' +
          '한국무역협회·관세청 발급 매뉴얼을 정리해드릴게요.',
        typingMs: 800,
        delayBeforeMs: 600,
      },
      {
        kind: 'ai',
        instant: true,
        text:
          'R&D 신청용은 **한국무역협회(KITA) 발급본이 표준**입니다.\n\n' +
          '🏛️ **발급 기관**\n' +
          '  ⭐ **KITA** — R&D·수출바우처·벤처확인 (권장)\n' +
          '     https://membership.kita.net/cert/oncert/expImpResCertRequest.do\n' +
          '  • **관세청 UNI-PASS** — 관세·통관용 (무료)\n' +
          '     https://unipass.customs.go.kr\n' +
          '  • **대한상공회의소** — 해외입찰·법원 제출용\n' +
          '     https://www.korcham.net\n\n' +
          '📝 **KITA 발급 절차** — 공동인증서 또는 간편인증 → 무역증명서비스 → "수출입실적증명서" → PDF 즉시 발급\n\n' +
          '📎 **출처**: https://membership.kita.net/cert/oncert/expImpResCertRequest.do',
        typingMs: 200,
        delayBeforeMs: 700,
      },
      {
        kind: 'chips',
        delayBeforeMs: 600,
      },
    ],
  },
  {
    id: 'budget',
    icon: '💰',
    label: '연구비 편성',
    chipText: '연구비 편성 기준을 확인해볼까요?',
    steps: [
      {
        kind: 'user',
        text: '기존 직원 인건비를\n연구비로 100% 편성 가능해?',
        typingMs: 600,
        delayBeforeMs: 300,
      },
      {
        kind: 'ai',
        text:
          '🧠 **분석 중입니다**\n' +
          '「연구개발비 사용 기준」 고시에서 인건비 규정을 확인해드릴게요.',
        typingMs: 800,
        delayBeforeMs: 600,
      },
      {
        kind: 'ai',
        instant: true,
        text:
          '**원칙적으로 불가**, 조건 충족 시 가능합니다.\n' +
          '**「국가연구개발사업 연구개발비 사용 기준」 제9조**(인건비) 기준:\n\n' +
          '📖 **원칙 (내부 인건비)**\n' +
          '  • 현금 계상은 **참여율의 50%**까지, 나머지는 현물 부담\n\n' +
          '✅ **예외: 100% 현금 계상**\n' +
          '  ① 중소기업·벤처기업으로 확인된 기관\n' +
          '  ② 해당 연구원이 **전담 연구원**, 참여율 100% 증빙\n\n' +
          '🧮 **편성 예시** (연봉 6,000만 · 참여율 100%)\n' +
          '  • 일반 기업 → 현금 3,000만 + 현물 3,000만\n' +
          '  • 중소·벤처 (예외) → **현금 6,000만 (100%)**\n\n' +
          '📎 **출처**\n' +
          '  • 연구개발비 사용 기준 고시: https://www.law.go.kr\n' +
          '  • 혁신법 시행령: https://www.law.go.kr\n' +
          '  • IRIS: https://www.iris.go.kr',
        typingMs: 200,
        delayBeforeMs: 700,
      },
      {
        kind: 'chips',
        delayBeforeMs: 600,
      },
    ],
  },
  {
    id: 'revisit',
    icon: '👋',
    label: '이전 대화 이어하기',
    chipText: '지난 대화를 이어서 도와드려요',
    steps: [
      // AI: 재방문 인사 + 이력 안내
      {
        kind: 'ai',
        text:
          '김민수님, 다시 만나 반가워요 😊\n' +
          '지난번에는 3년차·매출 10억 규모의 AI SW 기업 기준으로\n' +
          '**창업성장기술개발사업**을 우선 추천드렸어요.\n\n' +
          '📋 **이전 대화 요약**\n' +
          '  • 추천 사업: 창업성장기술개발사업 (최대 1.2억)\n' +
          '  • 확인 사항: 신청 마감일, 주요 일정, 하반기 추가 공고 가능성\n' +
          '  • 마지막 대화: 4월 21일\n\n' +
          '이어서 궁금한 내용을 아래에서 선택해 주세요.',
        typingMs: 1200,
        delayBeforeMs: 600,
      },
      // 사용자: 법령·규정 안내 칩을 선택한 상태로 표시
      {
        kind: 'chips',
        delayBeforeMs: 400,
        disabled: true,
        selectedId: 'regulation',
        continueAfterMs: 600,
      },
      // 유저: 이전 추천 사업 맥락에서 규정 질문
      {
        kind: 'user',
        text: '지난번 추천받은 창업성장기술개발사업 준비 중인데,\n회사 상호가 바뀌면 신청이나 협약에 문제 있어?',
        typingMs: 600,
        delayBeforeMs: 400,
      },
      // AI: 상황 확인 질문
      {
        kind: 'ai',
        text:
          '상황에 따라 처리 방식이 달라질 수 있어요.\n' +
          '지금은 **신청 전**인가요, 아니면 이미 **선정·협약 진행 중**인가요?\n' +
          '그리고 법인번호는 그대로이고 회사명만 바뀐 상황인지도 알려주세요.',
        typingMs: 800,
        delayBeforeMs: 600,
      },
      // 유저: 구체 상황 답변
      {
        kind: 'user',
        text: '아직 신청 전이고, 법인번호는 그대로야.\n회사명만 바뀌었고 사업자등록증은 새로 나왔어.',
        typingMs: 700,
        delayBeforeMs: 400,
      },
      // AI: 이전 대화 맥락을 반영해 규정 확인
      {
        kind: 'ai',
        text:
          '🧠 **확인 중입니다**\n' +
          '신청 전·동일 법인·상호만 변경된 경우로 보고,\n' +
          '지난번 추천드린 창업성장기술개발사업 신청 준비 기준에서 확인해드릴게요.',
        typingMs: 800,
        delayBeforeMs: 600,
      },
      // AI: 이전 대화 기반 규정 안내
      {
        kind: 'ai',
        instant: true,
        text:
          '현재 상황이면 **상호 변경 자체가 바로 문제 되지는 않습니다.**\n' +
          '다만 신청 전에 기업 정보와 제출 서류의 회사명을 모두 최신 상호로 맞춰두는 게 중요해요.\n\n' +
          '📌 **김민수님 상황 기준 정리**\n' +
          '  • 신청 상태: 아직 신청 전\n' +
          '  • 법인 동일성: 법인번호 동일\n' +
          '  • 변경 내용: 회사명 변경, 사업자등록증 갱신 완료\n\n' +
          '✅ **지금 해야 할 일**\n' +
          '  1️⃣ SMTECH/IRIS 기업 기본정보의 회사명을 새 상호로 갱신\n' +
          '  2️⃣ 사업자등록증, 법인등기부등본, 계획서 표지·본문의 회사명 일치 여부 확인\n' +
          '  3️⃣ 법인등기부등본에 상호 변경 이력이 표시되는지 확인\n' +
          '  4️⃣ 제출 전 파일명·본문·첨부서류에 이전 상호가 남아 있지 않은지 최종 점검\n\n' +
          '⚠️ **주의할 점**\n' +
          '  • 회사명은 바뀌었는데 플랫폼 정보나 계획서 일부가 예전 상호로 남아 있으면 보완 요청이 나올 수 있어요\n' +
          '  • 법인번호가 동일하므로 동일 법인 증빙은 가능하지만, 상호 변경 이력 증빙은 함께 준비하는 편이 안전합니다\n\n' +
          '💡 **이전 대화 맥락 기준 Tip**\n' +
          '  • 지난번 확인한 상반기 접수는 마감된 상태라, 하반기 공고 준비 전 기업 정보를 먼저 정리해두면 좋아요\n' +
          '  • 지금처럼 신청 전 단계라면 협약 변경 신청보다는 **신청 정보 정합성**을 맞추는 것이 우선입니다\n\n' +
          '📎 **출처**\n' +
          '  • 국가법령정보센터: https://www.law.go.kr\n' +
          '  • SMTECH 공고: https://www.smtech.go.kr/region/rms\n' +
          '  • IRIS: https://www.iris.go.kr',
        typingMs: 200,
        delayBeforeMs: 700,
      },
    ],
  },
];
