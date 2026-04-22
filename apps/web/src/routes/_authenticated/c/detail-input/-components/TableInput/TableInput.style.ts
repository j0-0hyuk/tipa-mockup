import styled from '@emotion/styled';

export const TableWrap = styled.div`
  width: 100%;
  border-radius: 4px;
`;

export const HeaderRow = styled.div`
  display: grid;
  background: ${({ theme }) => theme.color.bgBlueGray};
  border: 1px solid ${({ theme }) => theme.color.borderGray};
`;

export const BodyRow = styled.div`
  display: grid;
  align-items: center;
`;

export const HeadCell = styled.div`
  ${({ theme }) => theme.typo.Md_14}
  border: 1px solid ${({ theme }) => theme.color.borderGray};
  padding: 11.5px 10px;
`;

export const BodyCell = styled.div`
  display: flex;
  align-items: center;
`;

export const CellInput = styled.input`
  width: 100%;
  padding: 11.5px 10px;
  border: 1px solid ${({ theme }) => theme.color.borderGray};

  &::placeholder {
    color: ${({ theme }) => theme.color.textPlaceholder};
  }
`;

export const ActionsCell = styled(BodyCell)`
  justify-content: flex-end;
`;
