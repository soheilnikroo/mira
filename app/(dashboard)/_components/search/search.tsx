'use client';

import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import qs from 'query-string';
import { useEffect, useState } from 'react';
import { useDebounceValue } from 'usehooks-ts';

import { Input } from '@/components/ui/input';

const SearchInput = () => {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounceValue(search, 500);

  const handleSearch = (value: string) => {
    setSearch(value);
  };

  useEffect(() => {
    const url = qs.stringifyUrl(
      {
        url: '/',
        query: {
          search: debouncedSearch,
        },
      },
      {
        skipEmptyString: true,
        skipNull: true,
      }
    );

    router.push(url);
  }, [debouncedSearch, router]);

  return (
    <div className="w-full relative">
      <Search className="absolute left-3 top-1/2  transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
      <Input
        className="w-full max-w-[516px] pl-9"
        placeholder="Search for a board..."
        value={search}
        onChange={(e) => handleSearch(e.target.value)}
      />
    </div>
  );
};

export default SearchInput;
