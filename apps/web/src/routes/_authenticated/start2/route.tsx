import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState, useRef, useCallback, useEffect } from 'react';
import { Flex, Button, useToast } from '@docs-front/ui';
import Streamdown from '@/markdown/Streamdown';
import {
  Sparkles,
  ChevronRight,
  ChevronLeft,
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
  BarChart3,
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
  StyledPageIndicator,
  StyledPageButton,
  StyledPageInfo,
  StyledViewTabs,
  StyledViewTab,
  StyledSlidePlaceholder,
} from './-route.style';
import { InstantStepper } from '../start/-components/InstantStepper/InstantStepper';
import { Step1SelectTemplate, type SavedDraft } from '../start/-components/steps/Step1SelectTemplate';
import { Step2InputUpload } from '../start/-components/steps/Step2InputUpload';
import { RecommendIntroModal } from './-components/RecommendIntroModal';

interface Start2Search {
  announcementName?: string;
}

export const Route = createFileRoute('/_authenticated/start2')({
  component: Start2RouteComponent,
  validateSearch: (search: Record<string, unknown>): Start2Search => ({
    announcementName: typeof search.announcementName === 'string' ? search.announcementName : undefined,
  }),
});

function Start2RouteComponent() {
  const { announcementName } = Route.useSearch();

  return <Start2Page announcementName={announcementName} />;
}



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

/* ───── Section items (7 sections) ───── */
const SECTION_ITEMS = [
  {
    id: 0,
    title: '기술개발 목표',
    markdown: `# 1. 기술개발 목표 (정량 목표)

## (1) 기술개발 목표 설정 배경

현재 중소기업 및 연구기관의 연구개발계획서 작성은 담당자의 경험과 개별 역량에 크게 의존하고 있으며, 과제 공고 분석, 항목별 작성, 유사과제 비교, 연구비 편성 논리 정리 등 반복적이면서도 고난도의 작업이 동시에 요구됨. 이로 인해 계획서 초안 작성에 장시간이 소요되고, 동일한 기술 수준을 보유하더라도 문서 완성도 차이로 인해 평가 결과가 달라지는 문제가 지속적으로 발생하고 있음.

본 과제는 생성형 AI와 도메인 지식 검색 기술을 결합하여 연구개발계획서 작성 전 과정을 지원하는 지능형 작성 지원 시스템을 개발하고, 사용자가 입력한 핵심 정보만으로도 항목별 초안, 근거 문장, 정량 목표, 추진 일정, 활용방안까지 일관된 구조로 제안할 수 있도록 하는 것을 목표로 함.

## (2) 최종 개발 목표

본 과제의 최종 개발 목표는 생성형 AI 기반 연구개발계획서 자동 작성 지원 시스템을 개발하여, 작성 소요 시간을 기존 대비 70% 이상 단축하고, 항목별 작성 정확도 95% 이상, 사용자 만족도 4.5점 이상을 달성하는 것임. 아울러 단순 문장 생성 기능을 넘어 유사과제·특허·공고 기준을 반영한 근거 기반 초안 작성 기능을 구현하여 실제 사업 공고 대응에 활용 가능한 수준의 서비스 완성도를 확보하고자 함.

세부적으로는 다음의 4가지 목표를 설정함.

- 연구개발계획서 주요 항목을 자동 구조화하여 초안 생성까지 연결하는 항목별 작성 엔진 개발
- 유사과제, 공고문, 선행특허를 기반으로 문장 타당성을 보강하는 RAG 기반 근거 제안 모듈 개발
- 정량 목표, 추진일정, 사업비 항목 간 논리 일관성을 자동 점검하는 품질 검토 기능 개발
- 실사용자 환경에서 반복 보완을 거쳐 즉시 제출 가능한 수준의 시제품 서비스 확보

## (3) 정량적 성과 지표

| 지표 | 현재 수준 | 목표 수준 | 측정 방법 | 목표 시점 |
|------|-----------|-----------|-----------|-----------|
| 계획서 초안 작성 소요 시간 | 평균 40시간 | 12시간 이내 | 사용자 로그 및 과업 수행 시간 측정 | 2차년도 말 |
| 항목별 작성 정확도 | 담당자 숙련도 의존 | 95% 이상 | 전문가 블라인드 평가(기술/사업성/논리성) | 2차년도 말 |
| 공고 적합 문장 추천 정확도 | 수동 검색 기반 | 90% 이상 | 공고 요건 대비 항목 일치도 평가 | 2차년도 상반기 |
| 사용자 만족도 | 기준 없음 | 4.5/5.0 이상 | 베타 사용자 설문(N=100) | 2차년도 말 |
| 생성 오류율 | 기준 없음 | 3% 이하 | 자동 검증 + 전문가 샘플링 점검 | 2차년도 말 |
| 유사과제·특허 근거 연결률 | 기준 없음 | 85% 이상 | 생성 문장 내 근거 매핑 비율 측정 | 2차년도 상반기 |

## (4) 기술 성숙도 목표(TRL)

현재 본 과제의 핵심 기술은 개별 요소 기술 수준에서 검증된 TRL 3 단계에 해당하며, 과제 종료 시점에는 실제 사용자 환경에서 검증 가능한 TRL 7 수준까지 고도화하는 것을 목표로 함. 특히 문장 생성 모델, 항목 구조화 모델, 품질 검토 모듈을 단일 워크플로우로 통합하여 실증 환경에서 안정적으로 운용하는 것을 핵심 판정 기준으로 설정함.

| 단계 | 목표 TRL | 핵심 달성 내용 | 판정 기준 |
|------|----------|----------------|-----------|
| 1차년도 상반기 | TRL 4 | 핵심 알고리즘 단위 기능 검증 | 항목 분류/초안 생성/근거 검색 각각 실험실 환경 동작 |
| 1차년도 하반기 | TRL 5 | 시제품 수준 통합 기능 검증 | 단일 입력에서 계획서 초안 생성까지 일괄 처리 |
| 2차년도 상반기 | TRL 6 | 베타 사용자 환경 검증 | 실사용자 N=50 이상 대상 반복 사용성 검증 |
| 2차년도 하반기 | TRL 7 | 운영 환경 실증 및 최적화 | 실제 과제 준비 조직에서 파일럿 운영 및 성능 안정화 |

## (5) 최종 성과 판정 기준

본 과제의 최종 성공 여부는 단순 기능 구현이 아니라 실제 연구개발계획서 작성 현장에서 활용 가능한 수준의 성능 확보 여부로 판정함.

- 사용자가 1회 입력한 핵심 정보만으로 주요 7개 항목의 초안이 자동 생성될 것
- 생성된 초안이 전문가 평가에서 평균 95점 이상 수준의 항목 적합도를 확보할 것
- 연구비, 일정, 목표 지표 간 논리 불일치 항목을 자동 검출하여 수정 제안이 가능할 것
- 베타 사용자 100명 이상이 작성 시간 절감 효과와 재사용 의향을 모두 긍정적으로 평가할 것`,
  },
  {
    id: 1,
    title: '연구개발 방법',
    markdown: `# 2. 연구개발 방법 (검증/평가 방법)

## (1) 전체 개발 접근 방식

본 과제는 데이터 구축, 핵심 모델 개발, 서비스 통합, 실증 및 고도화의 4개 축으로 나누어 추진함. 각 축은 독립 과업으로 운영하되, 2주 단위 Agile 스프린트를 통해 공통 백로그를 관리하고, 월 단위 기술 검토회의를 통해 모델 성능, 사용자 경험, 규정 적합성 이슈를 동시에 점검하는 방식으로 운영함.

핵심 개발 전략은 다음과 같음.

- **데이터 중심 개발**: 연구개발계획서, 공고문, 유사과제, 선행특허를 통합 정제하여 고품질 학습/검색 기반 확보
- **모듈형 모델 구조**: 항목 분류, 초안 생성, 근거 검색, 품질 검토를 분리 개발 후 단계적으로 통합
- **규정 연계형 검증**: 공고 조건, 평가항목, 사업비 편성 기준을 반영한 자동 검토 로직 내재화
- **실사용자 반복 검증**: 내부 테스트 이후 전문가 및 실제 수요기관 사용성 검증을 통해 결과물 정합성 강화

## (2) 세부 개발 과업

| 세부 과업 | 핵심 내용 | 주요 산출물 |
|-----------|-----------|-------------|
| 데이터 수집 및 구조화 | R&D 계획서, 공고문, 유사과제, 특허 데이터 수집 및 항목 단위 정제 | 학습용 코퍼스, 검색 인덱스, 라벨링 가이드 |
| 항목 분류 및 초안 생성 엔진 개발 | 사용자 입력을 계획서 구조에 맞게 분해하고 항목별 초안 생성 | 구조 분석 모델, 초안 생성 모델 |
| 근거 검색 및 품질 검토 모듈 개발 | 유사과제/공고/특허 기반 근거 문장 검색 및 논리 점검 | RAG 모듈, 품질 점검 엔진 |
| 서비스 통합 및 운영 고도화 | 웹 UI, 저장/불러오기, 검토/수정 플로우 통합 | 시제품 서비스, 관리자 모니터링 기능 |

### 1) 데이터 수집 및 전처리

NTIS 공개 데이터, 공공 R&D 계획서 샘플, 정부지원사업 공고문, 기술문서 및 특허 데이터를 수집하여 총 10만 건 이상의 문서 코퍼스를 구축함. 수집된 데이터는 항목별 구조화, 문단 단위 분절, 전문 용어 정규화, 노이즈 제거, 비식별화 과정을 거쳐 학습/검색에 활용 가능한 형태로 변환함.

또한 계획서 항목별 목적과 평가 관점을 반영한 라벨링 체계를 설계하여, 연구 배경, 문제 정의, 기술 목표, 개발 방법, 사업비, 기대효과 등을 개별 클래스로 관리함. 이를 통해 단순 문장 생성이 아니라 항목별 맥락을 이해하는 모델 학습 기반을 확보함.

### 2) 핵심 모델 개발

핵심 모델은 다음의 3개 계층으로 개발함.

- **문서 구조 분석 모델**: 사용자가 입력한 자유 문장을 계획서 항목별 의미 단위로 분해하고 적절한 목차에 매핑
- **문장 생성 모델**: 각 항목의 목적과 문체에 맞는 전문형 문장을 생성하고, 정량 지표와 일정 표현을 일관되게 구성
- **품질 검증 모델**: 생성된 초안에 대해 논리적 비약, 정량 목표 누락, 일정-예산 불일치, 공고 부적합 표현을 검출

이 과정에서 도메인 특화 파인튜닝과 검색 증강 생성(RAG)을 병행 적용하여, 생성 품질과 근거 제시 능력을 동시에 강화함. 또한 장문 응답 시 발생할 수 있는 반복·환각 현상을 줄이기 위해 항목별 프롬프트 템플릿과 후처리 규칙을 함께 적용함.

### 3) 서비스 통합 및 사용자 경험 설계

개발된 모델은 웹 기반 시제품 서비스에 통합하여 다음의 흐름으로 제공함.

1. 사용자 주제 및 참고 자료 입력
2. 항목별 AI 검토 질문 자동 생성
3. 7개 핵심 항목 초안 생성
4. 유사과제/연구비/기술분류 등 보조 도구 연계
5. 수정 반영 및 최종 초안 저장

서비스 통합 시 사용자가 생성 결과를 단순 열람하는 수준에 머무르지 않도록, 각 항목별로 수정 포인트와 근거 출처를 함께 제공하며, 재생성·부분 수정·이력 비교 기능을 지원함.

## (3) 검증 및 평가 방법

| 검증 단계 | 방법 | 평가 기준 | 시기 |
|-----------|------|-----------|------|
| 1차 내부 테스트 | 단위 테스트, 통합 테스트, 성능 테스트 | 주요 기능 정상 동작, 응답 시간 30초 이내, 오류율 5% 이하 | 매 스프린트 종료 시 |
| 2차 데이터 품질 점검 | 샘플링 검수, 라벨 일치도 확인 | 라벨 일치율 95% 이상, 노이즈 비율 3% 이하 | 분기별 |
| 3차 전문가 평가 | 기술지도사 및 과제기획 전문가 5인 블라인드 평가 | 항목 적합성, 논리 완결성, 심사 관점 적합도 | 반기별 |
| 4차 사용자 테스트 | 중소기업/연구기관 베타 테스트(N=100) | 만족도 4.5 이상, 재사용 의향 80% 이상, 시간 단축률 70% 이상 | 2차년도 |
| 5차 외부 검증 | 공인 시험 및 품질 인증 추진 | 서비스 안정성, 보안성, SW 품질 기준 충족 | 2차년도 말 |

## (4) 리스크 대응 방안

| 리스크 항목 | 발생 가능 이슈 | 대응 방안 |
|-------------|----------------|-----------|
| 학습 데이터 편향 | 특정 사업 유형에 문체가 편중될 가능성 | 과제 유형별 데이터 균형화 및 샘플 가중치 조정 |
| 생성 문장 환각 | 사실과 다른 수치·표현 생성 | RAG 기반 근거 연결 및 규칙 기반 후처리 적용 |
| 공고 적합성 부족 | 사업별 요구 항목 반영 누락 | 공고문 구조 파서 및 체크리스트형 검증 로직 적용 |
| 사용자 신뢰 부족 | 결과물에 대한 설명 가능성 부족 | 근거 출처, 수정 이유, 보완 제안 문구를 함께 제시 |`,
  },
  {
    id: 2,
    title: '선행연구개발 분석',
    markdown: `# 3. 선행연구개발

## (1) 선행연구개발 이력

본 과제는 생성형 AI를 활용하여 연구개발계획서의 초안 작성, 항목별 품질 검토, 규정 기반 보완 제안을 하나의 흐름으로 제공하는 지능형 문서 작성 지원 서비스 개발을 목표로 함. 주관기관인 (주)알앤디컴퍼니는 최근 3년간 법률, 특허, 행정 문서와 같이 구조가 복잡하고 전문 용어가 많은 수직 도메인 문서를 대상으로 LLM 응용 서비스와 데이터 파이프라인을 구축해 왔음.

참여기관인 한국혁신대학교 AI 연구소는 대규모 언어 모델의 파인튜닝, 경량화, 검색 증강 생성(RAG) 분야에서 선행 연구를 수행해 왔음. SCI급 논문 12건과 관련 특허 4건을 통해 검증된 언어 모델 최적화 역량은 본 과제에서 R&D 계획서 도메인에 특화된 문장 생성 품질과 추론 효율을 확보하는 기반임.

| 구분 | 기관명 | 주요 선행역량 | 본 과제 활용 방향 |
|------|--------|----------------|------------------|
| 주관기관 | (주)알앤디컴퍼니 | Vertical LLM 서비스화, 도메인 특화 데이터 파이프라인, 문서 구조화 엔진 | 사용자 입력을 연구개발계획서 항목별 초안으로 변환하는 핵심 엔진 개발 |
| 참여기관 | 한국혁신대학교 AI 연구소 | LLM 파인튜닝, 모델 경량화, RAG 기반 품질 개선 | R&D 도메인 언어 모델 최적화 및 생성 정확도 검증 |

### 1) 주요 선행연구개발 성과

| 선행성과 | 핵심 내용 | 정량적 성과 |
|----------|-----------|-------------|
| AI 기반 수직계열 문서 분석 시스템 | 법률 문장 간 논리 구조 분석 및 핵심 쟁점 추출 | 법률 비정형 텍스트 100만 건 이상 구조화, 도메인 이해도 15% 향상 |
| 기술문서 자동 분류·키워드 추출 엔진 | 특허 문서 IPC 자동 매핑 및 전문 용어 지식 그래프 구축 | 자동 분류 정확도 96.2% 달성 |
| LLM 응답 품질 개선 실험 | 도메인 데이터 기반 파인튜닝 및 RAG 적용 | 장문 응답의 근거 포함률 및 일관성 개선 |

## (2) 국내외 관련 기술 동향 및 차별성

최근 국내외에서는 범용 생성형 AI를 활용한 문서 생성 서비스가 확산되고 있으나, 대부분 일반 보고서·요약문 생성 수준에 머무르고 있으며 연구개발계획서와 같이 항목 간 논리 정합성, 정량 목표 설정, 연구비 편성 근거, 사업 공고 적합성 검토까지 요구되는 전문 문서 영역에서는 활용 한계가 존재함.

특히 해외 상용 LLM은 한국어 공공 R&D 문서 특유의 문체와 평가 항목 맥락에 대한 학습이 부족하고, 국내 일반 문서 자동화 도구는 공고문·유사과제·특허 데이터까지 연결한 근거 기반 작성 지원 기능이 제한적임. 따라서 본 과제는 범용 문장 생성이 아니라, R&D 도메인 특화 데이터와 규정 기반 검토 로직을 결합한 전문형 계획서 작성 엔진이라는 점에서 차별성을 가짐.

| 비교 항목 | 기존 범용 생성형 AI | 기존 문서 자동화 도구 | 본 과제의 개발 방향 |
|-----------|---------------------|------------------------|----------------------|
| 문체 적합성 | 일반 문체 중심 | 템플릿 중심 | 한국형 공공 R&D 문체 반영 |
| 근거 제시 | 제한적 | 거의 없음 | 유사과제·특허·공고 기반 근거 연계 |
| 항목 정합성 | 사용자 보완 필요 | 수동 입력 의존 | 항목 간 논리 일관성 자동 점검 |
| 사업 공고 대응성 | 범용 응답 중심 | 양식 대응 수준 | 공고 요건 기반 맞춤 초안 생성 |

## (3) 본 과제 수행 시 선행연구개발 결과 활용계획

| 기술 요소 | 선행연구 기반 | 본 과제 적용 방식 |
|-----------|---------------|------------------|
| 논리 구조 식별 엔진 | 법률 문서의 주장·근거·결론 추출 기술 | 연구 배경, 문제 정의, 개발 목표, 기대효과를 구분하여 계획서 목차에 자동 배치 |
| R&D 도메인 임베딩 모델 | 특허·기술문서 키워드 지식 그래프 | 국가 R&D 용어와 지원사업 규정에 맞춘 문장 추천 및 기술분류 매핑 |
| 검색 증강 생성(RAG) | 도메인 문서 검색 및 근거 보강 실험 | 유사과제, 법령, 사업 공고 기반의 근거 있는 보완 제안 생성 |

이와 같은 선행연구개발 결과는 본 과제에서 독립 기술로 재사용되는 수준을 넘어, 계획서 초안 작성-검토-보완의 전체 사용자 흐름 안에서 통합적으로 활용될 예정임. 이를 통해 기존 연구 성과를 실질 서비스 형태로 전환하고, 전문 문서 작성 분야에서 사업화 가능한 고부가가치 AI 서비스로 확장하고자 함.`,
  },
  {
    id: 3,
    title: '연구개발기관 실적',
    markdown: `# 4. 연구개발기관 실적

## (1) 주관기관: (주)알앤디컴퍼니

### 1) 기관 개요

(주)알앤디컴퍼니는 2019년 설립된 AI 기반 전문 문서 서비스 기업으로, 법률·특허·행정 문서 등 구조가 복잡한 전문 문서 영역을 대상으로 AI 분석·생성 서비스를 개발해 왔음. 현재 정규직 32명 중 연구개발 인력 22명, 서비스 운영 및 사업화 인력 10명으로 구성되어 있으며, 도메인 데이터 구축부터 모델 개발, 서비스 운영까지 전 주기를 자체 수행할 수 있는 체계를 보유하고 있음.

### 2) 인력 및 수행 체계

| 구분 | 인원 | 주요 역할 |
|------|------|-----------|
| PM/서비스기획 | 3명 | 과제 총괄, 요구사항 정의, 실증 운영 |
| AI 연구개발 | 9명 | 데이터 설계, 모델 학습, 성능 개선 |
| 플랫폼/백엔드 | 6명 | 서비스 아키텍처, 배포, 운영 안정화 |
| 프론트엔드/UI | 4명 | 사용자 흐름 설계, 편집/검토 화면 개발 |

### 3) 주요 수행 실적

| 과제명 | 수행 기간 | 지원기관 | 과제비(백만원) | 주요 성과 |
|--------|-----------|----------|---------------|-----------|
| AI 기반 법률 문서 자동 분석 플랫폼 | 2022.03 ~ 2023.12 | 과기정통부 | 800 | 법률 문서 100만건 구조화, 실서비스 출시 |
| 특허 문서 자동 분류 및 키워드 추출 엔진 | 2023.01 ~ 2024.06 | 산업부 | 500 | IPC 분류 정확도 96.2% 달성, 특허 검색 효율 개선 |
| 도메인 특화 LLM 파인튜닝 연구 | 2024.01 ~ 2024.12 | 과기정통부 | 600 | 도메인 이해도 15% 향상, 장문 응답 일관성 개선 |
| 공공 문서 작성 지원 SaaS PoC | 2024.07 ~ 2025.02 | 자체 개발 | 250 | 행정 문서 초안 자동 생성 및 검토 기능 검증 |

### 4) 지식재산권 및 사업화 실적

- 국내 특허 등록: 8건 (자연어처리, 문서 구조화 관련)
- 국내 특허 출원: 5건 (심사 중)
- SW 저작권 등록: 12건
- B2B PoC 및 유료 전환 고객: 14개 기관
- 누적 전문 문서 처리량: 150만 건 이상

## (2) 참여기관: 한국혁신대학교 AI 연구소

### 1) 연구소 개요

한국혁신대학교 AI 연구소는 2018년 설립되어 대규모 언어 모델, 자연어처리, 정보 검색, 지식기반 추론 분야의 기초 및 응용 연구를 수행하고 있음. 교수 5명, 전임연구원 15명, 대학원생 20명으로 구성되며, 최근 5년간 산업체 협력 과제를 통해 다수의 도메인 특화 AI 프로젝트를 수행해 왔음.

### 2) 주요 연구 실적

- SCI급 논문 발표: 28편 (최근 5년)
- 국내외 특허: 15건
- 기술이전: 4건 (매출 12억원)
- 국가 R&D 참여 과제: 11건
- 산학협력 기반 LLM 고도화 연구: 6건

### 3) 본 과제 수행 기여도

| 기관 | 핵심 역할 | 세부 수행 내용 |
|------|-----------|----------------|
| (주)알앤디컴퍼니 | 주관기관 | 서비스 기획, 데이터 파이프라인 구축, 플랫폼 개발, 실증 운영 |
| 한국혁신대학교 AI 연구소 | 참여기관 | LLM 파인튜닝, RAG 품질 개선, 성능 평가 체계 수립 |

## (3) 연구수행 준비도 및 인프라

본 컨소시엄은 이미 GPU 학습 서버, 벡터 검색 인프라, 전문 문서 코퍼스, 품질 평가 인력 풀을 확보하고 있어 과제 착수 즉시 데이터 구축과 핵심 모델 개발에 착수할 수 있음. 또한 주관기관은 서비스 운영 경험을 보유하고 있고, 참여기관은 성능 검증과 논문·특허 창출 역량을 보유하고 있어 연구개발과 사업화를 동시에 추진할 수 있는 실행 기반이 충분함.`,
  },
  {
    id: 4,
    title: '사업비 사용계획',
    markdown: `# 5. 사업비 사용계획

## (1) 총괄 사업비 편성

본 과제의 총 사업비는 20억원이며, 정부출연금 15억원(75%)과 민간부담금 5억원(25%)으로 구성됨. 총 수행기간 2개년에 걸쳐 1차년도 11억원, 2차년도 9억원으로 편성하며, 초기에는 데이터 구축과 모델 개발에, 후반에는 실증·고도화·사업화 준비에 예산을 집중 배분함.

사업비 편성의 기본 원칙은 다음과 같음.

- 인건비 중심 편성을 통해 핵심 기술 내재화를 우선 확보
- 장비 및 클라우드 예산은 학습/추론 인프라 안정화에 집중
- 위탁연구비는 데이터 라벨링 및 외부 전문평가 등 외부 수행이 필요한 영역에 한정
- 연차별 목표와 산출물 달성 시점에 맞춰 단계적으로 집행

## (2) 비목별 사업비 편성

| 비목 | 1차년도(백만원) | 2차년도(백만원) | 합계(백만원) | 비율 |
|------|----------------|----------------|-------------|------|
| 인건비 | 440 | 360 | 800 | 40% |
| 연구기자재 | 250 | 150 | 400 | 20% |
| 연구활동비 | 160 | 140 | 300 | 15% |
| 위탁연구비 | 110 | 90 | 200 | 10% |
| 간접비 | 90 | 70 | 160 | 8% |
| 연구수당 | 50 | 90 | 140 | 7% |
| **합계** | **1,100** | **900** | **2,000** | **100%** |

## (3) 기관별 사업비 분담

| 기관 | 정부출연금(백만원) | 민간부담금(백만원) | 합계(백만원) |
|------|-------------------|-------------------|-------------|
| (주)알앤디컴퍼니 | 1,050 | 500 | 1,550 |
| 한국혁신대학교 AI 연구소 | 450 | - | 450 |
| **합계** | **1,500** | **500** | **2,000** |

## (4) 과업-예산 연계 계획

| 과업명 | 주요 투입 비목 | 예산 편성 이유 |
|--------|----------------|----------------|
| 데이터 수집 및 라벨링 | 인건비, 위탁연구비, 연구활동비 | 대규모 문서 정제 및 항목별 라벨링 품질 확보 |
| 핵심 모델 학습 및 고도화 | 인건비, 연구기자재, 클라우드 사용료 | GPU 연산 자원과 반복 실험 비용 필요 |
| 서비스 통합 및 UI 개발 | 인건비, 연구활동비 | 웹 서비스 구현, 사용성 개선, 관리자 기능 개발 |
| 외부 평가 및 실증 운영 | 연구활동비, 위탁연구비 | 전문가 평가, 베타 테스트, 인증 대응 비용 발생 |

## (5) 주요 비목 산정 근거

- **인건비**: 책임연구원 2인, 선임연구원 4인, 연구원 6인 기준. 인건비 단가는 한국산업기술진흥협회 노임단가표 적용
- **연구기자재**: GPU 서버(A100 × 4) 1식, 고성능 스토리지 1식, 클라우드 서비스(AWS) 이용료
- **연구활동비**: 전문가 자문, 사용자 인터뷰, 실증 운영, 시험·인증 대응 및 기술문서 작성 비용 반영
- **위탁연구비**: 데이터 라벨링 위탁(10만건), 전문가 검수 데이터 구축 위탁, 베타테스트 운영 지원
- **간접비 및 연구수당**: 기관별 기준 비율을 적용하되 직접 연구활동을 저해하지 않는 범위로 편성

## (6) 집행 및 관리 계획

사업비는 분기 단위로 집행 실적을 점검하고, 과업 진척도와 연계하여 조정함. 특히 장비·클라우드 비용은 실제 학습 및 운영 로그에 기반하여 관리하고, 위탁연구비는 산출물 검수 완료 후 단계별로 지급하는 방식으로 운영함. 이를 통해 예산 집행의 적정성과 연구개발 성과 간 연계성을 동시에 확보할 계획임.`,
  },
  {
    id: 5,
    title: '연구개발 추진일정',
    markdown: `# 6. 연구개발 추진일정

## (1) 총괄 추진일정

총 수행기간은 2025년 4월부터 2027년 3월까지 2개년(24개월)이며, 데이터 구축, 모델 개발, 서비스 통합, 실증 및 확산 준비의 4개 단계로 구분하여 추진함. 각 단계는 선행 단계의 산출물을 다음 단계의 입력값으로 사용하는 구조로 설계하여 일정 지연이 전체 성과에 미치는 영향을 최소화함.

## (2) 단계별 추진일정

### 1단계: 데이터 파이프라인 구축 (2025.04 ~ 2025.09)

- R&D 계획서 학습 데이터 10만건 수집 및 전처리
- 항목별 구조화 라벨링 체계 확립
- 기초 모델 선정 및 벤치마크 환경 구축
- **산출물**: 학습 데이터셋, 벤치마크 리포트
- **검증 기준**: 라벨 일치율 95% 이상, 데이터 노이즈 비율 3% 이하

### 2단계: 핵심 모델 개발 (2025.10 ~ 2026.03)

- 문서 구조 분석 모델 개발 및 학습
- 항목별 문장 생성 모델 파인튜닝
- RAG 기반 근거 보강 모듈 구현
- **산출물**: 핵심 모델 3종, 내부 평가 보고서
- **검증 기준**: 항목 분류 정확도 93% 이상, 생성 문장 적합도 90% 이상

### 3단계: 서비스 통합 및 시제품 (2026.04 ~ 2026.09)

- 웹 기반 서비스 UI/UX 개발
- 초안 생성 → AI 검토 → 세부 기능 연계 워크플로우 통합
- 전문가 패널 블라인드 평가 (기술지도사 5인)
- **산출물**: 시제품(v1.0), 전문가 평가 결과서
- **검증 기준**: 시제품 전체 워크플로우 정상 동작, 전문가 적합도 평균 90점 이상

### 4단계: 실증 및 고도화 (2026.10 ~ 2027.03)

- 실사용자 베타 테스트 (N=100)
- 피드백 기반 모델 재학습 및 서비스 개선
- TTA 공인 시험 및 GS 인증 추진
- **산출물**: 최종 서비스(v2.0), GS 인증서, 최종 보고서
- **검증 기준**: 사용자 만족도 4.5 이상, 작성 시간 단축률 70% 이상

## (3) 분기별 상세 일정

| 기간 | 주요 수행 내용 | 핵심 산출물 |
|------|----------------|-------------|
| 2025 Q2 | 데이터 수집 계획 수립, 원천 데이터 확보, 라벨 체계 정의 | 데이터 수집 계획서, 라벨링 가이드 |
| 2025 Q3 | 문서 정제, 구조화 라벨링, 벤치마크 환경 구축 | 정제 데이터셋, 벤치마크 리포트 |
| 2025 Q4 | 구조 분석 모델 개발, 프롬프트 설계, 기초 성능 평가 | 구조 분석 모델 v1, 평가 결과서 |
| 2026 Q1 | 생성 모델 파인튜닝, RAG 모듈 연계, 품질 검토 로직 구현 | 생성 모델 v1, RAG 모듈 |
| 2026 Q2 | 서비스 백엔드/프론트엔드 통합, 저장/불러오기 기능 개발 | 시제품 서비스 알파 버전 |
| 2026 Q3 | 전문가 평가, 화면 개선, 항목별 수정 기능 고도화 | 시제품 v1.0, 전문가 평가서 |
| 2026 Q4 | 베타 사용자 테스트, 성능 개선, 운영 안정화 | 베타 운영 리포트 |
| 2027 Q1 | 최종 개선, 인증 대응, 사업화 준비 | 최종 서비스 v2.0, 최종 보고서 |

## (4) 마일스톤 및 게이트 관리

| 마일스톤 | 목표 시점 | 판정 기준 |
|----------|-----------|-----------|
| M1. 데이터셋 구축 완료 | 2025.09 | 학습용 문서 10만건 구축 및 라벨 검수 완료 |
| M2. 핵심 모델 1차 완료 | 2026.03 | 구조 분석/초안 생성/RAG 모듈 통합 완료 |
| M3. 시제품 검증 완료 | 2026.09 | 전문가 평가 평균 90점 이상 확보 |
| M4. 실증 및 최종 고도화 완료 | 2027.03 | 사용자 만족도 및 정량 목표 달성 |

## (5) 일정 리스크 관리

일정 지연 가능성이 높은 데이터 라벨링, 외부 평가, 인증 대응 업무는 선제적으로 버퍼 기간을 확보하여 관리함. 핵심 모델 개발과 서비스 통합은 병렬 수행 가능한 범위를 최대화하고, 외부 의존도가 높은 과업은 월별 점검회의를 통해 조기 경보 체계를 운영할 계획임.`,
  },
  {
    id: 6,
    title: '기대효과 및 활용방안',
    markdown: `# 7. 연구개발성과의 활용방안 및 기대효과

## (1) 기술적 기대효과

본 과제를 통해 확보되는 핵심 기술은 전문 행정 문서의 자동 생성과 품질 검증을 결합한 합성형 문서 AI 기술로, 기존의 단순 검색·분류 중심 기술과 차별화됨. 특히 도메인 특화 LLM 파인튜닝, 구조화 문서 생성, 규정 기반 자동 검증, 근거 검색 기반 보완 제안 기술은 R&D 계획서뿐 아니라 다양한 전문 문서 영역으로 확장 가능함.

세부 기술적 기대효과는 다음과 같음.

- 연구개발계획서 항목 단위 구조 이해 및 자동 초안 생성 기술 확보
- 유사과제·공고문·특허를 연결한 근거 기반 문장 생성 기술 확보
- 정량 목표, 일정, 사업비 간 논리 정합성 자동 점검 기술 확보
- 전문 행정문서 도메인으로 재활용 가능한 Vertical LLM 서비스 프레임워크 확보

## (2) 경제적 기대효과

| 항목 | 1차년도 | 2차년도 | 3차년도 | 비고 |
|------|---------|---------|---------|------|
| 직접 매출 | - | 3억원 | 15억원 | SaaS 구독 모델 |
| 기술이전 수익 | - | 2억원 | 5억원 | 공공기관·대기업 대상 |
| 비용 절감 효과 | 5억원 | 20억원 | 50억원 | 사용자 기준 절감액 |
| 신규 고용 창출 | 3명 | 8명 | 15명 | 개발·운영·사업화 인력 |

국내 문서 자동화 시장은 2025년 기준 약 2,300억원 규모로 추정되며, 연평균 15% 이상 성장이 전망됨. 본 과제 성과물은 정부지원사업 준비 수요가 높은 중소기업, 기술창업기업, 연구기관을 초기 타깃으로 하며, 3년 내 시장 점유율 5% 달성을 목표로 함.

## (3) 사회적 기대효과

- 중소기업·스타트업의 정부지원사업 접근성 향상: 전문 인력 없이도 양질의 계획서 작성 가능
- R&D 행정 효율화: 평가 기관의 사전 검토 부담 경감
- AI 기반 공공 행정 서비스 확산에 기여
- 계획서 품질 표준화: 문서 완성도 편차 완화 및 공정한 평가 환경 조성
- 연구자의 비핵심 문서 업무 부담 감소: 기술개발 집중도 향상

## (4) 활용방안

### 1) 단기 활용 (1~2년)

- 정부 R&D 과제 계획서 작성 지원 SaaS 서비스 출시
- 창업진흥원, 중소벤처기업부 등 공공기관 연계 시범 서비스
- 연구소·대학 산학협력단 대상 파일럿 도입
- 민간 액셀러레이터 및 컨설팅사 협업을 통한 초기 시장 검증

### 2) 중장기 활용 (3~5년)

- 투자제안서, 규제 샌드박스 신청서, 기술사업화 보고서 등으로 문서 유형 확장
- 해외 시장 진출 (영문 R&D proposal 지원)
- API 형태로 기업 내부 시스템 연동 제공
- 과제 추천, 연구비 검토, 성과보고서 작성까지 확장 가능한 통합 R&D 문서 플랫폼 구축

## (5) 사업화 로드맵

| 단계 | 기간 | 사업화 전략 | 목표 |
|------|------|-------------|------|
| 1단계 | 과제 수행 중 | 시제품 기반 PoC 확보 | 공공/민간 파일럿 3건 이상 |
| 2단계 | 과제 종료 후 1년 | SaaS 정식 출시 및 유료 전환 | 유료 고객 50개사 확보 |
| 3단계 | 과제 종료 후 2~3년 | 공공기관/대기업 기술이전 및 API 공급 | 누적 매출 20억원 달성 |

## (6) 성과 확산 계획

성과 확산은 단순 서비스 출시를 넘어, 실증기관 사례집 구축, 공공기관 협력 세미나 개최, 기술백서 발간, 학술 논문 및 특허 출원으로 연계하여 추진함. 이를 통해 연구개발 성과를 기술적 성과, 사업화 성과, 정책 확산 성과로 다층적으로 확장할 계획임.`,
  },
];

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

export function Start2Page({
  announcementName,
}: {
  announcementName?: string;
}) {
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

  // R&D 계획서 카드 클릭 시점에만 모달 노출 (사이드네비 탐색 시에는 뜨지 않음)
  const [showIntakeModal, setShowIntakeModal] = useState(false);
  const [pendingTemplateId, setPendingTemplateId] = useState<number | null>(null);

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
  const [currentSection, setCurrentSection] = useState(0);
  const [sectionViewMode, setSectionViewMode] = useState<'text' | 'slide'>('text');

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

    const section = SECTION_ITEMS[currentSection];
    const isFirst = currentSection === 0;
    const isLast = currentSection === SECTION_ITEMS.length - 1;
    const canToggleSectionView = section.id === 6;
    const activeSectionViewMode = canToggleSectionView ? sectionViewMode : 'text';

    return (
      <>
        <StyledStepTitle>연구개발계획서 초안입니다</StyledStepTitle>

        <StyledDisclaimerBanner>
          <Info size={16} style={{ flexShrink: 0, color: '#2C81FC' }} />
          본 초안은 외부 데이터 없이 사용자 입력만으로 생성되었습니다. 우측 세부 기능을 활용하여 외부 데이터 기반 검증 및 보완을 진행하세요.
        </StyledDisclaimerBanner>

        <StyledPageIndicator>
          <StyledPageButton
            $disabled={isFirst}
            onClick={() => { if (!isFirst) { setCurrentSection((s) => s - 1); setSectionViewMode('text'); scrollToTop(); } }}
          >
            <ChevronLeft size={18} />
          </StyledPageButton>
          <StyledPageInfo>
            <span style={{ color: '#2C81FC' }}>{currentSection + 1}</span>
            <span style={{ color: '#B5B9C4', margin: '0 2px' }}>/</span>
            <span style={{ color: '#B5B9C4', marginRight: 10 }}>{SECTION_ITEMS.length}</span>
            {section.title}
          </StyledPageInfo>
          <StyledPageButton
            $disabled={isLast}
            onClick={() => { if (!isLast) { setCurrentSection((s) => s + 1); setSectionViewMode('text'); scrollToTop(); } }}
          >
            <ChevronRight size={18} />
          </StyledPageButton>
        </StyledPageIndicator>

        {canToggleSectionView && (
          <StyledViewTabs>
            <StyledViewTab $active={sectionViewMode === 'text'} onClick={() => setSectionViewMode('text')}>
              <BookOpen size={15} />
              텍스트
            </StyledViewTab>
            <StyledViewTab $active={sectionViewMode === 'slide'} onClick={() => setSectionViewMode('slide')}>
              <BarChart3 size={15} />
              슬라이드
            </StyledViewTab>
          </StyledViewTabs>
        )}

        <StyledSplitView>
          {activeSectionViewMode === 'text' ? (
            <StyledMarkdownPane>
              <Streamdown>{section.markdown}</Streamdown>
            </StyledMarkdownPane>
          ) : (
            <StyledSlidePlaceholder>
              시각자료가 들어갈 영역 (차트, 이미지 등)
            </StyledSlidePlaceholder>
          )}

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
              onSelectTemplate={(id) => {
                if (id === null) {
                  setSelectedTemplateFileId(null);
                  return;
                }
                setPendingTemplateId(id);
                setShowIntakeModal(true);
              }}
              onDraftSelect={() => {}}
              onUploadComplete={() => {
                setCurrentStep(2);
                scrollToTop();
              }}
              onLoadDraft={loadStep1Draft}
              draftStorageKey={DRAFT_STORAGE_KEY}
              draftCardName={announcementName}
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

      {/* ─── 모달: 기업정보 유도 (R&D 계획서 카드 선택 시) ─── */}
      <RecommendIntroModal
        open={showIntakeModal}
        onRecommend={() => {
          setShowIntakeModal(false);
          setPendingTemplateId(null);
          navigate({ to: '/company' });
        }}
        onIgnore={() => {
          setShowIntakeModal(false);
          if (pendingTemplateId !== null) {
            setSelectedTemplateFileId(pendingTemplateId);
            setPendingTemplateId(null);
          }
        }}
      />

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
