import { FormField, Flex, RadioButton, IconButton } from '@docs-front/ui';
import {
  StyledFileIcon,
  StyledFileInfo,
  StyledFileName,
  StyledFileNameRow,
  StyledUploadedFile
} from '@/routes/_authenticated/c/-components/Toolbar/components/deprecated/TemplateExportModal/components/ExportDrawerFormfield/ExportDrawerFormfield.style';
import { useTheme } from '@emotion/react';
import { X } from 'lucide-react';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import { type UseMutationResult } from '@tanstack/react-query';
import type { Control } from 'react-hook-form';
import type { ExportDrawerForm } from '@/schema/main/exportDrawer';
import type { GetProductFilesResponse } from '@/schema/api/products/export';
import { getFileNameFromPath } from '@/utils/file/getFileNameFromPath';

const HwpIcon = '/images/icons/hwpx-icon.webp';
const DocxIcon = '/images/icons/docx-icon.webp';

interface ExportDrawerFormfieldProps {
  control: Control<ExportDrawerForm>;
  deleteProductFileMutation: UseMutationResult<unknown, Error, number, unknown>;
  productFormats: GetProductFilesResponse;
}

const getFileIcon = (filtPath: string) => {
  const fileName = getFileNameFromPath(filtPath);
  const extension = fileName?.split('.').pop()?.toLowerCase();

  switch (extension) {
    case 'hwpx':
    case 'hwp':
      return HwpIcon;
    case 'docx':
      return DocxIcon;
    default:
      return HwpIcon;
  }
};

export default function ExportDrawerFormfield({
  control,
  deleteProductFileMutation,
  productFormats
}: ExportDrawerFormfieldProps) {
  const theme = useTheme();
  return (
    <FormField
      control={control}
      name="productFilePathMapId"
      render={({ field }) => (
        <RadioGroupPrimitive.Root
          {...field}
          asChild
          onValueChange={field.onChange}
        >
          <Flex
            direction="column"
            alignItems="flex-start"
            gap={8}
            alignSelf="stretch"
          >
            {productFormats.map((format) => (
              <RadioGroupPrimitive.Item
                key={format.filePath}
                value={format.productFilePathMapId.toString()}
                asChild
              >
                <StyledUploadedFile>
                  <RadioButton />
                  <StyledFileIcon>
                    <img
                      src={getFileIcon(format.filePath || '')}
                      alt={format.fileType}
                      width={20}
                      height={20}
                      loading="lazy"
                    />
                  </StyledFileIcon>
                  <StyledFileInfo>
                    <StyledFileNameRow>
                      <StyledFileName>{getFileNameFromPath(format.filePath)}</StyledFileName>
                    </StyledFileNameRow>
                  </StyledFileInfo>
                  <IconButton
                    variant="text"
                    size="small"
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteProductFileMutation.mutate(
                        format.productFilePathMapId
                      );
                    }}
                  >
                    <X size={20} color={theme.color.textGray} />
                  </IconButton>
                </StyledUploadedFile>
              </RadioGroupPrimitive.Item>
            ))}
          </Flex>
        </RadioGroupPrimitive.Root>
      )}
    />
  );
}
