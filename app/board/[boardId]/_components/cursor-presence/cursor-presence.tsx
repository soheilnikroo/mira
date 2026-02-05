'use client';

import { useOthersConnectionIds } from '@liveblocks/react';
import { memo } from 'react';

import { Cursor } from '../cursor';

const Cursors = () => {
  const ids = useOthersConnectionIds();

  return (
    <>
      {ids.map((id) => (
        <Cursor key={id} connectionId={id} />
      ))}
    </>
  );
};

const CursorPresence = () => {
  return (
    <>
      <Cursors />
    </>
  );
};

CursorPresence.displayName = 'CursorPresence';

export default memo(CursorPresence);
