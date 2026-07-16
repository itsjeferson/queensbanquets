import { useTheme } from '../theme/ThemeContext.jsx';

function ThemeToggle({ className = '', compact = false }) {
  const { resolvedTheme, toggleTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  return (
    <button
      type="button"
      className={`theme-toggle ${compact ? 'theme-toggle--compact' : ''} ${className}`.trim()}
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-pressed={isDark}
      title={isDark ? 'Light mode' : 'Dark mode'}
    >
      <span className="theme-toggle__track" aria-hidden="true">
        <span className={`theme-toggle__thumb ${isDark ? 'is-dark' : ''}`} />
      </span>
      {!compact ? (
        <span className="theme-toggle__label">{isDark ? 'Dark' : 'Light'}</span>
      ) : null}
    </button>
  );
}

export default ThemeToggle;
