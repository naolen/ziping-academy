import { useEffect } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { useApp } from '../store/app';
import { Icon, type IconName } from './Icon';

interface NavItem {
  to: string;
  name: string;
  icon: IconName;
  match: string[];
}

const NAVS: NavItem[] = [
  { to: '/home', name: '仪表盘', icon: 'home', match: ['/home'] },
  { to: '/learn', name: '学习路径', icon: 'book', match: ['/learn', '/card'] },
  { to: '/practice', name: '刷题', icon: 'target', match: ['/practice', '/quiz', '/result'] },
  { to: '/wrong', name: '错题本', icon: 'flag', match: ['/wrong'] },
  { to: '/stats', name: '统计', icon: 'chart', match: ['/stats'] },
  { to: '/settings', name: '设置', icon: 'gear', match: ['/settings'] },
];

export default function Layout() {
  const { store, progress } = useApp();
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const isActive = (n: NavItem) => n.match.some((m) => pathname.startsWith(m));

  return (
    <>
      <div className="app">
        <aside className="sidebar">
          <Link to="/home" className="brand">
            <div className="brand-mark">子平</div>
            <div>
              <div className="brand-t">子平学堂</div>
              <div className="brand-s">五阶八字学习系统</div>
            </div>
          </Link>
          <nav className="nav">
            {NAVS.map((n) => (
              <NavLink key={n.to} to={n.to} className={`nav-item${isActive(n) ? ' active' : ''}`}>
                <Icon name={n.icon} />
                <span>{n.name}</span>
                {n.to === '/wrong' && store.wrong.length > 0 && (
                  <span className="nav-badge">{store.wrong.length}</span>
                )}
              </NavLink>
            ))}
          </nav>
          <div className="side-foot">
            <div className="sp-row">
              <span>总进度</span>
              <span>{progress}%</span>
            </div>
            <div className="bar">
              <i style={{ width: `${progress}%` }} />
            </div>
          </div>
        </aside>
        <main className="main">
          <Outlet />
        </main>
      </div>
      <nav className="mnav">
        {NAVS.map((n) => (
          <NavLink key={n.to} to={n.to} className={isActive(n) ? 'active' : ''}>
            <Icon name={n.icon} />
            <span>{n.name}</span>
          </NavLink>
        ))}
      </nav>
    </>
  );
}
