import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState, useRef, useCallback, useEffect } from 'react';
import { Flex, Button, useToast } from '@docs-front/ui';
import Streamdown from '@/markdown/Streamdown';
import {
  Sparkles,
  ChevronRight,
  Search,
  GitCompare,
  DollarSign,
  Tag,
  Building2,
  PenLine,
  ClipboardCheck,
  Info,
  BookOpen,
  Check,
  HelpCircle,
  X,
} from 'lucide-react';
import {
  StyledModalOverlay,
  StyledModalBox,
  StyledModalHeader,
  StyledModalTitle,
  StyledModalClose,
  StyledModalDesc,
  StyledModalFooter,
  StyledBtnOutlined,
  StyledBtnFilled,
} from '../start/-route.style';
import styled from '@emotion/styled';
import {
  StyledContainer,
  StyledContentArea,
  StyledStepContent,
  StyledFooter,
  StyledFooterInner,
  StyledStepTitle,
  StyledTextarea,
  StyledSplitView,
  StyledMarkdownPane,
  StyledToolPanel,
  StyledToolButton,
  StyledResultContainer,
  StyledResultTitle,
  StyledTable,
  StyledCodeCard,
  StyledDiffBlock,
  StyledDiffOld,
  StyledDiffNew,
  StyledListItem,
  StyledSpinnerRing,
} from './-route.style';
import { InstantStepper } from '../start/-components/InstantStepper/InstantStepper';
import { Step1SelectTemplate, type SavedDraft } from '../start/-components/steps/Step1SelectTemplate';
import { Step2InputUpload } from '../start/-components/steps/Step2InputUpload';

export const Route = createFileRoute('/_authenticated/start2')({
  component: Start2Page,
});



const StyledDisclaimerBanner = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 18px;
  background: #EEF4FF;
  border: 1px solid #C7DBFF;
  border-radius: 8px;
  margin-bottom: 20px;
  font-size: 15px;
  color: #1E5BB8;
  line-height: 1.5;
`;


const StyledSourceBox = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 14px;
  background: #EEF4FF;
  border: 1px solid #C7DBFF;
  border-radius: 8px;
  margin-top: 16px;
  font-size: 14px;
  color: #1E5BB8;
  line-height: 1.5;
`;

const StyledProofreadNotice = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 18px;
  background: #EEF4FF;
  border: 1px solid #C7DBFF;
  border-radius: 8px;
  margin-bottom: 16px;
  font-size: 14px;
  color: #1E5BB8;
  line-height: 1.5;
`;

/* ────────────────────────────────────────────
   Constants
   ──────────────────────────────────────────── */

const STEPPER_STEPS = [
  { label: '데이터 입력', stepNum: 2 },
  { label: '항목별AI검토', stepNum: 3 },
  { label: '초안 생성', stepNum: 4 },
] as const;


const REVIEW_ITEMS = [
  { label: '기술개발 목표 (정량 목표)', placeholder: '기술개발의 최종 목표와 정량적 성과 지표를 작성해주세요...' },
  { label: '연구개발 방법 (검증/평가 방법)', placeholder: '연구 방법론과 검증/평가 계획을 작성해주세요...' },
  { label: '선행연구개발 분석', placeholder: '국내외 선행 연구 및 기술 동향을 분석해주세요...' },
  { label: '연구개발기관 실적', placeholder: '연구개발기관의 관련 분야 실적을 기술해주세요...' },
  { label: '사업비 사용계획', placeholder: '사업비 항목별 사용 계획을 작성해주세요...' },
  { label: '연구개발 추진일정', placeholder: '연차별 연구개발 추진 일정과 마일스톤을 기술해주세요...' },
  { label: '연구개발성과의 활용방안 및 기대효과', placeholder: '연구 성과의 활용방안과 기대효과를 서술해주세요...' },
  { label: '연구실 안전 및 보안 조치', placeholder: '연구실 안전 관리 및 보안 조치 계획을 작성해주세요...' },
] as const;

/* ───── Item Guides (SFR-014) ───── */
const ITEM_GUIDES: Record<number, {
  required: string;
  recommended: string;
  inputs: string;
  sources: string;
}> = {
  0: {
    required: '문제 정의, 개발 목표 정의, 정량 목표, 달성 시점, 목표 필요성',
    recommended: '현재 vs 목표 수준 비교, 핵심 KPI, 고객/시장 요구 연결, 차별성 요약',
    inputs: '해결하려는 문제, 현재 수준 데이터, 목표 수준 데이터, 목표 기간, 핵심 KPI',
    sources: 'NTIS · KIPRIS · e-나라표준인증',
  },
  1: {
    required: '전체 개발 접근 방식, 세부 개발 과업, 과업별 수행 방법, 검증/평가 방법, 추진체계',
    recommended: '단계별 산출물, 리스크 대응방안, 외부 협력 방식',
    inputs: '세부 개발 과업, 개발 순서, 보유 기술/데이터, 검증 계획, 참여기관',
    sources: 'NTIS · KIPRIS · e-나라표준인증',
  },
  2: {
    required: '기존 연구/개발 이력, 핵심 성과, 현재 확보 수준, 이번 과제 연결성, 추가 개발 필요성',
    recommended: '연도별 발전 흐름, PoC/시제품 결과, 실패 경험 보완',
    inputs: '과거 과제 이력, 내부 실험결과, 보유 특허/논문, 기존 자산',
    sources: 'NTIS · KIPRIS',
  },
  3: {
    required: '연구팀 구성, 역할 분담, 핵심 인력 전문성, 기관별 수행 역할, 관련 실적',
    recommended: '사업화 전담 인력, 조직도, 유사 프로젝트 경험',
    inputs: '연구책임자 정보, 참여연구원, 기관별 역할, 투입률, 실적 목록',
    sources: 'KIPRIS · IRIS 연구자정보',
  },
  4: {
    required: '총 연구비, 주요 비목 구분, 과업-예산 연결, 기관별 예산 분담, 연차별 집행 계획',
    recommended: '비목별 산정 근거, 장비/외주 필요성, 시험/인증/특허 비용',
    inputs: '총 예산, 인건비, 장비/재료/외주 비용, 기관별 예산',
    sources: 'IRIS 서식/법령/매뉴얼',
  },
  5: {
    required: '총 수행기간, 단계 구분, 단계별 과업, 단계별 산출물, 검증 시점',
    recommended: '중간 게이트 기준, 외부기관 의존 일정, 사업화 연계 일정',
    inputs: '과제 총기간, 세부 과업 순서, 단계별 목표, 산출물, 검증 시점',
    sources: 'IRIS 사업공고 · e-나라표준인증',
  },
  6: {
    required: '개발성과 최종 형태, 목표 고객군, 사업화/판매 방식, 시장 진입 전략, 기대효과',
    recommended: '가격 모델, 판로 전략, 시장 성장성, 매출 추정',
    inputs: '제품/서비스 형태, 목표 고객, 판매 방식, 차별화 포인트',
    sources: 'KOSIS · KIPRIS · e-나라표준인증',
  },
  7: {
    required: '위험요인 식별, 안전관리 체계, 보호 대상 정의, 보안 통제방안, 사고 대응 계획',
    recommended: '안전/보안 책임자, 예방조치, 교육 계획, 점검 계획',
    inputs: '수행 환경, 사용 장비/물질, 개인정보 처리 여부, 외부 협력 여부',
    sources: '개인정보포털 · 국가연구안전정보시스템',
  },
};

/* ───── Tool Source References ───── */
const TOOL_SOURCES: Record<string, string> = {
  duplicate: '출처: NTIS 국가연구개발사업 DB, KIPRIS 선행특허 DB',
  similar: '출처: NTIS 유사과제 이력 데이터',
  budget: '출처: 국가연구개발혁신법 시행령, IRIS 사업관련 서식',
  techcode: '출처: 국가과학기술표준분류, 산업기술분류체계, 전략기술로드맵',
  testlab: '출처: e-나라표준인증, KOLAS 공인시험기관 디렉토리',
  proofread: '출처: 공공 말뭉치 데이터, R&D 계획서 표준 문서체',
  section: '출처: NTIS, KIPRIS, KOSIS, 솔트룩스 벡터DB',
};

const TOOL_LIST = [
  { id: 'duplicate', label: '중복성 검토', icon: GitCompare },
  { id: 'similar', label: '유사과제 매핑', icon: Search },
  { id: 'budget', label: '연구비 편성 가이드', icon: DollarSign },
  { id: 'techcode', label: '기술분류 추천', icon: Tag },
  { id: 'testlab', label: '시험/인증기관 탐색', icon: Building2 },
  { id: 'proofread', label: '문장/표현 교정', icon: PenLine },
  { id: 'section', label: '항목별 내용 검토', icon: ClipboardCheck },
] as const;

type ToolId = typeof TOOL_LIST[number]['id'];

/* ───── Saved Draft interface ───── */
interface SavedDraft2 {
  id: string;
  title: string;
  currentStep: number;
  savedAt: string;
  prompt: string;
}

const DRAFT_STORAGE_KEY = 'rnd2_saved_drafts';

/* ───── Dummy feedback texts ───── */
const AI_FEEDBACKS: Record<number, { feedback: string; suggestion: string }> = {
  0: {
    feedback: '현재 내용에는 경쟁사 대비 정량적 비교 수치와 측정 방법이 누락되어 있습니다. TRL 단계를 명시하고, 달성 가능한 수치 목표를 추가하세요.',
    suggestion: '본 과제의 최종 목표는 자연어처리 기반 문서 자동 생성 시스템의 정확도를 95% 이상 달성하는 것이다. 세부 정량 목표로는 (1) 문서 생성 시간 기존 대비 70% 단축, (2) 사용자 만족도 4.5/5.0 이상, (3) 오류율 3% 이하를 설정한다.',
  },
  1: {
    feedback: '검증 방법론이 구체적이지 않습니다. 단계별 검증 절차와 외부 평가 계획을 포함하세요.',
    suggestion: '1단계: 내부 알파 테스트 (정확도/속도 측정), 2단계: 전문가 패널 블라인드 평가, 3단계: 실사용자 베타 테스트 (N=100)를 통해 정량적 성과를 검증한다.',
  },
  2: {
    feedback: '선행연구 분석에서 국외 논문/특허 분석이 부족합니다. 최근 3년 이내 주요 연구를 보완하세요.',
    suggestion: 'GPT-4 (OpenAI, 2023), PaLM 2 (Google, 2023) 등 최신 대형 언어모델의 문서 생성 성능을 벤치마크 비교하였으며, 한국어 특화 모델 HyperCLOVA X의 문서 이해도 평가 결과를 참조하였다.',
  },
  3: {
    feedback: '기관 실적에 관련 분야 수행 과제 목록과 성과(논문, 특허, 매출액)를 정량적으로 기술하세요.',
    suggestion: '최근 5년간 NLP 관련 과제 12건 수행 (과기정통부 5건, 산업부 4건, 민간 3건), SCI 논문 28편, 국내특허 15건, 기술이전 매출 12억원의 실적을 보유하고 있다.',
  },
  4: {
    feedback: '간접비 비율이 과다하게 책정되어 있습니다. NTIS 가이드라인 기준 적정 비율로 조정하세요.',
    suggestion: '직접비 (인건비 40%, 연구기자재 20%, 연구활동비 15%), 간접비 (위탁연구 10%, 일반관리비 8%, 기타 7%)로 편성한다.',
  },
  5: {
    feedback: '마일스톤이 모호합니다. 분기별 구체적인 산출물과 검증 시점을 명시하세요.',
    suggestion: '1차년도 Q1: 데이터 수집 및 전처리 (10만건), Q2: 모델 학습 및 1차 평가, Q3: 프로토타입 개발 및 내부 테스트, Q4: 베타 서비스 오픈 및 사용자 피드백 수집.',
  },
  6: {
    feedback: '기대효과에 경제적 파급효과 수치가 없습니다. 시장 규모와 매출 전망을 추가하세요.',
    suggestion: '국내 문서 자동화 시장(2025년 2,300억원 전망)의 5% 점유 목표, 3년 내 매출 115억원 달성, 연관 산업(법무, 행정, 금융) 업무 효율 30% 향상을 기대한다.',
  },
  7: {
    feedback: '연구실 안전 점검 주기와 보안 등급 분류가 누락되어 있습니다.',
    suggestion: '연구실 안전 점검을 분기별 1회 실시하며, 연구 데이터는 "비밀" 등급으로 분류하여 암호화 저장한다. 접근 통제는 2-Factor 인증을 적용하고, 반출 시 보안 심의를 거친다.',
  },
};

/* ───── Dummy draft markdown ───── */
const DRAFT_MARKDOWN = `# 3. 선행연구개발

## (1) 선행연구개발 이력

본 과제는 생성형 AI를 활용하여 연구개발계획서의 초안 작성, 항목별 품질 검토, 규정 기반 보완 제안을 하나의 흐름으로 제공하는 지능형 문서 작성 지원 서비스 개발을 목표로 함. 주관기관인 (주)알앤디컴퍼니는 최근 3년간 법률, 특허, 행정 문서와 같이 구조가 복잡하고 전문 용어가 많은 수직 도메인 문서를 대상으로 LLM 응용 서비스와 데이터 파이프라인을 구축해 왔음. 특히 비정형 텍스트를 문서 구조, 핵심 쟁점, 근거 데이터 단위로 분해한 뒤 다시 JSON 및 Markdown 기반의 구조화 문서로 재구성하는 기술을 확보하고 있음.

참여기관인 한국혁신대학교 AI 연구소는 대규모 언어 모델의 파인튜닝, 경량화, 검색 증강 생성(RAG) 분야에서 선행 연구를 수행해 왔음. SCI급 논문 12건과 관련 특허 4건을 통해 검증된 언어 모델 최적화 역량은 본 과제에서 R&D 계획서 도메인에 특화된 문장 생성 품질과 추론 효율을 확보하는 기반임. 두 기관은 이미 전문 문서의 의미 구조 분석과 생성형 AI 응답 품질 개선이라는 공통 기술 축을 보유하고 있어, 본 과제의 초기 개발 리스크를 낮추고 실증 단계로 빠르게 진입할 수 있는 조건을 갖추고 있음.

| 구분 | 기관명 | 주요 선행역량 | 본 과제 활용 방향 |
|------|--------|----------------|------------------|
| 주관기관 | (주)알앤디컴퍼니 | Vertical LLM 서비스화, 도메인 특화 데이터 파이프라인, 문서 구조화 엔진 | 사용자 입력을 연구개발계획서 항목별 초안으로 변환하는 핵심 엔진 개발 |
| 참여기관 | 한국혁신대학교 AI 연구소 | LLM 파인튜닝, 모델 경량화, RAG 기반 품질 개선 | R&D 도메인 언어 모델 최적화 및 생성 정확도 검증 |

### 1) 주요 선행연구개발 성과

(주)알앤디컴퍼니는 법률 문서 분석 서비스 개발 과정에서 문장 간 논리적 선후 관계를 식별하고, 핵심 쟁점과 근거를 자동 추출하는 알고리즘을 구현하였음. 해당 시스템은 100만 건 이상의 법률 비정형 텍스트를 조항, 주장, 근거, 결론 단위로 구조화하는 데 활용되었으며, 도메인 특화 데이터셋 적용 후 언어 모델의 도메인 이해도 지표가 기존 대비 약 15% 향상되는 성과를 보였음. 이 경험은 R&D 계획서의 배경, 목표, 추진 방법, 기대효과를 논리적으로 연결하는 데 직접 활용 가능함.

또한 특허 문서를 대상으로 한 고정밀 자동 분류 및 키워드 추출 엔진을 개발하여 IPC 분류 자동 매핑 정확도 96.2%를 달성하였음. 이 과정에서 구축한 기술 용어 사전, 기술 키워드 지식 그래프, 유사 기술 탐색 로직은 본 과제의 기술분류 추천, 유사과제 매핑, 중복성 검토 기능으로 확장 가능함.

| 선행성과 | 핵심 내용 | 정량적 성과 |
|----------|-----------|-------------|
| AI 기반 수직계열 문서 분석 시스템 | 법률 문장 간 논리 구조 분석 및 핵심 쟁점 추출 | 법률 비정형 텍스트 100만 건 이상 구조화, 도메인 이해도 15% 향상 |
| 기술문서 자동 분류·키워드 추출 엔진 | 특허 문서 IPC 자동 매핑 및 전문 용어 지식 그래프 구축 | 자동 분류 정확도 96.2% 달성 |
| LLM 응답 품질 개선 실험 | 도메인 데이터 기반 파인튜닝 및 RAG 적용 | 장문 응답의 근거 포함률 및 일관성 개선 |

### 2) 기술적 수준 및 본 과제에 대한 의의

현재 주관기관과 참여기관이 보유한 기술은 TRL 4 수준의 실험실 검증 단계를 넘어, 일부 기능은 제한된 실제 환경에서 서비스 적용이 가능한 수준에 도달해 있음. 문서 구조화, 도메인 임베딩, 검색 기반 근거 보강, 모델 서빙 API 연동 등 본 과제에 필요한 핵심 구성요소가 이미 모듈 단위로 확보되어 있어, 신규 개발 범위는 R&D 계획서 도메인에 맞춘 통합과 고도화에 집중 가능함.

본 과제의 의의는 기존 선행기술을 단순히 문서 분류나 검색에 사용하는 데 그치지 않고, 사용자의 불완전한 입력을 정부지원사업 양식에 맞는 완성도 높은 서술형 문서로 전환하는 데 있음. 특히 연구개발 목표와 추진 방법, 선행연구 분석, 사업비 계획, 기대효과가 서로 연결되도록 문장 구조를 보정함으로써, 단순 텍스트 생성 도구와 차별화된 전문 행정 문서 작성 지원 플랫폼 구현이 가능함.

---

## (2) 본 과제 수행 시 선행연구개발 결과 활용계획

본 과제에서는 선행연구개발을 통해 확보한 문서 구조 분석 기술과 LLM 최적화 기술을 연구개발계획서 작성 전 과정에 적용함. 사용자가 입력한 자유 서술, 참고 파일, 항목별 답변은 먼저 의미 단위로 분해되고, 이후 계획서 양식의 요구 항목에 맞추어 재배치됨. 이 과정에서 누락된 항목은 AI 검토 기능을 통해 보완 질문으로 제시하고, 생성된 초안은 중복성 검토, 유사과제 매핑, 기술분류 추천, 연구비 편성 가이드와 연계해 품질을 높임.

### 1) 핵심 활용 기술 요소

| 기술 요소 | 선행연구 기반 | 본 과제 적용 방식 |
|-----------|---------------|------------------|
| 논리 구조 식별 엔진 | 법률 문서의 주장·근거·결론 추출 기술 | 연구 배경, 문제 정의, 개발 목표, 기대효과를 구분하여 계획서 목차에 자동 배치 |
| R&D 도메인 임베딩 모델 | 특허·기술문서 키워드 지식 그래프 | 국가 R&D 용어와 지원사업 규정에 맞춘 문장 추천 및 기술분류 매핑 |
| 검색 증강 생성(RAG) | 도메인 문서 검색 및 근거 보강 실험 | 유사과제, 법령, 사업 공고 기반의 근거 있는 보완 제안 생성 |
| 고속 추론 서빙 구조 | 모델 경량화 및 API 기반 LLM 서비스 운영 경험 | 초안 생성, 항목별 검토, 세부 기능 호출을 지연 없이 제공 |

### 2) 구체적 활용 계획

1차년도에는 기존 문서 구조화 엔진을 R&D 계획서 양식에 맞게 재학습하고, 사용자 입력을 8개 핵심 항목으로 자동 분류하는 기능을 구현함. 이 단계에서는 선행연구에서 확보한 문장 단위 의미 분석 로직을 활용하여 자유 입력과 첨부자료의 내용을 연구개발 목표, 필요성, 추진 방법, 선행연구, 사업비 계획 등으로 분해함. 이후 각 항목의 필수 요소가 누락되었는지 검토하고, 부족한 내용은 AI 검토 버튼을 통해 사용자에게 보완 방향을 제시함.

2차년도에는 특허·기술문서 분석 경험을 바탕으로 유사과제 탐색과 기술분류 추천 기능을 고도화함. 기존 특허 키워드 추출 엔진을 국가과학기술표준분류체계와 연계하고, 유사 연구개발 과제의 목적·방법·성과 지표를 비교하여 중복성 위험을 사전에 안내함. 이를 통해 사용자는 단순히 초안을 작성하는 수준을 넘어, 제출 전 검토와 보완까지 하나의 화면에서 수행 가능함.

마지막으로 서비스 실증 단계에서는 기술지도사, 변리사, R&D 과제 기획 전문가의 검수 데이터를 반영하여 생성 결과의 신뢰성을 높임. 전문가 피드백은 항목별 품질 평가 기준으로 축적하고, 향후 모델 재학습 및 프롬프트 정책 개선에 활용함.

### 3) 기존 R&D 과제와의 차별성

기존의 문서 AI 과제는 대체로 문서 검색, 자동 분류, 키워드 추출과 같은 분석 중심 기능에 머물러 있었음. 반면 본 과제는 사용자의 입력을 기반으로 논리적 완결성을 갖춘 장문 전문 문서를 생성하고, 생성 결과를 다시 규정·유사과제·기술분류 관점에서 검토하는 합성형 문서 작성 지원 기술을 지향함.

| 비교 항목 | 기존 과제 | 본 과제 |
|-----------|-----------|---------|
| 기술 유형 | 문서 검색·분류 중심의 분석형 기술 | 초안 생성과 검토를 결합한 합성형 기술 |
| 사용자 경험 | 사용자가 검색 결과를 직접 해석하고 문서에 반영 | AI가 항목별 문장과 보완 방향을 직접 제안 |
| 적용 범위 | 특정 문서 또는 단일 업무에 한정 | R&D 계획서에서 투자제안서, 규제 샌드박스 신청서 등으로 확장 가능 |
| 품질 관리 | 생성 결과 검증 기능 부족 | 유사과제, 기술분류, 표현 교정, 항목별 내용 검토 기능 포함 |

### 4) 리스크 관리 및 보완 전략

본 과제에서 예상되는 주요 리스크는 생성형 AI의 환각 현상으로 인해 규정이나 사업 요건이 부정확하게 안내될 가능성임. 이를 완화하기 위해 생성 단계와 검토 단계를 분리하고, 규정·공고·유사과제와 같이 근거 확인이 필요한 내용은 검색 증강 생성과 사실 확인 모듈을 거치도록 설계함. 또한 초안 화면에는 AI 결과물이 참고용이라는 고지를 명확히 표시하고, 사용자가 전문가 검토를 거쳐 최종 제출하도록 유도함.

운영 측면에서는 전문가 검수 데이터를 지속적으로 수집하여 잘못된 추천 유형을 분류하고, 동일한 오류가 반복되지 않도록 프롬프트 정책과 검증 규칙을 개선함. 기술적 보완과 전문가 피드백 루프를 함께 운영함으로써, 본 과제는 초기 목업 수준의 문서 생성 기능을 넘어 실제 R&D 행정 문서 작성에 활용 가능한 서비스로 발전 가능함.

| 리스크 | 대응 방안 | 기대 효과 |
|--------|-----------|-----------|
| 규정 오안내 | 공고·법령 기반 RAG와 사실 확인 모듈 적용 | 근거 없는 문장 생성 최소화 |
| 초안 품질 편차 | 항목별 AI 검토 및 전문가 피드백 데이터 반영 | 사용자 입력 수준에 따른 품질 저하 완화 |
| 도메인 확장 한계 | 기술분류 체계와 지식 그래프 지속 업데이트 | 신규 지원사업과 문서 유형으로 확장 가능 |`;

/* ───── Tool dummy results ───── */
const TOOL_RESULTS: Record<ToolId, { title: string; type: 'table' | 'list' | 'cards' | 'diff' | 'text' }> = {
  duplicate: { title: '중복성 검토 결과', type: 'table' },
  similar: { title: '유사과제 매핑 결과', type: 'list' },
  budget: { title: '연구비 편성 가이드', type: 'table' },
  techcode: { title: '기술분류 추천', type: 'cards' },
  testlab: { title: '시험/인증기관 탐색 결과', type: 'list' },
  proofread: { title: '문장/표현 교정 결과', type: 'diff' },
  section: { title: '항목별 내용 검토', type: 'text' },
};

/* ────────────────────────────────────────────
   Component
   ──────────────────────────────────────────── */

export function Start2Page() {
  const toast = useToast();
  const navigate = useNavigate();
  const contentRef = useRef<HTMLDivElement>(null);

  // 채널톡 숨김
  useEffect(() => {
    window.ChannelIO?.('hideChannelButton');
    return () => {
      window.ChannelIO?.('showChannelButton');
    };
  }, []);

  const [currentStep, setCurrentStep] = useState(1);

  // Step 1 state
  const [selectedTemplateFileId, setSelectedTemplateFileId] = useState<number | null>(null);

  // Draft management
  const [activeDraftId, setActiveDraftId] = useState<string | null>(null);
  const [, setSavedDrafts] = useState<SavedDraft2[]>([]);

  // 변경사항 추적 (마지막 저장/리셋 이후 사용자 입력 여부)
  const [isDirty, setIsDirty] = useState(false);

  // Step 2 state
  const [prompt, setPromptRaw] = useState('');
  const [hasUpload, setHasUploadRaw] = useState(false);
  const [referenceFiles, setReferenceFilesRaw] = useState<File[]>([]);

  const setPrompt = useCallback((v: string) => {
    setPromptRaw(v);
    setIsDirty(true);
  }, []);
  const setHasUpload = useCallback((v: boolean) => {
    setHasUploadRaw(v);
    setIsDirty(true);
  }, []);
  const setReferenceFiles = useCallback((v: File[]) => {
    setReferenceFilesRaw(v);
    setIsDirty(true);
  }, []);

  // Step 3 state (was Step 2)
  const [reviewTexts, setReviewTextsRaw] = useState<string[]>(Array(8).fill(''));
  const setReviewTexts = useCallback(
    (v: string[] | ((prev: string[]) => string[])) => {
      setReviewTextsRaw(v as string[]);
      setIsDirty(true);
    },
    [],
  );
  const [reviewFeedbacks, setReviewFeedbacks] = useState<Record<number, boolean>>({});
  const [generating, setGenerating] = useState(false);
  const [genStep, setGenStep] = useState(0);
  const [genCompleted, setGenCompleted] = useState(false);
  const [guideOpen, setGuideOpen] = useState<Record<number, boolean>>({});

  // Step 4 state (was Step 3)
  const [selectedTool, setSelectedTool] = useState<ToolId | null>(null);

  const scrollToTop = () => contentRef.current?.scrollTo(0, 0);

  /* ───── Load saved drafts on mount ───── */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (raw) setSavedDrafts(JSON.parse(raw));
    } catch { /* ignore */ }
  }, []);

  /* ───── Save draft ───── */
  const saveDraft = useCallback(() => {
    const raw = localStorage.getItem(DRAFT_STORAGE_KEY);
    const existing: SavedDraft2[] = raw ? JSON.parse(raw) : [];
    const title = prompt.trim().slice(0, 30) || 'R&D 계획서 초안';

    if (activeDraftId) {
      const updated = existing.map((d) =>
        d.id === activeDraftId
          ? { ...d, title, currentStep, savedAt: new Date().toISOString(), prompt }
          : d,
      );
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(updated));
      setSavedDrafts(updated);
    } else {
      const newId = `draft2_${Date.now()}`;
      const draft: SavedDraft2 = {
        id: newId,
        title,
        currentStep,
        savedAt: new Date().toISOString(),
        prompt,
      };
      const updated = [draft, ...existing].slice(0, 10);
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(updated));
      setSavedDrafts(updated);
      setActiveDraftId(newId);
    }
    setIsDirty(false);
    toast.open({ content: '임시 저장되었습니다.', duration: 2000 });
  }, [currentStep, prompt, toast, activeDraftId]);

  /* ───── Load draft (from Step1SelectTemplate) ───── */
  const loadStep1Draft = useCallback(
    (draft: SavedDraft) => {
      setActiveDraftId(draft.id);
      setPromptRaw(draft.prompt);
      setCurrentStep(draft.currentStep);
      setIsDirty(false);
      toast.open({ content: `"${draft.title}" 불러왔습니다.`, duration: 2000 });
    },
    [toast],
  );

  /* ───── Leave warning modal (변경사항 있을 때 사이드네비 이동 경고) ───── */
  const [showLeaveWarning, setShowLeaveWarning] = useState(false);
  const [pendingLeaveUrl, setPendingLeaveUrl] = useState<string | null>(null);
  const hasUnsavedWork =
    isDirty && (currentStep === 2 || currentStep === 3);

  useEffect(() => {
    if (!hasUnsavedWork) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [hasUnsavedWork]);

  useEffect(() => {
    (window as any).__unsavedWork = hasUnsavedWork;
    return () => {
      (window as any).__unsavedWork = false;
    };
  }, [hasUnsavedWork]);

  useEffect(() => {
    const handler = (e: Event) => {
      const to = (e as CustomEvent).detail;
      if (!hasUnsavedWork) {
        if (to) navigate({ to: to as any });
        return;
      }
      setPendingLeaveUrl(to);
      setShowLeaveWarning(true);
    };
    window.addEventListener('nav-request', handler);
    return () => window.removeEventListener('nav-request', handler);
  }, [hasUnsavedWork, navigate]);

  const handleLeaveSave = () => {
    saveDraft();
    setShowLeaveWarning(false);
    if (pendingLeaveUrl) navigate({ to: pendingLeaveUrl as any });
    setPendingLeaveUrl(null);
  };

  const handleLeaveDiscard = () => {
    setShowLeaveWarning(false);
    if (pendingLeaveUrl) navigate({ to: pendingLeaveUrl as any });
    setPendingLeaveUrl(null);
  };

  /* ───── Generation progress timer ───── */
  useEffect(() => {
    if (!generating) return;
    let step = 0;
    setGenStep(0);
    setGenCompleted(false);
    const timer = setInterval(() => {
      step += 1;
      setGenStep(step);
      if (step >= 4) {
        clearInterval(timer);
        setTimeout(() => {
          setGenerating(false);
          setGenCompleted(true);
        }, 400);
      }
    }, 800);
    return () => clearInterval(timer);
  }, [generating]);

  /* ───── Navigation ───── */
  const goNext = useCallback(() => {
    if (currentStep === 2) {
      setCurrentStep(3);
      scrollToTop();
      return;
    }
    if (currentStep === 3) {
      setGenerating(true);
      setGenStep(0);
      setCurrentStep(4);
      scrollToTop();
      return;
    }
    if (currentStep < 4) {
      setCurrentStep((s) => s + 1);
      scrollToTop();
    }
  }, [currentStep]);

  const goPrev = useCallback(() => {
    if (currentStep > 2) {
      setCurrentStep((s) => s - 1);
      scrollToTop();
    }
  }, [currentStep]);

  /* ───── Step 3: AI review ───── */
  const handleAiReview = useCallback((index: number) => {
    setReviewFeedbacks((prev) => ({ ...prev, [index]: true }));
  }, []);

  const updateReviewText = useCallback((index: number, value: string) => {
    setReviewTexts((prev) => {
      const copy = [...prev];
      copy[index] = value;
      return copy;
    });
  }, []);

  /* ───── Step 3: Guide toggle ───── */
  const toggleGuide = useCallback((index: number) => {
    setGuideOpen((prev) => ({ ...prev, [index]: !prev[index] }));
  }, []);

  /* ───── Step 4: Tool select ───── */
  const handleToolClick = useCallback((toolId: ToolId) => {
    setSelectedTool(toolId);
    scrollToTop();
  }, []);


  /* ────────────────────────────────────────────
     Render
     ──────────────────────────────────────────── */

  /* ─── Step 3: AI Review (was Step 2) ─── */
  const renderStep3AiReview = () => (
    <>
      <StyledStepTitle>항목별로 내용을 검토해주세요</StyledStepTitle>

      <StyledDisclaimerBanner>
        <span style={{ color: '#2C81FC', flexShrink: 0, fontSize: 15 }}>ⓘ</span>
        각 항목에 구체적으로 입력할수록 더 정확한 초안이 생성됩니다. AI 검토 버튼으로 작성한 내용을 점검할 수 있습니다.
      </StyledDisclaimerBanner>

      <Flex direction="column" gap={24} style={{ width: '100%' }}>
        {REVIEW_ITEMS.map((item, i) => {
          const guide = ITEM_GUIDES[i];
          const isGuideOpen = guideOpen[i] ?? false;

          return (
            <Flex key={i} direction="column" gap={8}>
              <Flex alignItems="center" gap="6px">
                <span style={{ fontWeight: 600, fontSize: 16, lineHeight: '24px', color: '#25262C', letterSpacing: '-0.02em' }}>
                  {i + 1}. {item.label}
                </span>
                {guide && (
                  <button
                    onClick={() => toggleGuide(i)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, display: 'flex', flexShrink: 0 }}
                    title="작성 가이드"
                  >
                    <HelpCircle size={18} color={isGuideOpen ? '#2C81FC' : '#B5B9C4'} />
                  </button>
                )}
              </Flex>
              {isGuideOpen && guide && (
                <div style={{
                  fontSize: 14, lineHeight: 1.6, color: '#4B5563', background: '#F0F6FF',
                  borderRadius: 6, padding: '8px 12px', borderLeft: '3px solid #2C81FC',
                }}>
                  필수 입력: {guide.inputs}
                </div>
              )}
              <div style={{ position: 'relative' }}>
                <StyledTextarea
                  value={reviewTexts[i]}
                  onChange={(e) => updateReviewText(i, e.target.value)}
                  placeholder={item.placeholder}
                />
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => handleAiReview(i)}
                  style={{
                    position: 'absolute',
                    bottom: 12,
                    right: 14,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    fontSize: 13,
                  }}
                >
                  <Sparkles size={14} />
                  AI 검토
                </Button>
              </div>
              {reviewFeedbacks[i] && AI_FEEDBACKS[i] && (
                <div style={{
                  background: '#F0F6FF',
                  borderRadius: 8,
                  padding: 16,
                  fontSize: 14,
                  color: '#2C81FC',
                  lineHeight: 1.7,
                  letterSpacing: '-0.02em',
                }}>
                  <div style={{ fontWeight: 600, marginBottom: 6 }}>AI 피드백:</div>
                  {AI_FEEDBACKS[i].feedback}
                  <div style={{ marginTop: 10, fontWeight: 600, marginBottom: 4 }}>AI 생성 예시:</div>
                  {AI_FEEDBACKS[i].suggestion}
                </div>
              )}
            </Flex>
          );
        })}
      </Flex>
    </>
  );

  /* ─── Step 4: Generation / Draft ─── */
  const GEN_LABELS = [
    '항목별 입력 데이터 분석',
    '표준 서식 구조 매칭',
    '공공 말뭉치 기반 문장 최적화',
    '연구개발계획서 초안 생성 완료',
  ];

  const renderStep4Draft = () => {
    /* 생성 진행 중 */
    if (generating) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 400, gap: 0 }}>
          <StyledSpinnerRing />
          <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12, letterSpacing: '-0.02em', color: '#25262C' }}>
            연구개발계획서를 생성하고 있습니다
          </h2>
          <p style={{ fontSize: 16, color: '#6E7687', textAlign: 'center', lineHeight: 1.6, marginBottom: 32, letterSpacing: '-0.02em' }}>
            항목별 입력 내용을 분석하여 초안을 생성 중입니다.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {GEN_LABELS.map((label, i) => {
              const state = i < genStep ? 'done' : i === genStep ? 'active' : 'pending';
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 16 }}>
                  <div style={{
                    width: 24, height: 24, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 14, fontWeight: 600,
                    background: state === 'done' ? '#2C81FC' : state === 'active' ? '#2C81FC' : '#E3E4E8',
                    color: state === 'pending' ? '#596070' : '#FFFFFF',
                    transition: 'all 0.3s',
                  }}>
                    {state === 'done' ? <Check size={12} strokeWidth={3} /> : i + 1}
                  </div>
                  <span style={{
                    color: state === 'pending' ? '#B5B9C4' : '#25262C',
                    fontWeight: state === 'active' ? 500 : 400,
                    letterSpacing: '-0.02em',
                  }}>
                    {label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    /* 생성 완료 — 아직 초안 미확인 */
    if (genCompleted && !selectedTool) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 400 }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%', background: '#2C81FC',
            display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24,
          }}>
            <Check size={28} color="#FFFFFF" strokeWidth={3} />
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12, letterSpacing: '-0.02em', color: '#25262C' }}>
            작성이 완료되었습니다
          </h2>
          <p style={{ fontSize: 16, color: '#6E7687', textAlign: 'center', lineHeight: 1.6, marginBottom: 20, letterSpacing: '-0.02em' }}>
            작성된 연구개발계획서를 확인하세요.
          </p>
          <div style={{ fontSize: 15, color: '#1E5BB8', lineHeight: 1.5, marginBottom: 28, padding: '14px 18px', background: '#EEF4FF', border: '1px solid #C7DBFF', borderRadius: 8, maxWidth: 500, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: '#2C81FC', flexShrink: 0, fontSize: 15 }}>ⓘ</span>
            본 결과물은 AI 기반 참고용 초안이며, 사용자의 검토 및 보완이 필요합니다.
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <Button variant="outlined" size="large" onClick={() => { setCurrentStep(1); scrollToTop(); }}>
              처음으로
            </Button>
            <Button variant="filled" size="large" onClick={() => setGenCompleted(false)}>
              내용 확인
            </Button>
          </div>
        </div>
      );
    }

    if (selectedTool) return renderToolResults();
    return (
      <>
        <StyledStepTitle>연구개발계획서 초안입니다</StyledStepTitle>

        <StyledDisclaimerBanner>
          <Info size={16} style={{ flexShrink: 0, color: '#2C81FC' }} />
          본 초안은 외부 데이터 없이 사용자 입력만으로 생성되었습니다. 우측 세부 기능을 활용하여 외부 데이터 기반 검증 및 보완을 진행하세요.
        </StyledDisclaimerBanner>

        <StyledSplitView>
          <StyledMarkdownPane>
            <Streamdown>{DRAFT_MARKDOWN}</Streamdown>
          </StyledMarkdownPane>

          <StyledToolPanel>
            <div
              style={{
                fontSize: 16,
                fontWeight: 600,
                color: '#596070',
                marginBottom: 4,
                letterSpacing: '-0.02em',
              }}
            >
              세부 기능
            </div>
            {TOOL_LIST.map((tool) => {
              const Icon = tool.icon;
              return (
                <StyledToolButton
                  key={tool.id}
                  $active={selectedTool === tool.id}
                  onClick={() => handleToolClick(tool.id)}
                >
                  <Icon size={16} />
                  {tool.label}
                  <ChevronRight size={14} style={{ marginLeft: 'auto', opacity: 0.4 }} />
                </StyledToolButton>
              );
            })}
          </StyledToolPanel>
        </StyledSplitView>
      </>
    );
  };

  /* ─── Tool Results (inline in Step 4) ─── */
  const renderToolResults = () => {
    if (!selectedTool) return null;
    const result = TOOL_RESULTS[selectedTool];

    return (
      <>
        <StyledResultContainer>
          <StyledResultTitle>{result.title}</StyledResultTitle>

          {/* 중복성 검토: 테이블 */}
          {selectedTool === 'duplicate' && (
            <StyledTable>
              <thead>
                <tr>
                  <th>과제명</th>
                  <th>유사도</th>
                  <th>수행기관</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>자연어 기반 문서 자동 생성 기술 개발</td>
                  <td style={{ color: '#F04452', fontWeight: 600 }}>87%</td>
                  <td>한국전자통신연구원</td>
                </tr>
                <tr>
                  <td>AI 활용 공공문서 작성 지원 시스템</td>
                  <td style={{ color: '#FFB300', fontWeight: 600 }}>72%</td>
                  <td>한국과학기술정보연구원</td>
                </tr>
                <tr>
                  <td>딥러닝 기반 한국어 문서 요약 및 생성</td>
                  <td style={{ color: '#FFB300', fontWeight: 600 }}>65%</td>
                  <td>서울대학교</td>
                </tr>
              </tbody>
            </StyledTable>
          )}

          {/* 유사과제 매핑: 리스트 */}
          {selectedTool === 'similar' && (
            <Flex direction="column" gap={10}>
              {[
                {
                  name: 'AI 기반 R&D 문서 자동 작성 플랫폼 개발',
                  org: '한국전자통신연구원',
                  year: '2024',
                  code: '1711196972',
                },
                {
                  name: '공공 연구개발 계획서 품질 자동 평가 시스템',
                  org: '과학기술정보통신부',
                  year: '2023',
                  code: '1711183421',
                },
                {
                  name: '대규모 언어모델 기반 한국어 문서 생성 기술',
                  org: 'KAIST',
                  year: '2024',
                  code: '1711201034',
                },
                {
                  name: '지능형 연구비 편성 가이드 시스템',
                  org: '한국연구재단',
                  year: '2023',
                  code: '1711178895',
                },
                {
                  name: 'NLP 기반 유사 과제 중복성 자동 검증 도구',
                  org: '정보통신산업진흥원',
                  year: '2024',
                  code: '1711205567',
                },
              ].map((item, i) => (
                <StyledListItem key={i}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, marginBottom: 4 }}>{item.name}</div>
                    <div style={{ fontSize: 14, color: '#6E7687' }}>
                      {item.org} | {item.year} | NTIS: {item.code}
                    </div>
                  </div>
                </StyledListItem>
              ))}
            </Flex>
          )}

          {/* 연구비 편성 가이드: 테이블 */}
          {selectedTool === 'budget' && (
            <StyledTable>
              <thead>
                <tr>
                  <th>항목</th>
                  <th>비율</th>
                  <th>금액(만원)</th>
                  <th>비고</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>인건비</td>
                  <td>40%</td>
                  <td>40,000</td>
                  <td>책임연구원 2인, 연구원 4인</td>
                </tr>
                <tr>
                  <td>연구기자재</td>
                  <td>20%</td>
                  <td>20,000</td>
                  <td>GPU 서버, 스토리지</td>
                </tr>
                <tr>
                  <td>연구활동비</td>
                  <td>15%</td>
                  <td>15,000</td>
                  <td>학회, 출장, 전문가 자문</td>
                </tr>
                <tr>
                  <td>위탁연구</td>
                  <td>10%</td>
                  <td>10,000</td>
                  <td>데이터 구축 위탁</td>
                </tr>
                <tr>
                  <td>일반관리비</td>
                  <td>8%</td>
                  <td>8,000</td>
                  <td>-</td>
                </tr>
                <tr>
                  <td>기타</td>
                  <td>7%</td>
                  <td>7,000</td>
                  <td>-</td>
                </tr>
              </tbody>
            </StyledTable>
          )}

          {/* 기술분류 추천: 카드 */}
          {selectedTool === 'techcode' && (
            <Flex direction="column" gap={12}>
              {[
                { rank: '1순위', code: 'EA0202', name: '자연어처리 / 언어AI', confidence: '94%' },
                { rank: '2순위', code: 'EA0101', name: '인공지능 일반 / 기계학습', confidence: '88%' },
                { rank: '3순위', code: 'IB0301', name: '정보서비스 / 문서관리', confidence: '72%' },
              ].map((item, i) => (
                <StyledCodeCard key={i}>
                  <Flex alignItems="center" justify="space-between">
                    <Flex direction="column" gap={4}>
                      <span style={{ fontSize: 14, color: '#2C81FC', fontWeight: 600 }}>
                        {item.rank}
                      </span>
                      <span style={{ fontSize: 16, fontWeight: 600 }}>{item.name}</span>
                      <span style={{ fontSize: 14, color: '#6E7687' }}>코드: {item.code}</span>
                    </Flex>
                    <span style={{ fontSize: 20, fontWeight: 700, color: '#2C81FC' }}>
                      {item.confidence}
                    </span>
                  </Flex>
                </StyledCodeCard>
              ))}
            </Flex>
          )}

          {/* 시험/인증기관 탐색: 리스트 */}
          {selectedTool === 'testlab' && (
            <Flex direction="column" gap={10}>
              {[
                {
                  name: '한국정보통신기술협회 (TTA)',
                  contact: '031-780-9114',
                  note: 'SW 시험인증, AI 품질인증',
                },
                {
                  name: '한국산업기술시험원 (KTL)',
                  contact: '02-860-1114',
                  note: 'AI 성능시험, 안전인증',
                },
                {
                  name: '한국인터넷진흥원 (KISA)',
                  contact: '118',
                  note: '정보보호 인증, 개인정보 영향평가',
                },
              ].map((item, i) => (
                <StyledListItem key={i}>
                  <Building2
                    size={20}
                    style={{ color: '#2C81FC', flexShrink: 0, marginTop: 2 }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, marginBottom: 4 }}>{item.name}</div>
                    <div style={{ fontSize: 14, color: '#6E7687' }}>연락처: {item.contact}</div>
                    <div style={{ fontSize: 14, color: '#6E7687' }}>주요업무: {item.note}</div>
                  </div>
                </StyledListItem>
              ))}
            </Flex>
          )}

          {/* 문장/표현 교정: Diff */}
          {selectedTool === 'proofread' && (
            <Flex direction="column" gap={16}>
              <StyledProofreadNotice>
                <PenLine size={16} style={{ flexShrink: 0 }} />
                공공 말뭉치 및 R&D 계획서 표준 문서체를 기준으로 교정합니다.
              </StyledProofreadNotice>
              <StyledDiffBlock>
                <StyledDiffOld>
                  본 과제의 최종 목표는 자연어처리 기반 문서 자동 생성 시스템의 정확도를 높이는
                  것이다.
                </StyledDiffOld>
                <StyledDiffNew>
                  본 과제의 최종 목표는 자연어처리 기반 문서 자동 생성 시스템의 정확도를{' '}
                  <strong>95% 이상으로 향상시키는</strong> 것이다.
                </StyledDiffNew>
              </StyledDiffBlock>
              <StyledDiffBlock>
                <StyledDiffOld>
                  연구 성과를 다양한 분야에서 활용할 수 있을 것으로 기대된다.
                </StyledDiffOld>
                <StyledDiffNew>
                  연구 성과를 <strong>법무, 행정, 금융 등 문서 집약 산업</strong>에서 활용하여{' '}
                  <strong>업무 효율을 30% 이상 향상</strong>시킬 수 있을 것으로 기대된다.
                </StyledDiffNew>
              </StyledDiffBlock>
              <StyledDiffBlock>
                <StyledDiffOld>데이터는 안전하게 관리한다.</StyledDiffOld>
                <StyledDiffNew>
                  연구 데이터는{' '}
                  <strong>"비밀" 등급으로 분류하여 AES-256 암호화로 저장</strong>하며,{' '}
                  <strong>2-Factor 인증 기반 접근 통제</strong>를 적용한다.
                </StyledDiffNew>
              </StyledDiffBlock>
            </Flex>
          )}

          {/* 항목별 내용 검토: 텍스트 */}
          {selectedTool === 'section' && (
            <Flex direction="column" gap={16}>
              <div
                style={{
                  fontSize: 15,
                  lineHeight: 1.8,
                  letterSpacing: '-0.02em',
                  color: '#25262C',
                }}
              >
                <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>AI 심층 수정안</h3>
                <p>
                  <strong>1. 기술개발 목표:</strong> 현재 정량 목표가 단일 지표에 편중되어 있습니다.
                  TRL 단계(현재 TRL 3 &rarr; 목표 TRL 7)를 명시하고, 세부 KPI를 3개 이상 설정하여
                  다각적 평가가 가능하도록 보완이 필요합니다.
                </p>
                <p>
                  <strong>2. 연구개발 방법:</strong> 검증 방법에 외부 평가 기관 활용 계획이 누락되어
                  있습니다. TTA 또는 KTL의 공인 시험을 1회 이상 포함하세요.
                </p>
                <p>
                  <strong>3. 선행연구:</strong> 국내 특허 분석은 포함되어 있으나, 주요 경쟁
                  기업(네이버, 카카오)의 상용 서비스 분석이 부족합니다.
                </p>
                <p>
                  <strong>4. 사업비:</strong> 인건비 비율이 40%로 적정 범위이나, 연구기자재 항목에서
                  클라우드 서비스(AWS/GCP) 비용 분리 계상을 권장합니다.
                </p>
                <p>
                  <strong>5. 추진일정:</strong> 2차년도 이후 일정이 불명확합니다. 최소 2차년도까지의
                  분기별 마일스톤을 포함하세요.
                </p>
              </div>
            </Flex>
          )}

          {/* 참조 데이터 출처 (모든 도구 결과 하단) */}
          {selectedTool && TOOL_SOURCES[selectedTool] && (
            <StyledSourceBox>
              <BookOpen size={16} style={{ flexShrink: 0 }} />
              {TOOL_SOURCES[selectedTool]}
            </StyledSourceBox>
          )}

        </StyledResultContainer>
      </>
    );
  };

  /* ─── Main render ─── */
  return (
    <StyledContainer>
      <InstantStepper currentStep={currentStep} customSteps={STEPPER_STEPS} />

      <StyledContentArea
        ref={contentRef}
      >
        <StyledStepContent key={currentStep}>
          {currentStep === 1 && (
            <Step1SelectTemplate
              selectedTemplateFileId={selectedTemplateFileId}
              onSelectTemplate={setSelectedTemplateFileId}
              onDraftSelect={() => {}}
              onUploadComplete={() => {
                setCurrentStep(2);
                scrollToTop();
              }}
              onLoadDraft={loadStep1Draft}
              draftStorageKey={DRAFT_STORAGE_KEY}
            />
          )}
          {currentStep === 2 && (
            <Step2InputUpload
              prompt={prompt}
              onPromptChange={setPrompt}
              hasUpload={hasUpload}
              onUploadChange={setHasUpload}
              referenceFiles={referenceFiles}
              onReferenceFilesChange={setReferenceFiles}
            />
          )}
          {currentStep === 3 && renderStep3AiReview()}
          {currentStep === 4 && renderStep4Draft()}
        </StyledStepContent>
      </StyledContentArea>

      <StyledFooter>
        <StyledFooterInner>
          {currentStep === 1 ? (
            <>
              <div />
              <div />
            </>
          ) : currentStep === 2 ? (
            <>
              <Button variant="outlined" size="medium" onClick={() => { setCurrentStep(1); scrollToTop(); }}>
                이전
              </Button>
              <Flex gap={8}>
                <Button variant="outlined" size="medium" onClick={saveDraft}>
                  임시 저장
                </Button>
                <Button variant="filled" size="medium" onClick={goNext}>
                  다음 단계
                </Button>
              </Flex>
            </>
          ) : currentStep === 3 ? (
            <>
              <Button variant="outlined" size="medium" onClick={goPrev}>
                이전
              </Button>
              <Flex gap={8}>
                <Button variant="outlined" size="medium" onClick={saveDraft}>
                  임시 저장
                </Button>
                <Button variant="filled" size="medium" onClick={goNext}>
                  초안 생성
                </Button>
              </Flex>
            </>
          ) : currentStep === 4 ? (
            (generating || genCompleted) ? (
              <>
                <div />
                <div />
              </>
            ) : selectedTool ? (
              <>
                <Button variant="outlined" size="medium" onClick={() => { setSelectedTool(null); scrollToTop(); }}>
                  초안으로 돌아가기
                </Button>
                <div />
              </>
            ) : (
              <>
                <Button variant="outlined" size="medium" onClick={goPrev}>
                  이전
                </Button>
                <div />
              </>
            )
          ) : (
            <>
              <div />
              <div />
            </>
          )}
        </StyledFooterInner>
      </StyledFooter>

      {/* ─── 모달: 페이지 이탈 경고 ───────────────────────── */}
      {showLeaveWarning && (
        <StyledModalOverlay onClick={() => setShowLeaveWarning(false)}>
          <StyledModalBox onClick={(e) => e.stopPropagation()}>
            <StyledModalHeader>
              <StyledModalTitle>변경 사항이 있습니다</StyledModalTitle>
              <StyledModalClose onClick={() => setShowLeaveWarning(false)}>
                <X size={20} />
              </StyledModalClose>
            </StyledModalHeader>
            <StyledModalDesc>
              작성 중인 내용이 저장되지 않았습니다. 임시 저장하시겠습니까?
            </StyledModalDesc>
            <StyledModalFooter>
              <StyledBtnOutlined onClick={handleLeaveDiscard}>나가기</StyledBtnOutlined>
              <StyledBtnFilled onClick={handleLeaveSave}>저장하기</StyledBtnFilled>
            </StyledModalFooter>
          </StyledModalBox>
        </StyledModalOverlay>
      )}

    </StyledContainer>
  );
}
