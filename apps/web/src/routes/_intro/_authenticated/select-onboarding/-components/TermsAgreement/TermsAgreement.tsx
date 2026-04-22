import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  StyledAllRequiredText,
  StyledTermsItem,
  StyledTermsText,
  StyledChevronIcon
} from '@/routes/_intro/_authenticated/select-onboarding/-components/TermsAgreement/TermsAgreement.style';
import {
  Button,
  Flex,
  Checkbox,
  Divider,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Form
} from '@docs-front/ui';
import { checkboxInfos } from '@/schema/terms';
import {
  selectOnboardingTermsAgreementFormSchema,
  type SelectOnboardingTermsAgreementForm
} from '@/schema/selectOnboarding';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronLeft } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n.ts';
import { postTerms } from '@/api/terms';
import type {
  PostTermsRequestParams,
  TermsCode
} from '@/schema/api/terms/terms';
import { getAccountMeQueryOptions } from '@/query/options/account';

interface TermsAgreementProps {
  onNext: (terms: SelectOnboardingTermsAgreementForm) => void;
  defaultValues: SelectOnboardingTermsAgreementForm;
}

export const TermsAgreement = ({
  onNext,
  defaultValues
}: TermsAgreementProps) => {
  const form = useForm<SelectOnboardingTermsAgreementForm>({
    defaultValues,
    resolver: zodResolver(selectOnboardingTermsAgreementFormSchema)
  });

  const { t } = useI18n(['common']);
  const queryClient = useQueryClient();
  const termsMutation = useMutation({
    mutationFn: postTerms,
    onSuccess: async () => {
      await queryClient.invalidateQueries(getAccountMeQueryOptions());
      onNext(form.getValues());
    }
  });

  const handleSubmit = (data: SelectOnboardingTermsAgreementForm) => {
    const termsCodeMap: Record<string, TermsCode> = {
      term: 'SERVICE_TERMS',
      personal: 'PRIVACY_POLICY',
      marketing: 'MARKETING_CONSENT'
    };

    const requestData: PostTermsRequestParams = {
      termsAgreements: Object.entries(data.terms)
        .filter(([key]) => key !== 'all')
        .map(([key, agreed]) => ({
          termsCode: termsCodeMap[key],
          agreed: Boolean(agreed)
        }))
    };

    termsMutation.mutate(requestData);
  };

  return (
    <Form onSubmit={handleSubmit} form={form}>
      <Flex margin="76px 0 0 0" width="100%" direction="column" gap={76}>
        <Flex direction="column" gap={20}>
          <FormField
            control={form.control}
            name="terms.all"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormControl>
                    <Checkbox
                      size="medium"
                      onCheckedChange={(checked) => {
                        checkboxInfos.forEach((checkboxInfo) =>
                          form.setValue(
                            `terms.${checkboxInfo.name}`,
                            typeof checked === 'string' ? false : checked
                          )
                        );
                        field.onChange(checked);
                      }}
                      checked={field.value}
                    >
                      <StyledAllRequiredText>
                        {t('common:terms.allAgree')}
                      </StyledAllRequiredText>
                    </Checkbox>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          <Divider />
          {checkboxInfos.map((checkboxInfo) => (
            <FormField
              key={checkboxInfo.name}
              control={form.control}
              name={`terms.${checkboxInfo.name}`}
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormControl>
                      <StyledTermsItem>
                        <Checkbox
                          id={`terms.${checkboxInfo.name}`}
                          onCheckedChange={(checked) => {
                            form.setValue(
                              'terms.all',
                              checkboxInfos.every(
                                (c) =>
                                  c.name === checkboxInfo.name || // this checkbox
                                  form.getValues(`terms.${c.name}`) === true // checked
                              ) &&
                                (typeof checked === 'string' ? false : checked) // and check this checkbox
                            );
                            field.onChange(checked);
                          }}
                          checked={field.value}
                          size="medium"
                        />
                        <StyledTermsText>
                          {t(`common:terms.${checkboxInfo.name}`)}
                        </StyledTermsText>
                        <StyledChevronIcon
                          onClick={() =>
                            window.open(checkboxInfo.url, '_blank')
                          }
                        >
                          <ChevronLeft />
                        </StyledChevronIcon>
                      </StyledTermsItem>
                    </FormControl>
                  </FormItem>
                );
              }}
            />
          ))}
        </Flex>
        <Button
          width="100%"
          type="submit"
          variant="filled"
          size="medium"
          disabled={termsMutation.isPending}
        >
          {t('common:button.next')}
        </Button>
      </Flex>
    </Form>
  );
};
