import React from 'react';
import './Button.css';

const Button = ({ primary, children }) => {
  return (
    <button className={`button ${primary ? 'primary' : ''}`}>
      {children}
    </button>
  );
};

export default Button;
