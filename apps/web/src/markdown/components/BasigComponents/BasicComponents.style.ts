import styled from '@emotion/styled';

export const H1 = styled.h1`
  font-size: 30px;
  font-weight: 700;
  color: ${({ theme }) => theme.color.black};
  margin: 2rem 0px 1rem;
`;

export const H2 = styled.h2<{ withSources?: boolean }>`
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme }) => theme.color.black};
  margin: ${({ withSources }) =>
    withSources ? '0.5rem 0px' : '1.5rem 0px 0.5rem'};
`;

export const H3 = styled.h3`
  font-size: 16px;
  font-weight: 700;
  color: ${({ theme }) => theme.color.black};
  margin: 1rem 0px 0.3rem;
`;

export const P = styled.p`
  ${({ theme }) => theme.typo.Rg_16}
  color: ${({ theme }) => theme.color.black};
`;

export const Ul = styled.ul`
  ${({ theme }) => theme.typo.Rg_16}
  color: ${({ theme }) => theme.color.black};
  list-style-type: disc;
  padding-left: 20px;
  margin: 0.5em 0;
`;

export const Ol = styled.ol`
  list-style-type: decimal;
  padding-left: 20px;
  ${({ theme }) => theme.typo.Rg_16}
  color: ${({ theme }) => theme.color.black};
  margin: 0.5em 0;
`;

export const Hr = styled.hr`
  border: 1px solid ${({ theme }) => theme.color.borderGray};
  margin: 0.5rem 0;
`;

export const Blockquote = styled.blockquote`
  background-color: ${({ theme }) => theme.color.bgGray};
  padding: 15px 12px;
  margin: 0;
  border-radius: 4px;
  > div {
    ${({ theme }) => theme.typo.Md_15}
    color: ${({ theme }) => theme.color.black};
  }
  margin-top: 12px;
  margin-bottom: 24px;
`;

export const Table = styled.table`
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
    color: ${({ theme }) => theme.color.black};
    border: 1px solid ${({ theme }) => theme.color.borderGray};
    padding: 14px 10px;
    overflow-wrap: anywhere;
    word-break: break-word;
    vertical-align: top;
  }
  th {
    ${({ theme }) => theme.typo.Md_14}
    color: ${({ theme }) => theme.color.black};
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

export const TdHighlight = styled.td`
  ${({ theme }) => theme.typo.Rg_14}
  color: ${({ theme }) => theme.color.black};
  border: 1px solid ${({ theme }) => theme.color.borderGray};
  padding: 16.5px 10px;
  background-color: ${({ theme }) => theme.color.bgMain};
`;

export const Link = styled.a`
  ${({ theme }) => theme.typo.Rg_16}
  color: ${({ theme }) => theme.color.main};
  text-decoration: underline;
  cursor: pointer;
`;
