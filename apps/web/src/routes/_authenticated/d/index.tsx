import {
  StyledDocsTitle,
  StyledNavButton,
  StyledMainContainer,
  StyledNavContainer
} from '@/routes/_authenticated/d/-index.style';
import { Flex, Pagination } from '@docs-front/ui';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { z } from 'zod';
import { useI18n } from '@/hooks/useI18n';
import DraftSection from '@/routes/_authenticated/d/-components/DraftSection/DraftSection';
import ExportSection from '@/routes/_authenticated/d/-components/ExportSection/ExportSection';

const CATEGORY_DRAFT = 'draft';
const CATEGORY_EXPORT = 'export';

const docsSearchSchema = z.object({
  page: z.number().optional().default(1),
  category: z
    .enum([CATEGORY_DRAFT, CATEGORY_EXPORT])
    .optional()
    .default(CATEGORY_EXPORT)
});

export const Route = createFileRoute('/_authenticated/d/')({
  validateSearch: docsSearchSchema,
  component: RouteComponent
});

function getDocs() {
  const saved = localStorage.getItem('rnd_doc_status');
  const genTitle = localStorage.getItem('rnd_generated_title');
  const genDate = localStorage.getItem('rnd_generated_date');
  const docs = [
    { id: 2, title: '자연어처리 기반 민원 자동 분류 시스템', status: '개선 완료', date: '2026.04.03', score: 91 },
  ];
  if (genTitle) {
    docs.unshift({ id: 1, title: genTitle, status: saved || '초안 생성', date: genDate || '2026.04.07', score: saved === '개선 완료' ? 91 : 72 });
  }
  return docs;
}

function RouteComponent() {
  const { t } = useI18n(['main']);
  const navigate = useNavigate();
  const docs = getDocs();

  return (
    <StyledMainContainer
      semantic="main"
      direction="column"
      gap={24}
      width="100%"
      height="100vh"
      padding="64px 0"
      alignItems="center"
    >
      <Flex
        margin="0 auto"
        maxWidth="900px"
        width="100%"
        alignItems="start"
        justify="center"
        direction="column"
        gap={24}
      >
        <StyledDocsTitle>{t('main:docs.title')}</StyledDocsTitle>

        <div style={{ width: '100%' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #E3E4E8' }}>
                <th style={{ textAlign: 'left', padding: '12px 16px', fontWeight: 500, color: '#6E7687' }}>문서명</th>
                <th style={{ textAlign: 'center', padding: '12px 16px', fontWeight: 500, color: '#6E7687', width: 120 }}>상태</th>
                <th style={{ textAlign: 'center', padding: '12px 16px', fontWeight: 500, color: '#6E7687', width: 100 }}>품질 점수</th>
                <th style={{ textAlign: 'center', padding: '12px 16px', fontWeight: 500, color: '#6E7687', width: 110 }}>작성일</th>
                <th style={{ textAlign: 'center', padding: '12px 16px', fontWeight: 500, color: '#6E7687', width: 70 }}></th>
              </tr>
            </thead>
            <tbody>
              {docs.map((doc) => (
                <tr key={doc.id} style={{ borderBottom: '1px solid #F1F1F4', cursor: 'pointer' }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#F8FAFF')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  onClick={() => navigate({ to: `/d/preview` as any, search: { status: doc.status } as any })}
                >
                  <td style={{ padding: '14px 16px', fontWeight: 500, color: '#25262C' }}>{doc.title}</td>
                  <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                    <span style={{
                      padding: '3px 8px',
                      borderRadius: 4,
                      fontSize: 12,
                      fontWeight: 500,
                      background: doc.status === '개선 완료' ? '#F0FDF4' : '#F0F6FF',
                      color: doc.status === '개선 완료' ? '#16A34A' : '#2C81FC',
                    }}>
                      {doc.status}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                    <span style={{ fontWeight: 600, color: doc.score >= 80 ? '#16A34A' : doc.score >= 70 ? '#2C81FC' : '#D97706' }}>{doc.score}</span>
                    <span style={{ color: '#B5B9C4', fontSize: 12 }}>/100</span>
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'center', color: '#6E7687', fontSize: 13 }}>{doc.date}</td>
                  <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                    <button onClick={(e) => e.stopPropagation()} style={{ background: 'none', border: 'none', padding: 4, color: '#B5B9C4', cursor: 'pointer', display: 'flex' }} title="삭제"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Flex>
    </StyledMainContainer>
  );
}
