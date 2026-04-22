import { useMemo } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { ChevronRight, X } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';
import {
  StyledAllNoticesLink,
  StyledBody,
  StyledCloseButton,
  StyledContent,
  StyledFooter,
  StyledHeader,
  StyledNoticeItem,
  StyledNoticeItemBody,
  StyledNoticeItemDate,
  StyledNoticeItemHeader,
  StyledNoticeItemTitle,
  StyledOverlay,
  StyledTitle
} from '@/routes/-components/NoticeModal/NoticeModal.style';

interface NoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ALL_NOTICES_URL =
  'https://docshunt.notion.site/31245318b86080408bf2e5af3970bc9e?v=31245318b8608015bbee000c129276d6';

const DOC_EDITOR_BETA_NOTE_URL =
  'https://docshunt.notion.site/beta-32c45318b86080888ccbf9fb1371c44b';

const SVG_ENGINE_NOTE_URL =
  'https://docshunt.notion.site/SVG-32245318b86080efbf1be1f393acb637';

const DOC_STYLE_NOTE_URL =
  'https://docshunt.notion.site/31f45318b8608041a165d6e867ee36aa';

const NOTICE_RETENTION_DAYS = 30;

interface Notice {
  title: string;
  date: string;
  body: string;
  url: string;
}

const COPY = {
  ko: {
    modalTitle: '새로운 소식이 도착했어요!',
    close: '닫기',
    allNotices: '전체 업데이트 보기',
    notices: [
      {
        title: '문서 에디터(beta) 기능 출시',
        date: '2026.03.23',
        body: '양식 채우기에서 내보내기한 문서를 직접 편집하거나, AI에게 수정을 요청하고 변경 사항을 항목별로 반영할 수 있습니다.',
        url: DOC_EDITOR_BETA_NOTE_URL
      },
      {
        title: 'SVG 기반 고해상도 시각화 엔진 도입',
        date: '2026.03.12',
        body: '이제 문서를 생성하면 내용에 맞는 이미지가 자동으로 생성되어 삽입됩니다.',
        url: SVG_ENGINE_NOTE_URL
      },
      {
        title: '문서 스타일 설정 기능',
        date: '2026.03.10',
        body: '사업계획서 생성 시 대제목, 소제목, 본문, 캡션의 글꼴, 크기, 굵기, 줄간격, 문단 간격을 자유롭게 설정할 수 있습니다.',
        url: DOC_STYLE_NOTE_URL
      },
      {
        title: '친구 초대 기능 업데이트',
        date: '2026.03.03',
        body: '나만의 독스헌트 링크로 친구를 초대하세요. 5명 초대 시 1개월 무료, 10명 초대 시 1년 무료!',
        url: 'https://docshunt.notion.site/2026-Event-31845318b8608040a425c7bc98dce4a5'
      }
    ] as Notice[]
  },
  en: {
    modalTitle: "Here's what's new!",
    close: 'Close',
    allNotices: 'View all updates',
    notices: [
      {
        title: 'Document Editor (Beta) Launch',
        date: '2026.03.23',
        body: 'Edit documents exported from Form Fill directly, or request AI edits and review each change individually.',
        url: DOC_EDITOR_BETA_NOTE_URL
      },
      {
        title: 'High-resolution SVG visualization engine',
        date: '2026.03.12',
        body: 'Images are now automatically generated and inserted to match your document content.',
        url: SVG_ENGINE_NOTE_URL
      },
      {
        title: 'Document Style Settings',
        date: '2026.03.10',
        body: 'Customize font, size, weight, line spacing, and paragraph spacing for titles, subtitles, body text, and captions when generating business plans. Your settings are automatically saved and restored on your next visit.',
        url: DOC_STYLE_NOTE_URL
      },
      {
        title: 'Invite Friends Update',
        date: '2026.03.03',
        body: 'Invite friends with your personal DocsHunt link. 5 invites = 1 month free, 10 invites = 1 year free!',
        url: 'https://docshunt.notion.site/2026-Event-31845318b8608040a425c7bc98dce4a5'
      }
    ] as Notice[]
  }
};

function getRecentNotices(notices: Notice[]): Notice[] {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - NOTICE_RETENTION_DAYS);

  return notices.filter((notice) => {
    const [y, m, d] = notice.date.split('.').map(Number);
    return new Date(y, m - 1, d) >= cutoff;
  });
}

/** 가장 최신 공지의 날짜. 새 공지 추가 시 자동으로 갱신됨. */
export const LATEST_NOTICE_VERSION = COPY.ko.notices[0].date;

/** 30일 이내 공지가 하나라도 있는지 확인 */
export function hasRecentNotices(): boolean {
  return getRecentNotices(COPY.ko.notices).length > 0;
}

export function NoticeModal({ isOpen, onClose }: NoticeModalProps) {
  const { currentLanguage } = useI18n(['main']);
  const copy = currentLanguage === 'en' ? COPY.en : COPY.ko;
  const visibleNotices = useMemo(
    () => getRecentNotices(copy.notices),
    [copy.notices]
  );

  return (
    <DialogPrimitive.Root
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      {isOpen && (
        <DialogPrimitive.Portal>
          <StyledOverlay />
          <StyledContent>
            <StyledHeader>
              <StyledTitle>{copy.modalTitle}</StyledTitle>
              <StyledCloseButton aria-label={copy.close}>
                <X size={24} />
              </StyledCloseButton>
            </StyledHeader>

            <StyledBody>
              {visibleNotices.map((notice) => (
                <StyledNoticeItem key={notice.title}>
                  <StyledNoticeItemHeader
                    href={notice.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <StyledNoticeItemTitle>
                      {notice.title}
                    </StyledNoticeItemTitle>
                    <ChevronRight size={18} color="#262933" />
                  </StyledNoticeItemHeader>
                  <StyledNoticeItemDate>{notice.date}</StyledNoticeItemDate>
                  <StyledNoticeItemBody>{notice.body}</StyledNoticeItemBody>
                </StyledNoticeItem>
              ))}
            </StyledBody>

            <StyledFooter>
              <StyledAllNoticesLink
                href={ALL_NOTICES_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                {copy.allNotices}
                <ChevronRight size={16} />
              </StyledAllNoticesLink>
            </StyledFooter>
          </StyledContent>
        </DialogPrimitive.Portal>
      )}
    </DialogPrimitive.Root>
  );
}
