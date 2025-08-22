// src/pages/ChapterPage.jsx
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import chapters from '../data/chapters'; // adapte ce chemin si besoin

const ChapterPage = () => {
  const { chapterNumber } = useParams();
  const chapterData = chapters.find(c => c.number === parseInt(chapterNumber));

  if (!chapterData) {
    return <div style={{ padding: 20 }}>Chapitre introuvable.</div>;
  }

  return (
    <div style={{ padding: 20 }}>
      {/* Barre sticky avec titre et navigation */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          backgroundColor: 'white',
          zIndex: 10,
          padding: '10px 0',
          borderBottom: '1px solid #ccc',
        }}
      >
        <Link
          to={`/chapter/${parseInt(chapterNumber) - 1}`}
          style={{
            visibility: chapterData.number > 1 ? 'visible' : 'hidden',
            textDecoration: 'none',
            color: '#fff',
            backgroundColor: '#D4AF37',
            padding: '8px 16px',
            borderRadius: 5,
            fontWeight: 'bold',
          }}
        >
          ◀ Chapitre précédent
        </Link>

        <h2 style={{ margin: 0 }}>
          Chapitre {chapterData.number} : {chapterData.title}
        </h2>

        <Link
          to={`/chapter/${parseInt(chapterNumber) + 1}`}
          style={{
            textDecoration: 'none',
            color: '#fff',
            backgroundColor: '#D4AF37',
            padding: '8px 16px',
            borderRadius: 5,
            fontWeight: 'bold',
          }}
        >
          Chapitre suivant ▶
        </Link>
      </div>

      {/* Affichage des pages du chapitre */}
      <div>
        {Array.from({ length: chapterData.pageCount }).map((_, i) => (
          <img
            key={i}
            src={`/scans/${chapterData.folder}/${i + 1}.jpg`}
            alt={`Page ${i + 1}`}
            style={{ width: '100%', margin: '20px 0' }}
          />
        ))}
      </div>
    </div>
  );
};

export default ChapterPage;
