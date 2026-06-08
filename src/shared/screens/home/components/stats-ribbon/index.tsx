import React from 'react';

const stats = [
  { icon: 'map',           value: '700+ Cities',   label: 'All-India Coverage' },
  { icon: 'verified_user', value: '100% Verified',  label: 'Strict ID & Geo-fencing' },
  { icon: 'speed',         value: 'Real-Time',      label: 'Dashboard Monitoring' },
  { icon: 'groups',        value: '24/7 FGD',       label: 'Continuous Discussions' },
];

const StatsRibbon: React.FC = () => {
  return (
    <section
      className="py-16"
      style={{
        background: 'var(--surface-container-lowest)',
        borderTop: '1px solid rgba(65,71,84,0.05)',
        borderBottom: '1px solid rgba(65,71,84,0.05)',
      }}
    >
      <div className="tm-container flex flex-wrap justify-between gap-12 items-center">
        {stats.map((stat, i) => (
          <div key={i} className="flex items-center gap-4">
            <span
              className="material-symbols-outlined"
              style={{
                fontSize: '2.5rem',
                color: i % 2 === 0 ? 'var(--secondary)' : 'var(--primary-container)',
              }}
            >
              {stat.icon}
            </span>
            <div>
              <div className="text-2xl font-bold text-on-surface">{stat.value}</div>
              <div className="text-sm" style={{ color: 'var(--on-surface-variant)' }}>
                {stat.label}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StatsRibbon;
