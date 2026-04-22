// import isPropValid from '@emotion/is-prop-valid';
// import styled from '@emotion/styled';

// interface StyledCardProps {
//   $selected: boolean;
// }

// export const StyledCard = styled('div', {
//   shouldForwardProp: (prop) => isPropValid(prop)
// })<StyledCardProps>`
//   display: flex;
//   padding: 16px;
//   flex-direction: column;
//   justify-content: center;
//   align-items: flex-start;
//   gap: 12px;
//   flex: 1 0 0;
//   align-self: stretch;

//   border-radius: 8px;
//   border: 1px solid
//     ${({ theme, $selected }) =>
//       $selected ? theme.color.main : theme.color.borderGray};
//   background: ${({ theme, $selected }) =>
//     $selected ? theme.color.bgMain : theme.color.white};
// `;

// export const StyledDescription = styled.div`
//   color: ${({ theme }) => theme.color.bgDarkGray};
//   font-size: 15px;
//   font-style: normal;
//   font-weight: 400;
//   line-height: 21px;
//   letter-spacing: -0.3px;
// `;

// export const StyledCardTitle = styled.span`
//   color: ${({ theme }) => theme.color.black};
//   font-size: 16px;
//   font-style: normal;
//   font-weight: 600;
//   line-height: normal;
//   letter-spacing: -0.32px;
// `;
