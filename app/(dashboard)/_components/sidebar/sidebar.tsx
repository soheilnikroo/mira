import { NewButton } from '../new-button';

import { List } from './sub-components/list';

const Sidebar = () => {
  return (
    <aside className="fixed z-1 left-0 bg-blue-950 h-full w-[60px] flex gap-y-4 flex-col text-white p-3">
      <List />
      <NewButton />
    </aside>
  );
};

export default Sidebar;
