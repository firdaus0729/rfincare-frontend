import React, { useEffect, useState } from 'react';

/** Per-icon chunks — avoids loading the full Lucide catalog up front. */
const iconLoaders = import.meta.glob('../../../node_modules/lucide-react/dist/esm/icons/*.js');

/** Map legacy / custom names to Lucide file stems. */
const ICON_ALIASES = {
  Contact: 'contact-round',
  Conversions: 'trending-up',
  Applications: 'file-text',
  Approvals: 'check-circle',
  Approved: 'check-circle',
  Clients: 'users',
  Earnings: 'indian-rupee',
  HeadphonesIcon: 'headphones',
  Layout: 'layout-dashboard',
  Files: 'files',
  Grid: 'grid-3x3',
  BarChart: 'bar-chart',
  PlayCircle: 'circle-play',
};

function toKebabCase(name) {
  return name
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .toLowerCase();
}

function resolveIconKey(name) {
  if (!name || typeof name !== 'string') return 'help-circle';
  const trimmed = name.trim();
  if (!trimmed) return 'help-circle';
  const aliased = ICON_ALIASES[trimmed] || trimmed;
  return toKebabCase(aliased);
}

function findLoader(key) {
  const suffix = `/icons/${key}.js`;
  const entry = Object.entries(iconLoaders).find(([path]) => path.endsWith(suffix));
  return entry?.[1];
}

function Icon({ name, size = 24, color = 'currentColor', className = '', strokeWidth = 2, ...props }) {
  const iconKey = resolveIconKey(name);
  const [IconComponent, setIconComponent] = useState(null);

  useEffect(() => {
    let active = true;
    setIconComponent(null);
    const load = findLoader(iconKey) || findLoader('help-circle');
    if (!load) return undefined;
    load().then((mod) => {
      if (active) setIconComponent(() => mod.default);
    });
    return () => {
      active = false;
    };
  }, [iconKey]);

  if (!IconComponent) {
    return (
      <span
        className={className}
        style={{ display: 'inline-block', width: size, height: size }}
        aria-hidden
        {...props}
      />
    );
  }

  return (
    <IconComponent
      size={size}
      color={color}
      strokeWidth={strokeWidth}
      className={className}
      {...props}
    />
  );
}

export default Icon;
