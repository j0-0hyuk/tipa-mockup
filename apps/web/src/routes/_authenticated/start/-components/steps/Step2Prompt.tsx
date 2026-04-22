import styled from '@emotion/styled';
import { Flex, TextArea, Button, useToast } from '@docs-front/ui';
import { StyledPageTitle } from '../../-route.style';
import { WandSparkles, HelpCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { generateAI } from '@/api/ai';

const StyledAiTextArea = styled(TextArea)`
  width: 100% !important;
  min-height: 120px;
  padding: 20px 20px 48px 20px !important;
  border: 1px solid #E3E4E8 !important;
  border-radius: 12px !important;
  font-size: 14px !important;
  line-height: 1.7 !important;
  font-weight: 400 !important;
  letter-spacing: -0.02em !important;
  color: #25262C !important;
  resize: none !important;
  &:focus { border-color: #2C81FC !important; box-shadow: 0 0 0 2px rgba(44,129,252,0.12) !important; outline: none !important; }
  &::placeholder { color: #B5B9C4 !important; }
`;

const AI_QUESTIONS_BASIC = [
  { num: '1', title: 'Problem: 고객이 겪고 있는 가장 큰 고통, Pain Point가 무엇인가요?', placeholder: '누구에게, 어떤 상황에서 발생하는 문제인가요?' },
  { num: '2', title: 'Solution: 우리만의 차별화된 해결 방식은 무엇인가요?', placeholder: '어떤 기능이나 서비스로 고객의 고통을 없애주나요? 기존 방식보다 무엇이 더 좋아지나요?' },
  { num: '3', title: 'Target: 우리 서비스에 가장 먼저 돈을 지불할 핵심 타겟은 누구인가요?', placeholder: '연령, 직업, 라이프스타일 혹은 기업 규모와 업종을 키워드로 입력하세요. (예: 30대 남성 직장인, 연 매출 10억 이하 IT 스타트업)' },
  { num: '4', title: 'Competitor: 우리가 넘어서야 할 경쟁사는 누구인가요?', placeholder: '경쟁사 이름은 적어주셔도, 좋아요. 일반적 고객이 지금 대신 사용 중인 도구나 방법을 적어주세요.' },
  { num: '5', title: 'Market: 우리가 뛰어 이길 시장은 어디인가요?', placeholder: '전체 이 서비스를 필요로 하는 사람들이 얼마나 많은지, 혹은 전체 시장의 규모나 성격(예: 국내 SaaS 시장, 에듀테크 시장 현황을 아는 대로 적어주세요.' },
  { num: '6', title: 'Traction: 지금까지 어떤 유의미한 성과나 지표를 만들었나요?', placeholder: '매출, 유저 수, PoC(테스트) 결과, 수상 실적, 협약 체결 등 의미있는 의미 있는 수치를 적어주세요. 아직 없다면 제품 개발 중이라고 적으셔도 됩니다.' },
  { num: '7', title: 'Strategy: 시장에 어떻게 진입하고 고객을 모을 건가요?', placeholder: '어떤 핵심(SNS, 콜드메일, 커뮤니티, 영업 채널)을 통해 고객을 만날 건가요? 초기 100명의 고객을 어떻게 모을지 생각하는 대로 적어주세요.' },
  { num: '8', title: 'Business Model: 어떻게 돈을 벌고 성장하며 지속 가능할 수 있나요?', placeholder: '구독료, 수수료 등 과금 방식을 적어주세요.' },
  { num: '9', title: 'Milestone: 앞으로의 주요 목표와 일정은 어떻게 되나요?', placeholder: '제품 출시, 특정 매출 달성, 투자 유치 등 가장 중요한 이벤트를 시기와 함께 적어주세요.' },
];

const AI_QUESTIONS_RND = [
  { num: '1', title: '기술 개발의 필요성: 기존 기술의 한계점과 왜 이 기술을 지금 개발해야 하나요?', placeholder: '기존 방식의 기술적 병목현상이나 미충족 수요는 무엇인가요?', guide: '평가 기준: 기존 기술의 한계를 구체적 수치로 제시하고, 개발 시급성의 근거(시장 변화, 정책 동향)를 명시해야 합니다.' },
  { num: '2', title: '기술 개발의 목표: 개발하고자 하는 핵심 기술의 정체와 최종 목표치는 무엇인가요?', placeholder: '구현하려는 핵심 기능과 성능 지표(속도, 정확도, 용량 등)를 구체적으로 적어주세요.', guide: '평가 기준: KPI를 정량적으로 3개 이상 제시하고, 측정 기준(BLEU, ROUGE 등)을 명시해야 합니다.' },
  { num: '3', title: '기술의 차별성 및 혁신성: 국내외 유사 기술과 비교했을 때 우리만의 독창적인 점은 무엇인가요?', placeholder: '경쟁사 대비 압도적인 기술적 우위나 특허로 보호받을 수 있는 핵심 로직을 적어주세요.', guide: '평가 기준: 비교 대상(경쟁 기술 2~3개)을 명시하고 성능 비교표를 포함하면 높은 점수를 받습니다.' },
  { num: '4', title: '연구 수행 방법 및 내용: 목표 달성을 위해 어떤 단계로 연구를 진행하실 계획인가요?', placeholder: '설계, 구현, 테스트, 공인인증시험 등 기술 개발의 전체 프로세스를 요약해 주세요.', guide: '평가 기준: 단계별 산출물과 검증 방법을 명시해야 합니다. 단계 간 의존관계도 설명하면 좋습니다.' },
  { num: '5', title: '개발 기술의 시장성: 개발된 기술이 적용될 시장의 규모와 전방 산업의 동향은 어떠한가요?', placeholder: '이 기술이 상용화되었을 때 진입할 수 있는 시장 규모와 성장세를 적어주세요.', guide: '평가 기준: TAM/SAM/SOM을 구분하여 시장 규모를 제시하고, 출처를 명시해야 합니다.' },
  { num: '6', title: '사업화 전략 및 로드맵: 기술 개발 완료 후 어떻게 매출을 만들고 시장에 안착하실 건가요?', placeholder: '비즈니스 모델(BM)과 초기 수요처 확보 방안을 구체적으로 적어주세요.', guide: '평가 기준: BM(과금 방식)과 초기 고객 확보 전략을 구분하여 작성해야 합니다.' },
  { num: '7', title: '지식재산권 확보 및 보호: 기술 보안 및 특허 확보를 위해 어떤 준비를 하고 계신가요?', placeholder: '현재 보유 중이거나 향후 출원 예정인 특허 및 기술 보호 방안을 적어주세요.', guide: '평가 기준: 현재 보유 특허 수, 출원 예정 건수, 기술 보호 방안(영업비밀, 접근 통제 등)을 포함해야 합니다.' },
  { num: '8', title: '연구 인력 및 인프라: 왜 우리 팀이 이 고난도 기술 개발을 성공시킬 수 있나요?', placeholder: '핵심 개발 인력의 전공, 논문 실적, 유사 프로젝트 수행 경험을 강조해 주세요.', guide: '평가 기준: 책임연구원의 유사 과제 수행 이력, 논문/특허 실적이 핵심입니다. 누락 시 감점 대상.' },
  { num: '9', title: '파급 효과: 기술 개발 성공 시 산업적, 사회적으로 어떤 변화가 일어나나요?', placeholder: '고용 창출, 수입 대체 효과, 산업 전반의 효율성 증대 측면에서 적어주세요.', guide: '평가 기준: 정량적 파급효과(고용 창출 수, 매출 규모)와 정성적 효과를 구분하여 작성해야 합니다.' },
];

interface Step2Props {
  prompt: string;
  onPromptChange: (value: string) => void;
  templateName: string;
  draftType?: 'basic' | 'rnd';
}

export function Step2Prompt({ prompt, onPromptChange, templateName, draftType = 'basic' }: Step2Props) {
  const toast = useToast();
  const [aiAnswers, setAiAnswers] = useState<Record<string, string>>({});
  const [aiLoading, setAiLoading] = useState<string | null>(null);
  const [aiFeedback, setAiFeedback] = useState<Record<string, string>>({});
  const [guideOpen, setGuideOpen] = useState<Record<string, boolean>>({});

  const AI_QUESTIONS = draftType === 'rnd' ? AI_QUESTIONS_RND : AI_QUESTIONS_BASIC;

  const handleAiAnswer = (num: string, value: string) => {
    setAiAnswers((prev) => ({ ...prev, [num]: value }));
  };

  const handleAiJudge = async (num: string) => {
    const question = AI_QUESTIONS.find(q => q.num === num);
    const answer = aiAnswers[num];

    if (!answer?.trim()) {
      toast.open({ content: '먼저 답변을 입력해주세요.', duration: 2000 });
      return;
    }

    setAiLoading(num);
    try {
      const reviewerRole = draftType === 'rnd'
        ? '당신은 정부 R&D 과제 심사위원입니다. 아래 질문에 대한 답변을 기술성, 혁신성, 사업화 가능성 관점에서 심사하고, 더 설득력 있게 개선할 수 있는 구체적인 피드백을 한국어로 제공해주세요.'
        : '당신은 창업 사업계획서 심사역입니다. 아래 질문에 대한 답변을 심사하고, 더 설득력 있게 개선할 수 있는 구체적인 피드백을 한국어로 제공해주세요.';
      const result = await generateAI({
        prompt: `${reviewerRole}

질문: ${question?.title}
답변: ${answer}

피드백:`,
      });
      setAiFeedback(prev => ({ ...prev, [num]: result.text }));
    } catch {
      toast.open({ content: 'AI 심사역 응답에 실패했습니다. 다시 시도해주세요.', duration: 3000 });
    } finally {
      setAiLoading(null);
    }
  };

  // aiAnswers → prompt 동기화
  useEffect(() => {
    const entries = AI_QUESTIONS
      .filter(q => aiAnswers[q.num]?.trim())
      .map(q => `[${q.num}. ${q.title}]\n${aiAnswers[q.num]}`);
    if (entries.length > 0) {
      onPromptChange(entries.join('\n\n'));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aiAnswers]);

  return (
    <div style={{ maxWidth: 1080, margin: '0 auto' }}>
      <StyledPageTitle style={{ marginBottom: 24 }}>계획서 작성을 위한 상세 입력</StyledPageTitle>

      {/* Info Banner — 프로토타입: bg-light #FAFAFC, text-2 #596070, radius 8px */}
      <div style={{
        background: '#FAFAFC',
        borderRadius: 8,
        padding: '14px 18px',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        marginBottom: 20,
        fontSize: 13,
        lineHeight: '19.5px',
        letterSpacing: '-0.02em',
        color: '#596070',
      }}>
        <span style={{ color: '#6E7687', flexShrink: 0, fontSize: 14 }}>ⓘ</span>
        각 항목에 구체적으로 입력할수록 더 정확한 문서가 생성됩니다. AI 도움 버튼으로 작성한 내용을 점검할 수 있습니다.
      </div>

      <Flex direction="column" gap={24} style={{ width: '100%' }}>
          {AI_QUESTIONS.map((q) => (
            <Flex key={q.num} direction="column" gap={8}>
              <Flex alignItems="center" gap="6px">
                <span
                  style={{
                    fontWeight: 600,
                    fontSize: 14,
                    lineHeight: '21px',
                    color: '#25262C',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {q.num}. {q.title}
                </span>
                {'guide' in q && (q as { guide?: string }).guide && (
                  <button
                    onClick={() => setGuideOpen(prev => ({ ...prev, [q.num]: !prev[q.num] }))}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, display: 'flex', flexShrink: 0 }}
                    title="작성 가이드"
                  >
                    <HelpCircle size={16} color={guideOpen[q.num] ? '#2C81FC' : '#B5B9C4'} />
                  </button>
                )}
              </Flex>
              {guideOpen[q.num] && 'guide' in q && (
                <div style={{
                  fontSize: 12, lineHeight: 1.6, color: '#4B5563', background: '#F0F6FF',
                  borderRadius: 6, padding: '8px 12px', borderLeft: '3px solid #2C81FC',
                }}>
                  {(q as { guide?: string }).guide}
                </div>
              )}
              <div style={{ position: 'relative' }}>
                <StyledAiTextArea
                  value={aiAnswers[q.num] || ''}
                  onChange={(e) => handleAiAnswer(q.num, e.target.value)}
                  placeholder={q.placeholder}
                />
                <Button
                  variant="outlined"
                  size="small"
                  disabled={aiLoading === q.num || (aiAnswers[q.num] || '').trim().length < 3}
                  onClick={() => handleAiJudge(q.num)}
                  style={{
                    position: 'absolute',
                    bottom: 12,
                    right: 14,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    fontSize: 12,
                  }}
                >
                  <WandSparkles size={14} />
                  {aiLoading === q.num ? '분석 중...' : 'AI 도움'}
                </Button>
              </div>
              {aiFeedback[q.num] && (
                <div style={{
                  background: '#F0F6FF',
                  borderRadius: 8,
                  padding: 16,
                  fontSize: 13,
                  color: '#2C81FC',
                  lineHeight: 1.7,
                  letterSpacing: '-0.02em',
                }}>
                  <div style={{ fontWeight: 600, marginBottom: 6 }}>AI 피드백:</div>
                  <div style={{ whiteSpace: 'pre-wrap' }}>{aiFeedback[q.num]}</div>
                </div>
              )}
            </Flex>
          ))}
      </Flex>
    </div>
  );
}
