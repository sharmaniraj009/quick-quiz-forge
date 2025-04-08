
import React from 'react';
import Logo from './Logo';

const NavBar = () => {
  return (
    <header className="py-4 px-6 border-b shadow-sm bg-white">
      <div className="container mx-auto flex justify-between items-center">
        <Logo />
      </div>
    </header>
  );
};

export default NavBar;
