import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import TranslateIcon from '@mui/icons-material/Translate';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CheckIcon from '@mui/icons-material/Check';
import { Menu, MenuItem, IconButton, ListItemIcon, ListItemText } from '@mui/material';
import keycloak from '../keycloak';
import './header.css';
import logo from '../assets/ssn_network.png';

import { Link } from 'react-router-dom';


const Header = () => {
  const { t, i18n } = useTranslation();
  const [langAnchorEl, setLangAnchorEl] = useState<null | HTMLElement>(null);
  const [userAnchorEl, setUserAnchorEl] = useState<null | HTMLElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('lang');
    if (saved && saved !== i18n.language) i18n.changeLanguage(saved);
  }, []);

  const handleLangClick = (e: React.MouseEvent<HTMLElement>) => setLangAnchorEl(e.currentTarget);
  const handleLangClose = () => setLangAnchorEl(null);
  const changeLanguage = (lng: 'de' | 'en' | 'fr') => {
    i18n.changeLanguage(lng);
    localStorage.setItem('lang', lng); 
    handleLangClose();
  };

  const handleUserClick = (e: React.MouseEvent<HTMLElement>) => setUserAnchorEl(e.currentTarget);
  const handleUserClose = () => setUserAnchorEl(null);
  const handleLogout = () => {
    keycloak.logout({ redirectUri: window.location.origin });
    handleUserClose();
  };

  const languages: Array<{ code: 'de' | 'en' | 'fr'; label: string }> = [
    { code: 'de', label: t('lang.de') || 'DE' },
    { code: 'en', label: t('lang.en') || 'EN' },
    { code: 'fr', label: t('lang.fr') || 'FR' }
  ];

  return (
    <header className="modern-header">
      {/* Logo */}      
      <div className="header-left">
        <Link to="/">
          <img src={logo} alt="SSN Logo" className="header-logo " />
        </Link>
      </div >


      <div className="header-right">
        {/* Sprachumschalter */}
        <IconButton onClick={handleLangClick} size="large" aria-label="change language">
          <TranslateIcon />
        </IconButton>
        <Menu anchorEl={langAnchorEl} open={!!langAnchorEl} onClose={handleLangClose}>
          {languages.map(({ code, label }) => {
            const isActive = i18n.language?.startsWith(code);
            return (
              <MenuItem key={code} onClick={() => changeLanguage(code)}>
                {isActive && (
                  <ListItemIcon>
                    <CheckIcon fontSize="small" />
                  </ListItemIcon>
                )}
                <ListItemText inset={!isActive}>{label}</ListItemText>
              </MenuItem>
            );
          })}
        </Menu>

        {/* Benutzeranzeige */}
        <div className="user-profile" onClick={handleUserClick}>
          <div className="avatar-placeholder">
            <AccountCircleIcon fontSize="large" />
          </div>
          <div className="user-text">
            <span className="user-name">
              {keycloak.tokenParsed?.name ||
                keycloak.tokenParsed?.preferred_username ||
                'User'}
            </span>
            <span className="user-role">
              {(keycloak.tokenParsed?.realm_access?.roles || [])
                .filter(
                  (role: string) =>
                    !role.startsWith('default-') &&
                    !role.includes('offline_access') &&
                    !role.includes('uma_authorization')
                )
                .join(', ') || 'Keine Rolle'}
            </span>
          </div>
          <ExpandMoreIcon fontSize="small" style={{ color: '#555' }} />
        </div>

        <Menu anchorEl={userAnchorEl} open={!!userAnchorEl} onClose={handleUserClose}>
          <MenuItem onClick={handleLogout}>{t('header.menu.logout')}</MenuItem>
        </Menu>
      </div>
    </header>
  );
};

export default Header;