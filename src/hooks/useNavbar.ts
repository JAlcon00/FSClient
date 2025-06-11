import { useState, useEffect, useCallback } from 'react';

export const useNavbar = () => {
  const [searchActive, setSearchActive] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Efecto de scroll optimizado con debounce
  useEffect(() => {
    let timeoutId: number;
    
    const handleScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const isScrolled = window.scrollY > 10;
        setScrolled(isScrolled);
      }, 10);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutId);
    };
  }, []);

  // Función optimizada para manejar el hover
  const handleLinkHover = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, isActive: boolean, isEntering: boolean) => {
      if (!isActive) {
        const element = e.currentTarget;
        if (isEntering) {
          element.style.background = 'rgba(255,255,255,0.15)';
          element.style.transform = 'translateY(-2px)';
          element.style.boxShadow = '0 6px 20px rgba(0,0,0,0.15)';
        } else {
          element.style.background = 'transparent';
          element.style.transform = 'translateY(0)';
          element.style.boxShadow = 'none';
        }
      }
    },
    []
  );

  // Función para manejar el focus del search con mejor UX
  const handleSearchFocus = useCallback(() => {
    setSearchActive(true);
    setTimeout(() => {
      const input = document.querySelector('.search-input') as HTMLInputElement;
      if (input) {
        input.focus();
        // Opcional: seleccionar todo el texto
        input.select();
      }
    }, 100);
  }, []);

  // Función para detectar si es dispositivo móvil
  const isMobile = useCallback(() => {
    return window.innerWidth <= 768;
  }, []);

  // Efecto para el estado de búsqueda con debounce
  const setSearchingWithDebounce = useCallback((searchTerm: string) => {
    if (searchTerm) {
      setIsSearching(true);
      const timeoutId = setTimeout(() => {
        setIsSearching(false);
      }, 300);
      return () => clearTimeout(timeoutId);
    } else {
      setIsSearching(false);
    }
  }, []);

  return {
    searchActive,
    setSearchActive,
    scrolled,
    isSearching,
    setIsSearching,
    handleLinkHover,
    handleSearchFocus,
    isMobile,
    setSearchingWithDebounce,
  };
};

export default useNavbar;
