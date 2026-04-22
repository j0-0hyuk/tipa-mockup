// RHFTeamTable.tsx
import { useMemo } from 'react';
import { Controller, useFieldArray, useFormContext } from 'react-hook-form';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable
} from '@tanstack/react-table';
import type { DetailInputForm, TeamRow } from '@/schema/main/detailInput';
import { Button, Flex } from '@docs-front/ui';
import {
  TableWrap,
  HeaderRow,
  BodyRow,
  HeadCell,
  BodyCell,
  CellInput
} from '@/routes/_authenticated/c/detail-input/-components/TableInput/TableInput.style';
import { Plus } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';

type Props = {
  name?: 'teamInfo';
};

const ch = createColumnHelper<TeamRow>();

export default function TableInput({ name = 'teamInfo' }: Props) {
  const { control } = useFormContext<DetailInputForm>();
  const { t } = useI18n(['main']);

  const { fields, append } = useFieldArray<DetailInputForm, 'teamInfo', 'id'>({
    control,
    name
  });

  const columns = useMemo(
    () => [
      ch.accessor('name', {
        header: t('detailInput.optionalForm.teamInfo.table.columns.name'),
        cell: ({ row }) => (
          <Controller
            control={control}
            name={`teamInfo.${row.index}.name`}
            render={({ field }) => (
              <CellInput
                {...field}
                placeholder={
                  row.index < 2
                    ? t(
                        'detailInput.optionalForm.teamInfo.table.placeholders.name'
                      )
                    : undefined
                }
                maxLength={200}
              />
            )}
          />
        )
      }),
      ch.accessor('position', {
        header: t('detailInput.optionalForm.teamInfo.table.columns.position'),
        cell: ({ row }) => (
          <Controller
            control={control}
            name={`teamInfo.${row.index}.position`}
            render={({ field }) => (
              <CellInput
                {...field}
                placeholder={
                  row.index < 2
                    ? t(
                        'detailInput.optionalForm.teamInfo.table.placeholders.position'
                      )
                    : undefined
                }
                maxLength={200}
              />
            )}
          />
        )
      }),
      ch.accessor('responsibilities', {
        header: t(
          'detailInput.optionalForm.teamInfo.table.columns.responsibilities'
        ),
        cell: ({ row }) => (
          <Controller
            control={control}
            name={`teamInfo.${row.index}.responsibilities`}
            render={({ field }) => (
              <CellInput
                {...field}
                placeholder={
                  row.index < 2
                    ? t(
                        'detailInput.optionalForm.teamInfo.table.placeholders.responsibilities'
                      )
                    : undefined
                }
                maxLength={500}
              />
            )}
          />
        )
      }),
      ch.accessor('skills', {
        header: t('detailInput.optionalForm.teamInfo.table.columns.skills'),
        cell: ({ row }) => (
          <Controller
            control={control}
            name={`teamInfo.${row.index}.skills`}
            render={({ field }) => (
              <CellInput
                {...field}
                placeholder={
                  row.index < 2
                    ? t(
                        'detailInput.optionalForm.teamInfo.table.placeholders.skills'
                      )
                    : undefined
                }
                maxLength={500}
              />
            )}
          />
        )
      })
    ],
    [control, t]
  );

  const table = useReactTable({
    data: fields as unknown as TeamRow[],
    columns,
    getCoreRowModel: getCoreRowModel()
  });

  return (
    <Flex direction="column" gap={8}>
      <TableWrap>
        <HeaderRow style={{ gridTemplateColumns: '1fr 1fr 2.5fr 2.5fr' }}>
          {table
            .getHeaderGroups()
            .map((hg) =>
              hg.headers.map((h) => (
                <HeadCell key={h.id}>
                  {flexRender(h.column.columnDef.header, h.getContext())}
                </HeadCell>
              ))
            )}
        </HeaderRow>
        {table.getRowModel().rows.map((r) => (
          <BodyRow
            key={r.id}
            style={{ gridTemplateColumns: '1fr 1fr 2.5fr 2.5fr' }}
          >
            {r.getVisibleCells().map((c) => (
              <BodyCell key={c.id}>
                {flexRender(c.column.columnDef.cell, c.getContext())}
              </BodyCell>
            ))}
          </BodyRow>
        ))}
      </TableWrap>
      <Button
        type="button"
        variant="outlined"
        size="small"
        onClick={() =>
          append({ name: '', position: '', responsibilities: '', skills: '' })
        }
      >
        {t('detailInput.optionalForm.teamInfo.table.addButton')}
        <Plus />
      </Button>
    </Flex>
  );
}
