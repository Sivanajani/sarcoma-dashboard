import { useTranslation } from 'react-i18next';

const Header = () => {
  const { t } = useTranslation();

  return (
    <header className="header">
      <input
        type="text"
        placeholder={t('header.search')}
      />
      <div className="user-info">
        <img
          src="https://i.pravatar.cc/40"
          alt="User"
          style={{ borderRadius: '50%', marginRight: '0.5rem' }}
        />
        <span>{t('header.user')}</span>
      </div>
    </header>
  );
};

export default Header;