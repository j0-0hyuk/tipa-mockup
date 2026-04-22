import { exportPromptSchema } from '@/schema/main/export';
import { createFileRoute, Navigate } from '@tanstack/react-router'
import z from 'zod';

const funnelStepsSchema = z.discriminatedUnion('step', [
    z.object({
        step: z.literal('template')
    }),
    z.object({
        step: z.literal('prompt'),
        context: z.object({
            productFileId: z.string(),
            fileName: z.string().optional(),
            formData: exportPromptSchema.partial().optional()
        })
    }),
    z.object({
        step: z.literal('visual-suggestions'),
        context: z.object({
            productFileId: z.string(),
            fileName: z.string().optional()
        })
    }),
    z.object({
        step: z.literal('output'),
        context: z.object({
            productFileId: z.string()
        })
    })
]);

export const Route = createFileRoute('/_authenticated/f/')({
    component: RouteComponent
})

function RouteComponent() {
    const data = sessionStorage.getItem('f-funnel-data');

    if (!data) return <Navigate to="/f/template" replace />;

    const { success, data: parsedData } = funnelStepsSchema.safeParse(JSON.parse(data));

    if (!success) return <Navigate to="/f/template" replace />;

    switch (parsedData.step) {
        case 'prompt':
            return <Navigate to="/f/prompt/$productFileId" replace params={{ productFileId: parsedData.context.productFileId }} search={{ fileName: parsedData.context.fileName }} />
        case 'visual-suggestions':
            return <Navigate to="/f/visual-suggestions/$productFileId" replace params={{ productFileId: parsedData.context.productFileId }} search={{ fileName: parsedData.context.fileName }} />
        case 'output':
            return <Navigate to="/f/output/$productFileId" replace params={{ productFileId: parsedData.context.productFileId }} />
        case 'template':
        default:
            return <Navigate to="/f/template" replace />
    }
}
