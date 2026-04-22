import type { UIDataTypes, UIMessagePart, UITools } from 'ai';
import { generateId } from 'ai';
import type { DetailInputForm } from '@/schema/main/detailInput';
import { detailInputFormToApiForm } from '@/schema/main/detailInput';
import type { DocshuntUIMessage } from '@/ai/ui-message';
import i18next from 'i18next';

export const partsToPlainText = (
  parts: UIMessagePart<UIDataTypes, UITools>[]
) => {
  return parts
    .map((part) => {
      if (part.type === 'text') {
        return part.text;
      }
      return '';
    })
    .join('');
};

type OnboardingData = DetailInputForm | { contents: Record<string, string> };

export const onboardingFormToUIMessage = (
  data: OnboardingData
): DocshuntUIMessage[] => {
  // contents 맵 형태인 경우
  if ('contents' in data && typeof data.contents === 'object') {
    const contents = data.contents;
    const textParts: string[] = [];

    // contents 맵의 각 키-값 쌍을 포맷팅
    for (const [key, value] of Object.entries(contents)) {
      if (value && value.trim() && key !== 'themeColor') {
        const i18nKey = `main:chat.form.${key}`;
        const label = i18next.exists(i18nKey) ? i18next.t(i18nKey) : key;
        textParts.push(`- ${label}: ${value}`);
      }
    }

    return [
      {
        id: generateId(),
        role: 'user',
        parts: [
          {
            type: 'text',
            text: textParts.join('\n\n').trim()
          }
        ]
      },
      {
        id: generateId(),
        role: 'assistant',
        parts: [
          {
            type: 'data-document',
            data: {
              value: '',
              status: 'generating'
            }
          }
        ]
      }
    ];
  }

  // 기존 DetailInputForm 형태인 경우 → contents 맵으로 변환
  const formData = data as DetailInputForm;
  const apiForm = detailInputFormToApiForm(formData);
  const contents = apiForm.contents;

  const textParts: string[] = [];
  for (const [key, value] of Object.entries(contents)) {
    if (value && value.trim() && key !== 'themeColor') {
      const i18nKey = `main:chat.form.${key}`;
      const label = i18next.exists(i18nKey) ? i18next.t(i18nKey) : key;
      textParts.push(`# ${label}:\n${value}`);
    }
  }

  return [
    {
      id: generateId(),
      role: 'user',
      parts: [
        {
          type: 'text',
          text: textParts.join('\n\n').trim()
        }
      ]
    },
    {
      id: generateId(),
      role: 'assistant',
      parts: [
        {
          type: 'data-document',
          data: {
            value: '',
            status: 'generating'
          }
        }
      ]
    }
  ];
};
