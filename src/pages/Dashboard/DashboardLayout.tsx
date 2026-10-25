import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './DashboardLayout.module.scss';

const SECTIONS = [
  { to: '/dashboard', label: 'Overview', end: true },
  { to: '/dashboard/usage', label: 'Usage', end: false },
  { to: '/dashboard/keys', label: 'API keys', end: false },
  { to: '/dashboard/billing', label: 'Billing', end: false },
  { to: '/dashboard/account', label: 'Account', end: false },
];

export function DashboardLayout() {
  const { user, needsCountry } = useAuth();

  return (
    <div className={styles.dashboard}>
      <div className={styles.inner}>
        <header className={styles.header}>
          <div className={styles.headerTitleRow}>
            <h1 className={styles.title}>{user?.name ? `Hello, ${user.name}` : 'Dashboard'}</h1>
            {user?.email && <span className={styles.userBadge}>{user.email}</span>}
          </div>
        </header>

        {needsCountry && (
          <p className={styles.banner} role="status">
            Set your country to create API keys and view local rates.{' '}
            <NavLink to="/dashboard/account">Set country</NavLink>
          </p>
        )}

        <nav className={styles.tabs} aria-label="Rovie Route dashboard sections">
          {SECTIONS.map((section) => (
            <NavLink
              key={section.to}
              to={section.to}
              end={section.end}
              className={({ isActive }) => (isActive ? `${styles.tab} ${styles.tabActive}` : styles.tab)}
            >
              {section.label}
            </NavLink>
          ))}
        </nav>

        <div className={styles.content}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
