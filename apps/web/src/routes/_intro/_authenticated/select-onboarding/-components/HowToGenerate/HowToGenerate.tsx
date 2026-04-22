// import type { ReactElement } from 'react';

// import { useNavigate } from '@tanstack/react-router';
// import { useForm } from 'react-hook-form';
// import { FileUp, TextCursorInput } from 'lucide-react';

// import {
//   StyledCard,
//   StyledCardTitle,
//   StyledDescription
// } from '@/routes/_intro/_authenticated/select-onboarding/-components/HowToGenerate/HowToGenerate.style';
// import { Button } from '@/components/Button/Button';
// import { Checkbox } from '@/components/Checkbox/Checkbox';
// import { Flex } from '@/components/Flex/Flex';
// import { theme } from '@/styles/theme';
// import { Form } from '@/components/Form/Form';

// type GenereateMethod = 'uploadFile' | 'manualInput';

// export interface HowToGenerateForm {
//   method: GenereateMethod;
// }

// interface HowToGenerateProps {
//   defaultValues?: HowToGenerateForm;
// }

// const cardInfos: {
//   title: string;
//   description: string;
//   method: GenereateMethod;
//   icon: ReactElement;
// }[] = [
//   {
//     title: '파일 업로드 하기',
//     description:
//       '사업계획서, 재무제표 등 아이템과 관련된 PDF 파일에 담긴 정보를 바탕으로 초안을 만들어드릴게요.',
//     method: 'uploadFile',
//     icon: <LuFileUp size={20} color={theme.color.main} />
//   },
//   {
//     title: '직접 입력하기',
//     description:
//       '사업계획서 초안을 만들 수 있도록, 단계별 질문이 준비되어 있어요. 질문에 답하면서 차근차근 작성해보세요.',
//     method: 'manualInput',
//     icon: <LuTextCursorInput size={20} color={theme.color.main} />
//   }
// ];

// export const HowToGenerate = ({ defaultValues }: HowToGenerateProps) => {
//   const navigate = useNavigate({ from: '/' });

//   const form = useForm<HowToGenerateForm>({
//     defaultValues: defaultValues ?? {
//       method: 'uploadFile'
//     }
//   });

//   const handleClickCard = (method: GenereateMethod) => () => {
//     form.setValue('method', method);
//   };

//   return (
//     <Form
//       form={form}
//       onSubmit={(data) => {
//         switch (data.method) {
//           case 'manualInput':
//             navigate({ to: '/onboarding/manual-input' });
//             break;
//           case 'uploadFile':
//             navigate({ to: '/onboarding/upload-file' });
//             break;
//           default:
//             throw new Error('Method is invalid');
//         }
//       }}
//     >
//       <Flex margin="40px 0 0 0" direction="column" gap={40}>
//         <Flex direction="column" gap={12}>
//           {cardInfos.map((cardInfo) => (
//             <StyledCard
//               onClick={handleClickCard(cardInfo.method)}
//               $selected={form.watch('method') === cardInfo.method}
//               key={cardInfo.method}
//             >
//               <Flex
//                 width="100%"
//                 justify="space-between"
//                 alignItems="flex-start"
//               >
//                 <Flex gap={8} alignItems="center">
//                   {cardInfo.icon}
//                   <StyledCardTitle>{cardInfo.title}</StyledCardTitle>
//                 </Flex>
//                 {form.watch('method') === cardInfo.method && (
//                   <Checkbox
//                     checked={true}
//                     $width={16}
//                     $height={16}
//                     $iconwidth={12}
//                     $iconheight={12}
//                   />
//                 )}
//               </Flex>
//               <StyledDescription>
//                 사업계획서, 재무제표 등 아이템과 관련된 PDF 파일에 담긴 정보를
//                 바탕으로 초안을 만들어드릴게요.
//               </StyledDescription>
//             </StyledCard>
//           ))}
//         </Flex>
//         <Button $color="white" $bgColor="main" $borderRadius="md">
//           다음
//         </Button>
//       </Flex>
//     </Form>
//   );
// };
