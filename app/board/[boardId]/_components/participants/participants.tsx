'use client';

import { useOthers, useSelf } from '@liveblocks/react';

import { connectionIdToColor } from '@/lib/utils';

import { UserAvatar } from '../user-avatar';

const MAX_SHOWN_OTHER_USERS = 2;

const Participants = () => {
  const users = useOthers();
  const currentUser = useSelf();

  const hasMoreUser = users.length > MAX_SHOWN_OTHER_USERS;

  if (users.length === 0 && !currentUser) {
    return <ParticipantsSkeleton />;
  }

  return (
    <div className="absolute h-12 top-2 right-2 bg-white rounded-md p-3 flex items-center shadow-md">
      <div className="flex gap-x-2">
        {users.slice(0, MAX_SHOWN_OTHER_USERS).map(({ connectionId, info }) => (
          <UserAvatar
            key={connectionId}
            src={info?.picture}
            name={info?.name}
            fallback={info?.name?.charAt(0) || 'AN'}
            borderColor={connectionIdToColor(connectionId)}
          />
        ))}
        {currentUser && (
          <UserAvatar
            src={currentUser.info?.picture}
            name={`${currentUser.info?.name} (You)`}
            fallback={currentUser.info?.name?.charAt(0) || 'AN'}
            borderColor={connectionIdToColor(currentUser.connectionId)}
          />
        )}
        {hasMoreUser && (
          <UserAvatar
            name={`+${users.length - MAX_SHOWN_OTHER_USERS} more`}
            fallback={`+${users.length - MAX_SHOWN_OTHER_USERS} more`}
            borderColor={connectionIdToColor(
              users[MAX_SHOWN_OTHER_USERS].connectionId,
            )}
          />
        )}
      </div>
    </div>
  );
};

const ParticipantsSkeleton = () => {
  return (
    <div className="absolute h-12 top-2 right-2 bg-white rounded-md p-3 flex items-center shadow-md w-[100px]" />
  );
};

export { ParticipantsSkeleton };
export default Participants;
