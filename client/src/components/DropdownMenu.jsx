import React, { useState, useEffect, useRef } from 'react';
import './DropdownMenu.css';

const DropdownMenu = ({ label, icon, items, ariaLabel, className = '', hoverEnabled = true }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const dropdownRef = useRef(null);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);
  const menuId = `dropdown-menu-${Math.random().toString(36).substr(2, 9)}`;

  // No-op function for disabled click behavior
  const noop = () => {};

  // Handle hover and focus events
  const handleOpen = () => {
    if (hoverEnabled) {
      setIsOpen(true);
      setFocusedIndex(-1);
    }
  };

  const handleClose = (event) => {
    if (hoverEnabled && event && event.relatedTarget) {
      // Check if the relatedTarget is within the dropdown
      if (dropdownRef.current && !dropdownRef.current.contains(event.relatedTarget)) {
        setIsOpen(false);
        setFocusedIndex(-1);
      }
    } else if (hoverEnabled && !event?.relatedTarget) {
      // For mouse leave events without relatedTarget
      setIsOpen(false);
      setFocusedIndex(-1);
    }
  };

  // Close dropdown
  const closeDropdown = () => {
    setIsOpen(false);
    setFocusedIndex(-1);
    buttonRef.current?.focus();
  };

  // Handle keyboard navigation
  const handleKeyDown = (event) => {
    if (!isOpen) {
      if (event.key === 'Enter' || event.key === ' ' || event.key === 'ArrowDown') {
        event.preventDefault();
        setIsOpen(true);
        setFocusedIndex(0);
      }
      return;
    }

    switch (event.key) {
      case 'Escape':
        event.preventDefault();
        closeDropdown();
        break;
      
      case 'ArrowDown':
        event.preventDefault();
        setFocusedIndex(prevIndex => 
          prevIndex < items.length - 1 ? prevIndex + 1 : 0
        );
        break;
      
      case 'ArrowUp':
        event.preventDefault();
        setFocusedIndex(prevIndex => 
          prevIndex > 0 ? prevIndex - 1 : items.length - 1
        );
        break;
      
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (focusedIndex >= 0 && items[focusedIndex]) {
          const item = items[focusedIndex];
          if (item.onClick) {
            item.onClick();
          } else if (item.href) {
            window.location.href = item.href;
          }
          closeDropdown();
        }
        break;
      
      case 'Tab':
        closeDropdown();
        break;
      
      default:
        break;
    }
  };

  // Handle item click
  const handleItemClick = (item, index) => {
    if (item.onClick) {
      item.onClick();
    }
    closeDropdown();
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        closeDropdown();
      }
    };

    const handleGlobalKeyDown = (event) => {
      if (event.key === 'Escape' && isOpen) {
        closeDropdown();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleGlobalKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, [isOpen]);

  // Focus management for keyboard navigation
  useEffect(() => {
    if (isOpen && focusedIndex >= 0 && menuRef.current) {
      const menuItems = menuRef.current.querySelectorAll('.dropdown-menu-item');
      if (menuItems[focusedIndex]) {
        menuItems[focusedIndex].focus();
      }
    }
  }, [focusedIndex, isOpen]);

  return (
    <div 
      className={`dropdown-menu ${className}`} 
      ref={dropdownRef}
      onKeyDown={handleKeyDown}
    >
      <button
        ref={buttonRef}
        className="dropdown-toggle"
        onClick={noop}
        onMouseEnter={handleOpen}
        onFocus={handleOpen}
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-controls={menuId}
        aria-label={ariaLabel || `${label} menu`}
        type="button"
      >
        <span className="dropdown-label">{label}</span>
      </button>

      <ul
        id={menuId}
        ref={menuRef}
        className={`dropdown-menu-list ${isOpen ? 'open' : ''}`}
        role="menu"
        aria-labelledby={buttonRef.current?.id}
        onMouseLeave={handleClose}
        onBlur={handleClose}
      >
        {items.map((item, index) => (
          <li key={index} role="none">
            {item.href ? (
              <a
                href={item.href}
                className={`dropdown-menu-item ${focusedIndex === index ? 'focused' : ''}`}
                role="menuitem"
                tabIndex={isOpen ? 0 : -1}
                onClick={(e) => {
                  if (!item.external) {
                    e.preventDefault();
                  }
                  handleItemClick(item, index);
                }}
              >
                <span className="item-text">{item.text}</span>
              </a>
            ) : (
              <button
                className={`dropdown-menu-item ${focusedIndex === index ? 'focused' : ''}`}
                role="menuitem"
                tabIndex={isOpen ? 0 : -1}
                onClick={() => handleItemClick(item, index)}
                disabled={item.disabled}
              >
                <span className="item-text">{item.text}</span>
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DropdownMenu;
