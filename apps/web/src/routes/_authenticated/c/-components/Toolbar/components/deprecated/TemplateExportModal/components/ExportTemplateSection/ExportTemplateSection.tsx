import { Flex } from '@docs-front/ui';
import {
  StyledDropZone,
  StyledDropZoneLabel,
  StyledWarningText
} from '@/routes/_authenticated/c/-components/Toolbar/components/deprecated/TemplateExportModal/TemplateExportModal.style';
import ExportDrawerFormfield from '@/routes/_authenticated/c/-components/Toolbar/components/deprecated/TemplateExportModal/components/ExportDrawerFormfield/ExportDrawerFormfield';
import { Upload } from 'lucide-react';
import { useTheme } from '@emotion/react';
import i18n from '@/i18n';
import { useI18n } from '@/hooks/useI18n';
import {
  useSuspenseQuery,
  type UseMutationResult
} from '@tanstack/react-query';
import { getProductFilesQueryOptions } from '@/query/options/products';
import type { Control } from 'react-hook-form';
import type { ExportDrawerForm } from '@/schema/main/exportDrawer';
import {
  StyledFormfieldLabel,
  StyledSectionLabel
} from '@/routes/_authenticated/c/-components/Toolbar/components/ExportModal/ExportModal.style';

const userLanguage = i18n.language;

interface ExportTemplateSectionProps {
  productId: number;
  control: Control<ExportDrawerForm>;
  deleteProductFileMutation: UseMutationResult<unknown, Error, number, unknown>;
  isDragOver: boolean;
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleDrop: (e: React.DragEvent) => void;
  handleDragOver: (e: React.DragEvent) => void;
  handleDragLeave: (e: React.DragEvent) => void;
  handleDropZoneClick: () => void;
  handleFileInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ExportTemplateSection({
  productId,
  control,
  deleteProductFileMutation,
  isDragOver,
  fileInputRef,
  handleDrop,
  handleDragOver,
  handleDragLeave,
  handleDropZoneClick,
  handleFileInputChange
}: ExportTemplateSectionProps) {
  const theme = useTheme();
  const { t } = useI18n(['main']);

  const { data: productFormats } = useSuspenseQuery(
    getProductFilesQueryOptions(productId, {
      filter: 'FORMAT'
    })
  );

  return (
    <Flex
      direction="column"
      alignItems="flex-start"
      gap={8}
      alignSelf="stretch"
    >
      <StyledSectionLabel>
        1. {t('main:export.drawer.fileUpload.label')}
      </StyledSectionLabel>

      <StyledDropZone
        isDragOver={isDragOver}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleDropZoneClick}
      >
        <Upload size={24} color={theme.color.bgDarkGray} />
        <Flex direction="column" alignItems="center" justify="center" gap={6}>
          <StyledDropZoneLabel $useLanguage={userLanguage}>
            {t('main:export.drawer.fileUpload.dropZoneLabel')}
            <span style={{ color: theme.color.main }}>
              {' '}
              {t('main:export.drawer.fileUpload.recommended')}
            </span>
          </StyledDropZoneLabel>
          <StyledWarningText>
            {(() => {
              const warningText = t('main:export.drawer.fileUpload.warning');
              const isKorean = i18n.language === 'ko';
              const highlightText = isKorean
                ? 'hwpx 사용을 권장드립니다'
                : 'recommend using HWPX';

              if (warningText.includes(highlightText)) {
                const parts = warningText.split(highlightText);
                return (
                  <>
                    {parts[0]}
                    <span style={{ color: theme.color.main }}>
                      {highlightText}
                    </span>
                    {parts[1]}
                  </>
                );
              }
              return warningText;
            })()}
          </StyledWarningText>
        </Flex>
      </StyledDropZone>
      <input
        ref={fileInputRef}
        type="file"
        accept=".hwp,.hwpx"
        onChange={handleFileInputChange}
        style={{ display: 'none' }}
      />
      <Flex direction="column" alignItems="flex-start" gap={8} width="100%">
        {productFormats.length > 0 && (
          <StyledFormfieldLabel>
            {t('main:export.drawer.fileUpload.uploadedLabel')}
          </StyledFormfieldLabel>
        )}
        <ExportDrawerFormfield
          control={control}
          deleteProductFileMutation={deleteProductFileMutation}
          productFormats={productFormats}
        />
      </Flex>
    </Flex>
  );
}
