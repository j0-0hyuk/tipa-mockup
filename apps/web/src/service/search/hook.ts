import { searchService } from '@/service/search/instance';
import { useDebounceValue } from 'usehooks-ts';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { ChangeEvent, KeyboardEvent } from 'react';

interface UseSearchBarParams {
  search?: string;
  onCommit: (nextSearch: string, replace?: boolean) => void;
  debounceMs?: number;
}

export const useSearchBar = ({
  search,
  onCommit,
  debounceMs = 250
}: UseSearchBarParams) => {
  const normalizedSearch = searchService.parse(search);
  const [inputValue, setInputValue] = useState(normalizedSearch);
  const [debouncedValue] = useDebounceValue(inputValue, debounceMs);
  const lastCommittedSearchRef = useRef<string>(normalizedSearch);

  useEffect(() => {
    setInputValue(normalizedSearch);
    // Sync dedupe baseline with committed URL state.
    lastCommittedSearchRef.current = normalizedSearch;
  }, [normalizedSearch]);

  const commitParsed = useCallback(
    (nextSearch: string, replace = true) => {
      if (nextSearch === normalizedSearch) return;
      if (nextSearch === lastCommittedSearchRef.current) return;

      lastCommittedSearchRef.current = nextSearch;
      onCommit(nextSearch, replace);
    },
    [normalizedSearch, onCommit]
  );

  const commit = useCallback(
    (rawValue: string, replace = true) => {
      const nextSearch = searchService.parse(rawValue);
      commitParsed(nextSearch, replace);
    },
    [commitParsed]
  );

  useEffect(() => {
    const nextSearch = searchService.parse(debouncedValue);
    commitParsed(nextSearch, true);
  }, [debouncedValue, commitParsed]);

  const onChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setInputValue(event.target.value);
    },
    []
  );

  const onKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      // Keep auto-search only: Enter does not trigger immediate commit.
      if (event.key === 'Enter' && !event.nativeEvent.isComposing) {
        event.preventDefault();
      }
    },
    []
  );

  return {
    search: normalizedSearch,
    inputValue,
    setInputValue,
    onChange,
    onKeyDown,
    commit
  };
};
