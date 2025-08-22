// ./pages/HomePage.js
import React from 'react';
import { Link } from 'react-router-dom';
import listeIcon from '../assets/liste.png';

export default function HomePage() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#121212',
      color: 'white',
      fontFamily: 'Arial',
      padding: 20,
    }}>
      <img
        src="/titre.png"
        alt="Titre One Piece"
        style={{
          height: 300,
          objectFit: 'contain',
          marginBottom: 40,
        }}
      />
<Link to="/chapters">
  <img
    src={listeIcon}
    alt="Liste des Chapitres"
    style={{
      height: 100,        // ajuste la taille à ta convenance
      cursor: 'pointer',
      transition: 'transform 0.3s',
    }}
    onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
  />
</Link>
    </div>
  );

}
