import { Avatar, Icon, Tag } from '@lobehub/ui';
import type { MenuProps } from 'antd';
import { Dropdown } from 'antd';
import isEqual from 'fast-deep-equal';
import { LucideToyBrick } from 'lucide-react';
import { memo, useEffect } from 'react';

import { pluginHelpers, pluginSelectors, usePluginStore } from '@/store/plugin';

import PluginStatus from './PluginStatus';

export interface PluginTagProps {
  plugins: string[];
}

const PluginTag = memo<PluginTagProps>(({ plugins }) => {
  const list = usePluginStore(pluginSelectors.displayPluginList);
  const displayPlugin = usePluginStore(pluginSelectors.getPluginMetaById(plugins[0]), isEqual);

  const checkPluginsIsInstalled = usePluginStore((s) => s.checkPluginsIsInstalled);

  useEffect(() => {
    checkPluginsIsInstalled(plugins);
  }, [plugins]);

  if (plugins.length === 0) return null;

  const items: MenuProps['items'] = plugins.map((id) => {
    const item = list.find((i) => i.identifier === id);
    const isDeprecated = !item?.title;
    const avatar = isDeprecated ? '♻️' : item?.avatar || '🧩';

    return {
      icon: <Avatar avatar={avatar} size={24} style={{ marginLeft: -6, marginRight: 2 }} />,
      key: id,
      label: <PluginStatus deprecated={isDeprecated} id={id} title={item?.title} />,
    };
  });

  const count = plugins.length;

  return (
    <Dropdown menu={{ items }}>
      <div>
        <Tag>
          {<Icon icon={LucideToyBrick} />}
          {pluginHelpers.getPluginTitle(displayPlugin?.meta) || plugins[0]}
          {count > 1 && <div>({plugins.length - 1}+)</div>}
        </Tag>
      </div>
    </Dropdown>
  );
});

export default PluginTag;
