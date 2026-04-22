import {
  buildTemplateSearchSource,
  includesSearchQuery,
  optionalSearchQuerySchema,
  parseTemplateFileName,
  parseTemplateTitle,
  searchQuerySchema
} from '@/service/search/parser';

export class SearchService {
  parse = (value: unknown): string => searchQuerySchema.parse(value);

  parseOptional = (value: unknown): string | undefined =>
    optionalSearchQuerySchema.parse(value);

  includes = (source: string | null | undefined, query: string): boolean =>
    includesSearchQuery(source, query);

  parseTemplateTitle = (value: unknown): string => parseTemplateTitle(value);

  parseTemplateFileName = (value: unknown): string =>
    parseTemplateFileName(value);

  buildTemplateSearchSource = (params: {
    filePath?: unknown;
    templatePrompt?: unknown;
  }): string => buildTemplateSearchSource(params);
}

export const searchService = new SearchService();
