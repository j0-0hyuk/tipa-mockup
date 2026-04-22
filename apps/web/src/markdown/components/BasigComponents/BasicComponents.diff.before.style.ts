import styled from '@emotion/styled';

export const H1DiffBefore = styled.h1`
  font-size: 30px;
  font-weight: 700;
  color: ${({ theme }) => theme.color.textPlaceholder};
  text-decoration: line-through;
  margin: 2rem 0px 1rem;
`;

export const H2DiffBefore = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme }) => theme.color.textPlaceholder};
  text-decoration: line-through;
  margin: 1.5rem 0px 0.5rem;
`;

export const H3DiffBefore = styled.h3`
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme }) => theme.color.textPlaceholder};
  text-decoration: line-through;
  margin: 1rem 0px 0.3rem;
`;

export const PDiffBefore = styled.p`
  ${({ theme }) => theme.typo.Rg_16}
  color: ${({ theme }) => theme.color.textPlaceholder};
  text-decoration: line-through;
`;

export const UlDiffBefore = styled.ul`
  ${({ theme }) => theme.typo.Rg_16}
  color: ${({ theme }) => theme.color.textPlaceholder};
  text-decoration: line-through;
  list-style-type: disc;
  padding-left: 20px;
  margin: 0.5em 0;
`;

export const OlDiffBefore = styled.ol`
  list-style-type: decimal;
  padding-left: 20px;
  ${({ theme }) => theme.typo.Rg_16}
  color: ${({ theme }) => theme.color.textPlaceholder};
  text-decoration: line-through;
  margin: 0.5em 0;
`;

export const HrDiffBefore = styled.hr`
  border: 1px solid ${({ theme }) => theme.color.textPlaceholder};
  margin: 0.5rem 0;
  opacity: 0.5;
`;

export const BlockquoteDiffBefore = styled.blockquote`
  background-color: ${({ theme }) => theme.color.bgGray};
  padding: 15px 12px;
  margin: 0;
  border-radius: 4px;
  opacity: 0.6;
  > div {
    ${({ theme }) => theme.typo.Md_15}
    color: ${({ theme }) => theme.color.textPlaceholder};
    text-decoration: line-through;
  }
  margin-bottom: 24px;
`;

export const TableDiffBefore = styled.table`
  width: 100%;
  max-width: 100%;
  table-layout: fixed;
  border-collapse: collapse;
  margin: 0.5rem 0 1rem;
  border-radius: 4px;
  overflow: hidden;
  line-height: 20px;

  td {
    ${({ theme }) => theme.typo.Rg_14}
    color: ${({ theme }) => theme.color.textPlaceholder};
    text-decoration: line-through;
    border: 1px solid ${({ theme }) => theme.color.borderGray};
    padding: 16.5px 10px;
    overflow-wrap: anywhere;
    word-break: break-word;
    vertical-align: top;
  }
  th {
    ${({ theme }) => theme.typo.Md_14}
    color: ${({ theme }) => theme.color.textPlaceholder};
    text-decoration: line-through;
    border: 1px solid ${({ theme }) => theme.color.borderGray};
    padding: 11.5px 10px;
    text-align: left;
    background-color: ${({ theme }) => theme.color.bgBlueGray};
    white-space: pre-wrap;
    overflow-wrap: anywhere;
    word-break: break-word;
    vertical-align: top;
  }
`;

export const LinkDiffBefore = styled.a`
  ${({ theme }) => theme.typo.Rg_16}
  color: ${({ theme }) => theme.color.textPlaceholder};
  text-decoration: line-through;
  cursor: pointer;
`;
