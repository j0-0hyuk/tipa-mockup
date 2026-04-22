import i18n from '@/i18n';
import type { DetailInputPageForm } from '@/schema/main/detailInput';

const t = i18n.t;

export const DETAIL_INPUT_FIELDS: Array<{
  name: keyof DetailInputPageForm;
  label: string;
  placeholder: string;
}> = [
  {
    name: 'problem',
    label:
      '1. Problem: 고객이 겪고 있는 가장 큰 고통, Pain Point가 무엇인가요?',
    placeholder: '누구에게, 어떤 상황에서 발생하는 문제인가요?'
  },
  {
    name: 'solution',
    label: '2. Solution: 우리만의 차별화된 해결 방식은 무엇인가요?',
    placeholder:
      '어떤 기능이나 서비스로 고객의 고통을 없애주나요? 기존 방식보다 무엇이 더 좋아지나요?'
  },
  {
    name: 'target',
    label:
      '3. Target: 우리 서비스에 가장 먼저 돈을 지불할 핵심 타겟은 누구인가요?',
    placeholder:
      '연령, 직업, 라이프스타일 혹은 기업 규모와 업종을 키워드로 입력하세요. (예: 30대 남성 직장인, 연 매출 10억 미만 IT 스타트업)'
  },
  {
    name: 'competitor',
    label: '4. Competitor: 우리가 넘어서야 할 경쟁사는 누구인가요?',
    placeholder:
      '경쟁사 이름만 적어주셔도 좋아요. 없다면 고객이 지금 대신 사용 중인 도구나 방법을 적어주세요.'
  },
  {
    name: 'market',
    label: '5. Market: 우리가 싸워 이길 시장은 어디인가요?',
    placeholder:
      '현재 이 서비스를 필요로 하는 사람들이 얼마나 많은지, 혹은 전체 시장의 규모나 성격(예: 국내 SaaS 시장, 에듀테크 시장 등)을 아는 대로 적어주세요.'
  },
  {
    name: 'traction',
    label: '6. Traction: 지금까지 어떤 유의미한 성과나 지표를 만들었나요?',
    placeholder:
      "매출, 유저 수, PoC(테스트) 결과, 수상 실적, 협약 체결 등 작지만 의미 있는 숫자를 적어주세요. 아직 없다면 '제품 개발 중'이라고만 적으셔도 됩니다."
  },
  {
    name: 'strategy',
    label: '7. Strategy: 시장에 어떻게 진입하고 고객을 모을 건가요?',
    placeholder:
      '어떤 채널(SNS, 콜드메일, 커뮤니티, 영업 등)을 통해 고객을 만날 건가요? 초기 100명의 고객을 어떻게 모을지 생각나는 대로 적어주세요.'
  },
  {
    name: 'businessModel',
    label:
      '8. Business Model: 어떻게 돈을 벌고 성장하며 지속 가능할 수 있나요?',
    placeholder: '구독료, 수수료 등 과금 방식을 적어주세요.'
  },
  {
    name: 'milestone',
    label: '9. Milestone: 앞으로의 주요 목표와 일정은 어떻게 되나요?',
    placeholder:
      '제품 출시, 특정 매출 달성, 투자 유치 등 가장 중요한 이벤트를 시기와 함께 적어주세요.'
  },
  {
    name: 'financialPlan',
    label: '10. Financial Plan: 필요한 자금과 매출 목표는 무엇인가요?',
    placeholder:
      '필요한 자금(정부지원금 등)의 용도와 1~3년 뒤 예상되는 매출액을 대략적으로 적어주세요.'
  },
  {
    name: 'teamAndVision',
    label: '11. Team & Vision: 왜 우리 팀이 성공시킬 수 있나요?',
    placeholder:
      '대표자 및 팀원들의 핵심 경력이나 전문성, 그리고 사업의 장기적인 비전을 적어주세요.'
  }
];

export interface DetailInputFieldConfig {
  name: string;
  label: string;
  placeholder: string;
  tooltip?: string[];
}

export const OPTIONAL_INPUTS: DetailInputFieldConfig[] = [
  {
    name: 'businessStory',
    label: t('main:detailInput.optionalForm.businessStory.label'),
    placeholder: t('main:detailInput.optionalForm.businessStory.placeholder'),
    tooltip: t('main:detailInput.optionalForm.businessStory.tooltip', {
      returnObjects: true
    }) as unknown as string[]
  },
  {
    name: 'marketAndStrategy',
    label: t('main:detailInput.optionalForm.marketAndStrategy.label'),
    placeholder: t(
      'main:detailInput.optionalForm.marketAndStrategy.placeholder'
    ),
    tooltip: t('main:detailInput.optionalForm.marketAndStrategy.tooltip', {
      returnObjects: true
    }) as unknown as string[]
  },
  {
    name: 'revenueAndFinancials',
    label: t('main:detailInput.optionalForm.revenueAndFinancial.label'),
    placeholder: t(
      'main:detailInput.optionalForm.revenueAndFinancial.placeholder'
    ),
    tooltip: t('main:detailInput.optionalForm.revenueAndFinancial.tooltip', {
      returnObjects: true
    }) as unknown as string[]
  },
  {
    name: 'progressAndRoadmap',
    label: t('main:detailInput.optionalForm.progressAndRoadmap.label'),
    placeholder: t(
      'main:detailInput.optionalForm.progressAndRoadmap.placeholder'
    ),
    tooltip: t('main:detailInput.optionalForm.progressAndRoadmap.tooltip', {
      returnObjects: true
    }) as unknown as string[]
  },
  {
    name: 'teamName',
    label: t('main:detailInput.optionalForm.companyName.label'),
    placeholder: t('main:detailInput.optionalForm.companyName.placeholder')
  }
];
