import styled from '@emotion/styled';

export const H1DiffAfter = styled.h1`
  font-size: 30px;
  font-weight: 700;
  color: #0853c0;
  background-color: ${({ theme }) => theme.color.bgMain};
  width: fit-content;
  margin: 2rem 0px 1rem;
`;

export const H2DiffAfter = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: #0853c0;
  background-color: ${({ theme }) => theme.color.bgMain};
  width: fit-content;
  margin: 1.5rem 0px 0.5rem;
`;

export const H3DiffAfter = styled.h3`
  font-size: 16px;
  font-weight: 700;
  color: #0853c0;
  background-color: ${({ theme }) => theme.color.bgMain};
  width: fit-content;
  margin: 1rem 0px 0.3rem;
`;

export const PDiffAfter = styled.p`
  ${({ theme }) => theme.typo.Rg_16}
  color: #0853c0;
  background-color: ${({ theme }) => theme.color.bgMain};
  width: fit-content;
`;

export const UlDiffAfter = styled.ul`
  ${({ theme }) => theme.typo.Rg_16}
  color: #0853c0;
  list-style-type: disc;
  padding-left: 20px;
  margin: 0.5em 0;

  & li {
    background-color: ${({ theme }) => theme.color.bgMain};
    margin: 1px 0;
  }
`;

export const OlDiffAfter = styled.ol`
  list-style-type: decimal;
  padding-left: 20px;
  ${({ theme }) => theme.typo.Rg_16}
  color: #0853c0;
  margin: 0.5em 0;
  width: fit-content;

  & li {
    background-color: ${({ theme }) => theme.color.bgMain};
    margin: 1px 0;
  }
`;

export const HrDiffAfter = styled.hr`
  border: 1px solid #0853c0;
  margin: 0.5rem 0;
`;

export const BlockquoteDiffAfter = styled.blockquote`
  background-color: ${({ theme }) => theme.color.bgGray};
  padding: 15px 12px;
  margin: 0;
  border-radius: 4px;
  > div {
    ${({ theme }) => theme.typo.Md_15}
    color: #0853c0;
    background-color: ${({ theme }) => theme.color.bgMain};
  }
  margin-bottom: 24px;
`;

export const TableDiffAfter = styled.table`
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
    border: 1px solid ${({ theme }) => theme.color.borderGray};
    padding: 16.5px 10px;
    overflow-wrap: anywhere;
    word-break: break-word;
    vertical-align: top;
  }
  th {
    ${({ theme }) => theme.typo.Md_14}
    background-color: ${({ theme }) => theme.color.bgBlueGray};
    border: 1px solid ${({ theme }) => theme.color.borderGray};
    padding: 11.5px 10px;
    text-align: left;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
    word-break: break-word;
    vertical-align: top;
  }
`;

export const TableCellInnerDiffAfter = styled.div`
  color: #0853c0;
  background-color: ${({ theme }) => theme.color.bgMain};
  display: inline;
  overflow-wrap: anywhere;
  word-break: break-word;
  max-width: 100%;
`;

export const LinkDiffAfter = styled.a`
  ${({ theme }) => theme.typo.Rg_16}
  background-color: ${({ theme }) => theme.color.bgMain};
  color: #0853c0;
  text-decoration: underline;
  cursor: pointer;
`;
