import { Link, useLocation } from 'react-router-dom';
import React, { useEffect } from 'react';
import { MagnifyingGlassIcon, ShoppingCartIcon, HomeIcon, Squares2X2Icon } from '@heroicons/react/24/outline';
import '../styles/Navbar.css';
import useNavbar from '../hooks/useNavbar';

interface NavbarProps {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  cartItemsCount?: number; // Opcional para mostrar badge del carrito
}

function Navbar({ searchTerm, setSearchTerm, cartItemsCount = 0 }: NavbarProps) {
  const location = useLocation();
  const {
    searchActive,
    setSearchActive,
    scrolled,
    isSearching,
    handleLinkHover,
    handleSearchFocus,
    setSearchingWithDebounce,
  } = useNavbar();

  // Efecto para manejar el estado de búsqueda
  useEffect(() => {
    const cleanup = setSearchingWithDebounce(searchTerm);
    return cleanup;
  }, [searchTerm, setSearchingWithDebounce]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // Estilos modernos y responsivos (2025, purple gradient, glassmorphism mejorado)
  const navBg = {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
    borderRadius: '0 0 32px 32px',
    padding: '0.75rem 1rem',
    position: 'fixed' as 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    zIndex: 1000,
    backdropFilter: 'blur(20px) saturate(180%)',
    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
    border: '1px solid rgba(255, 255, 255, 0.125)',
    transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  };

  const navLinkStyle = (active: boolean) => ({
    color: active ? '#ffffff' : 'rgba(255, 255, 255, 0.85)',
    fontWeight: active ? 600 : 500,
    background: active 
      ? 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%)' 
      : 'transparent',
    borderRadius: 20,
    padding: '0.6rem 1.2rem',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontSize: '0.95rem',
    transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    border: active ? '1px solid rgba(255,255,255,0.2)' : '1px solid transparent',
    textDecoration: 'none',
    cursor: 'pointer',
    transform: 'translateY(0)',
    boxShadow: active ? '0 4px 15px rgba(0,0,0,0.1)' : 'none',
  });

  const searchContainerStyle = {
    minWidth: '40px',
    maxWidth: '350px',
    width: searchActive || searchTerm ? '280px' : '40px',
    height: '48px',
    position: 'relative' as 'relative',
    transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    display: 'flex',
    alignItems: 'center',
  };

  const searchInputStyle = {
    borderRadius: '24px',
    boxShadow: searchActive || searchTerm 
      ? '0 8px 25px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.2)' 
      : '0 2px 8px rgba(0,0,0,0.1)',
    transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    width: searchActive || searchTerm ? '280px' : '0px',
    background: searchActive || searchTerm 
      ? 'rgba(255, 255, 255, 0.95)' 
      : 'rgba(255, 255, 255, 0.1)',
    fontSize: '0.95rem',
    height: '48px',
    paddingLeft: searchActive || searchTerm ? '50px' : '0px',
    paddingRight: searchActive || searchTerm ? '20px' : '0px',
    color: '#4a5568',
    border: searchActive || searchTerm 
      ? '2px solid rgba(102, 126, 234, 0.3)' 
      : '2px solid transparent',
    opacity: searchActive || searchTerm ? 1 : 0,
    visibility: (searchActive || searchTerm ? 'visible' : 'hidden') as 'visible' | 'hidden',
    position: 'absolute' as 'absolute',
    left: 0,
    top: 0,
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
  };

  const searchIconStyle = {
    left: searchActive || searchTerm ? '16px' : '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    width: '20px',
    height: '20px',
    color: searchActive || searchTerm ? '#667eea' : 'rgba(255, 255, 255, 0.8)',
    cursor: 'pointer',
    zIndex: 10,
    transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    filter: searchActive || searchTerm ? 'none' : 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))',
  };

  const brandStyle = {
    color: '#ffffff',
    letterSpacing: '1px',
    textShadow: '0 2px 10px rgba(0,0,0,0.3)',
    fontWeight: 800,
    fontSize: '1.5rem',
    textDecoration: 'none' as 'none',
    transition: 'all 0.3s ease',
  };

  return (
    <nav 
      style={navBg} 
      className={`shadow-lg ${scrolled ? 'scrolled' : ''}`}
    >
      <div 
        className="d-flex align-items-center justify-content-between w-100 flex-wrap"
        style={{ gap: '1rem' }}
      >
        {/* Brand y Search Container */}
        <div className="d-flex align-items-center" style={{ gap: '1rem', flex: '1', minWidth: 0 }}>
          <Link 
            to="/articulos" 
            className="navbar-brand fw-bold"
            style={brandStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.textShadow = '0 4px 15px rgba(0,0,0,0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.textShadow = '0 2px 10px rgba(0,0,0,0.3)';
            }}
          >
            FrontStore ✨
          </Link>
          
          {/* Search Container Mejorado */}
          <div
            className="search-container position-relative d-none d-md-block"
            style={searchContainerStyle}
            onMouseEnter={() => setSearchActive(true)}
            onMouseLeave={() => !searchTerm && setTimeout(() => setSearchActive(false), 200)}
          >
            <input
              type="text"
              className={`form-control search-input ${isSearching ? 'search-loading' : ''}`}
              placeholder="Buscar productos, categorías..."
              value={searchTerm}
              onChange={handleSearchChange}
              onFocus={() => setSearchActive(true)}
              onBlur={() => !searchTerm && setTimeout(() => setSearchActive(false), 150)}
              style={searchInputStyle}
            />
            <MagnifyingGlassIcon
              className="search-icon position-absolute"
              style={searchIconStyle}
              onClick={() => {
                setSearchActive(!searchActive);
                if (!searchActive) {
                  handleSearchFocus();
                }
              }}
            />
          </div>
        </div>

        {/* Search móvil */}
        <div className="d-md-none w-100 mt-2">
          <div className="position-relative">
            <input
              type="text"
              className={`form-control ${isSearching ? 'search-loading' : ''}`}
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={handleSearchChange}
              aria-label="Búsqueda de productos"
              style={{
                borderRadius: '24px',
                paddingLeft: '40px',
                height: '40px',
                background: 'rgba(255, 255, 255, 0.95)',
                border: '2px solid rgba(102, 126, 234, 0.3)',
                fontSize: '0.9rem',
                transition: 'all 0.3s ease',
              }}
              onFocus={(e) => {
                e.target.style.transform = 'scale(1.02)';
                e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.2)';
              }}
              onBlur={(e) => {
                e.target.style.transform = 'scale(1)';
                e.target.style.boxShadow = 'none';
              }}
            />
            <MagnifyingGlassIcon
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '18px',
                height: '18px',
                color: '#667eea',
                pointerEvents: 'none',
              }}
            />
          </div>
        </div>

        {/* Navigation Links */}
        <ul 
          className="navbar-nav d-flex flex-row align-items-center mb-0" 
          style={{ gap: '0.5rem' }}
        >
          <li className="nav-item">
            <Link 
              to="/articulos" 
              style={navLinkStyle(location.pathname === '/articulos' || location.pathname === '/')} 
              className="nav-link d-flex align-items-center"
              onMouseEnter={(e) => handleLinkHover(e, location.pathname === '/articulos' || location.pathname === '/', true)}
              onMouseLeave={(e) => handleLinkHover(e, location.pathname === '/articulos' || location.pathname === '/', false)}
            >
              <HomeIcon style={{ width: 20, height: 20, marginRight: '0.5rem' }} />
              <span className="d-none d-sm-inline">Inicio</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link 
              to="/categorias" 
              style={navLinkStyle(location.pathname === '/categorias')} 
              className="nav-link d-flex align-items-center"
              onMouseEnter={(e) => handleLinkHover(e, location.pathname === '/categorias', true)}
              onMouseLeave={(e) => handleLinkHover(e, location.pathname === '/categorias', false)}
            >
              <Squares2X2Icon style={{ width: 20, height: 20, marginRight: '0.5rem' }} />
              <span className="d-none d-sm-inline">Categorías</span>
            </Link>
          </li>
          <li className="nav-item">
            <Link 
              to="/carrito" 
              style={navLinkStyle(location.pathname === '/carrito')} 
              className="nav-link d-flex align-items-center position-relative"
              onMouseEnter={(e) => handleLinkHover(e, location.pathname === '/carrito', true)}
              onMouseLeave={(e) => handleLinkHover(e, location.pathname === '/carrito', false)}
            >
              <ShoppingCartIcon style={{ width: 22, height: 22, marginRight: '0.5rem' }} />
              <span className="d-none d-sm-inline">Carrito</span>
              {/* Badge para items en carrito */}
              {cartItemsCount > 0 && (
                <span 
                  className="position-absolute badge rounded-pill cart-badge" 
                  style={{ 
                    top: '-5px', 
                    right: '-5px', 
                    fontSize: '0.7rem',
                    minWidth: '18px',
                    height: '18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(135deg, #ff6b6b, #ee5a52)',
                    color: 'white',
                    fontWeight: 'bold',
                    boxShadow: '0 2px 8px rgba(238, 90, 82, 0.3)',
                  }}
                >
                  {cartItemsCount > 99 ? '99+' : cartItemsCount}
                </span>
              )}
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
