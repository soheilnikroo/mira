'use client';

import {
  shallow,
  useOthersConnectionIds,
  useOthersMapped,
} from '@liveblocks/react';
import { memo } from 'react';

import { colorToCSS } from '@/lib/utils';

import { Cursor } from '../cursor';
import { Path } from '../path';

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

const Drafts = () => {
  const others = useOthersMapped(
    (other) => ({
      pencilDraft: other.presence.pencilDraft,
      penColor: other.presence.penColor,
    }),
    shallow,
  );

  return (
    <>
      {others.map(([key, other]) => (
        <Path
          key={key}
          x={0}
          y={0}
          fill={other.penColor ? colorToCSS(other.penColor) : '#000'}
          points={other.pencilDraft ?? []}
        />
      ))}
    </>
  );
};

const CursorPresence = () => {
  return (
    <>
      <Drafts />
      <Cursors />
    </>
  );
};

CursorPresence.displayName = 'CursorPresence';

export default memo(CursorPresence);
