import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import TranslateIcon from '@mui/icons-material/Translate';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SearchIcon from '@mui/icons-material/Search';
import { Menu, MenuItem, IconButton, InputAdornment, TextField } from '@mui/material';
import keycloak from '../keycloak';


const Header = () => {
  const { t, i18n } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [langAnchorEl, setLangAnchorEl] = useState<null | HTMLElement>(null);
  const [userAnchorEl, setUserAnchorEl] = useState<null | HTMLElement>(null);

  const handleLangClick = (e: React.MouseEvent<HTMLElement>) => setLangAnchorEl(e.currentTarget);
  const handleLangClose = () => setLangAnchorEl(null);
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    handleLangClose();
  };

  const handleUserClick = (e: React.MouseEvent<HTMLElement>) => setUserAnchorEl(e.currentTarget);
  const handleUserClose = () => setUserAnchorEl(null);
  const handleLogout = () => {
    keycloak.logout({ redirectUri: window.location.origin });
    handleUserClose();
  };

  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = () => {
    // Später: Hier echte Suche einbauen
    alert(`Suche nach: ${searchTerm}`);
  };

  return (
    <header className="modern-header">
      <div className="header-center">
        <TextField
        placeholder={t('header.search')}
        variant="outlined"
        size="small"
        value={searchTerm}
        onChange={handleSearchChange}
        onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit()}
        InputProps={{
          endAdornment: searchTerm && (
          <InputAdornment position="end">
            <IconButton onClick={handleSearchSubmit}>
              <SearchIcon />
            </IconButton>
          </InputAdornment>
          ),
        }}
        sx={{
          minWidth: '300px',
          backgroundColor: '#f4f1ed',
          borderRadius: '9999px',
          '& .MuiOutlinedInput-root': {
            borderRadius: '9999px',
            paddingRight: '4px',
            color: '#000',
            '& fieldset': {
              border: 'none',
            },
          '&:hover fieldset': {
            border: 'none',
          },
          '&.Mui-focused fieldset': {
            border: 'none',
          },
        },
        '& input': {
          color: '#000',
        },
      }}/>
      </div>

      <div className="header-right">
        {/* Sprachumschalter */}
        <IconButton onClick={handleLangClick} size="large">
          <TranslateIcon />
        </IconButton>
        <Menu anchorEl={langAnchorEl} open={!!langAnchorEl} onClose={handleLangClose}>
          <MenuItem onClick={() => changeLanguage('de')}>{t('lang.de')}</MenuItem>
        </Menu>

        {/* Benutzeranzeige */}
        <div className="user-profile" onClick={handleUserClick}>
          <div className="avatar-placeholder">
            <AccountCircleIcon fontSize="large" />
          </div>
          <div className="user-text">
            <span className="user-name">
              {keycloak.tokenParsed?.name || keycloak.tokenParsed?.preferred_username || 'User'}
            </span>

            
            <span className="user-role">
              {(keycloak.tokenParsed?.realm_access?.roles || [])
              .filter((role: string) =>
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