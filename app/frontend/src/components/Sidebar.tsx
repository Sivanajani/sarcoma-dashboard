import { useTranslation } from 'react-i18next';

const Sidebar = () => {
  const { t } = useTranslation();

  return (
    <aside className="sidebar">
      <h2>{t('sidebar.title')}</h2>
      <nav>
        <a href="#">{t('sidebar.dashboard')}</a>
        <a href="#">{t('sidebar.forms')}</a>
        <a href="#">{t('sidebar.patients')}</a>
        <a href="#">{t('sidebar.redflags')}</a>
        <a href="#">{t('sidebar.settings')}</a>
      </nav>
    </aside>
  );
};

export default Sidebar;