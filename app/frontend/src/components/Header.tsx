import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import TranslateIcon from '@mui/icons-material/Translate';
import { Menu, MenuItem, IconButton } from '@mui/material';

const Header = () => {
  const { t, i18n } = useTranslation();

  // Menü für Benutzer
  const [userAnchorEl, setUserAnchorEl] = useState<null | HTMLElement>(null);
  const userMenuOpen = Boolean(userAnchorEl);

  // Menü für Sprache
  const [langAnchorEl, setLangAnchorEl] = useState<null | HTMLElement>(null);
  const langMenuOpen = Boolean(langAnchorEl);

  // Benutzer-Menü
  const handleUserClick = (event: React.MouseEvent<HTMLElement>) => {
    setUserAnchorEl(event.currentTarget);
  };

  const handleUserClose = () => {
    setUserAnchorEl(null);
  };

  const handleLogout = () => {
    alert(t('header.menu.logoutSuccess'));
    handleUserClose();
  };

  // Sprachmenü
  const handleLangClick = (event: React.MouseEvent<HTMLElement>) => {
    setLangAnchorEl(event.currentTarget);
  };

  const handleLangClose = () => {
    setLangAnchorEl(null);
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    handleLangClose();
  };

  return (
    <header className="header">
      <input type="text" placeholder={t('header.search')} />

      <div className="user-info" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {/* Sprachumschalter */}
        <IconButton onClick={handleLangClick} size="large" sx={{ color: '#000' }}>
          <TranslateIcon fontSize="large" />
        </IconButton>
        <Menu
          anchorEl={langAnchorEl}
          open={langMenuOpen}
          onClose={handleLangClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <MenuItem onClick={() => changeLanguage('de')}>{t('lang.de')}</MenuItem>
        </Menu>

        {/* Benutzer-Menü */}
        <IconButton onClick={handleUserClick} size="large" sx={{ color: '#000' }}>
          <AccountCircleIcon fontSize="large" />
        </IconButton>
        <Menu
          anchorEl={userAnchorEl}
          open={userMenuOpen}
          onClose={handleUserClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <MenuItem disabled>
            {t('header.menu.userLabel')}: {t('header.user')}
          </MenuItem>
          <MenuItem onClick={handleLogout}>{t('header.menu.logout')}</MenuItem>
        </Menu>
      </div>
    </header>
  );
};

export default Header;