import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router';
import { Flex } from '@docs-front/ui';
import { useFunnel } from '@use-funnel/browser';
import { TermsAgreement } from '@/routes/_intro/_authenticated/select-onboarding/-components/TermsAgreement/TermsAgreement';
import { getAccountMeQueryOptions } from '@/query/options/account';

// import {
//   HowToGenerate,
//   type HowToGenerateForm
// } from '@/routes/_intro/_authenticated/select-onboarding/-components/HowToGenerate/HowToGenerate';
import {
  // selectOnboardingHowToGenerateSchema,
  selectOnboardingTermsAgreementSchema
} from '@/schema/selectOnboarding';
import { useBreakPoints } from '@/hooks/useBreakPoints';

export const Route = createFileRoute(
  '/_intro/_authenticated/select-onboarding/'
)({
  beforeLoad: async ({ context }) => {
    const account = await context.queryClient.ensureQueryData(
      getAccountMeQueryOptions()
    );

    if (account.termsConsents) {
      const allRequiredTermsAgreed = account.termsConsents
        .filter((term) => term.isRequired)
        .every((term) => term.agreed);

      if (allRequiredTermsAgreed) {
        throw redirect({ to: '/start', replace: true });
      }
    }
  },
  component: SelectOnboardingPage
});

function SelectOnboardingPage() {
  const { sm } = useBreakPoints();
  const funnel = useFunnel({
    id: 'select-onboarding',
    steps: {
      termsAgreement: { parse: selectOnboardingTermsAgreementSchema.parse }
      // howToGenerate: { parse: selectOnboardingHowToGenerateSchema.parse }
    },
    initial: {
      step: 'termsAgreement',
      context: {}
    }
  });

  const navigate = useNavigate({ from: '/select-onboarding' });

  return (
    <Flex
      height={'100vh'}
      alignItems="center"
      justify="center"
      width={sm ? '100%' : '352px'}
      padding={sm ? '0 16px' : '0'}
    >
      <funnel.Render
        termsAgreement={({ context }) => (
          <TermsAgreement
            defaultValues={{
              terms: context.terms ?? {
                all: false,
                term: false,
                personal: false,
                marketing: false
              }
            }}
            onNext={async () => {
              await navigate({ to: '/start' });

              // await history.push('howToGenerate', {
              //   method: context.method
              // });
            }}
          />
        )}
        // howToGenerate={({ context }) => (
        //   <HowToGenerate defaultValues={context.method} />
        // )}
      />
    </Flex>
  );
}
