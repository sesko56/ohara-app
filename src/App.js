import React, { useRef, useState, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams } from 'react-router-dom';
import ChapterPage from './pages/ChapterPage';
import chapters from './data/chapters.json';
import './App.css';
import HomePage from './pages/HomePage.js';
import playIcon from './assets/play.png';   // adapte le chemin
import pauseIcon from './assets/pause.png'; // adapte le chemin

function BackgroundMusicButton() {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <audio ref={audioRef} loop>
        <source src="/audio/background.mp3" type="audio/mpeg" />
      </audio>

      {/* Bouton image */}
      <img
        src={isPlaying ? pauseIcon : playIcon}
        alt={isPlaying ? "Pause" : "Play"}
        onClick={togglePlay}
        style={{ width: 100, height: 50, cursor: 'pointer', marginLeft: 10 }}
      />
    </div>
  );
}



// 📘 Liste des chapitres
function ChapterList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);  // page actuelle
  const chapitresParPage = 50;

  const filteredChapters = chapters.filter(chapter =>
    chapter.keywords.some(keyword =>
      keyword.toLowerCase().includes(searchTerm.toLowerCase())
    )
    
  );

  // Pagination: découpage des chapitres selon la page
  const debut = (page - 1) * chapitresParPage;
  const fin = debut + chapitresParPage;
  const chaptersPage = filteredChapters.slice(debut, fin);

  const nbPages = Math.ceil(filteredChapters.length / chapitresParPage);

  return (
    <div style={{ maxWidth: 1600, margin: 'auto', padding: 20, fontFamily: 'Arial' }}>

      {/* LOGO centré */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        
 <Link to="/" style={{ display: 'inline-block' }}>
  <img
    src="/titre.png"
    alt="Titre One Piece"
    style={{
      height: 300,      
      objectFit: 'contain',
      marginTop: 10,
      cursor: 'pointer',  // très important pour montrer que c’est cliquable
    }}
  />
</Link>
</div>
      

      {/* LIGNE DORÉE pleine largeur */}
      <div style={{ height: 3, backgroundColor: '#D4AF37', marginBottom: 30 }} />

      {/* Champ de recherche avec loupe dorée */}
<div style={{ 
  position: 'relative', 
  marginBottom: 20, 
  display: 'flex', 
  justifyContent: 'flex-end' // pousse à droite
}}>
  <input
    type="text"
    placeholder="Rechercher un mot-clé..."
    value={searchTerm}
    onChange={e => {
      setSearchTerm(e.target.value);
      setPage(1);
    }}
    style={{
      width: '50%',    // moitié de la page
      padding: '8px 12px',
      fontSize: 14,
      borderRadius: 5,
      border: '1px solid #ccc',
    }}
  />

  {/* Ton bouton play/pause */}
  <BackgroundMusicButton />
</div>


      {/* Liste des chapitres paginée */}
      {filteredChapters.length > 0 ? (
        <>
         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 20 }}>

            {chaptersPage.map(chapter => (
              <Link
                to={`/chapter/${chapter.number}`}
                key={chapter.number}
                style={{
                  textDecoration: 'none',
                  color: 'white',
                

                }}
              >
                <div
                  style={{
                    border: '1px solid #ccc',
                    borderRadius: 10,
                    overflow: 'hidden',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                    transition: 'transform 0.3s ease',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'scale(1.10)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  <img
                    src={`/scans/${chapter.folder}/1.jpg`}
                    alt={`Chapitre ${chapter.number}`}
                    style={{
                      width: '100%',
                      height: 160,
                      objectFit: 'cover',
                    }}
                  />
                  <div style={{ padding: 10 }}>
                    <h3 style={{ margin: 0, fontSize: 16 }}>Chapitre {chapter.number}</h3>
                    <p style={{ margin: '5px 0 0 0', fontSize: 14 }}>{chapter.title}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          <div style={{ marginTop: 20, textAlign: 'center' }}>
            {Array.from({ length: nbPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                disabled={page === i + 1}
                style={{
                  margin: '0 5px',
                  padding: '5px 10px',
                  borderRadius: 5,
                  border: '1px solid #D4AF37',
                  backgroundColor: page === i + 1 ? '#D4AF37' : 'grey',
                  color: page === i + 1 ? 'white' : 'black',
                  cursor: page === i + 1 ? 'default' : 'pointer'
                }}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </>
      ) : (
        <p>Aucun chapitre trouvé.</p>
      )}
    </div>
  );
}




// 📖 Page de lecture d’un chapitre
function ChapterDetail() {
  const { chapterNumber } = useParams();
  const chapterIndex = chapters.findIndex(chap => chap.number === parseInt(chapterNumber));
  const chapter = chapters[chapterIndex];
  const [hiddenImages, setHiddenImages] = React.useState(new Set());
  const chapterImagesRef = useRef([]);
const [currentImageIndex, setCurrentImageIndex] = useState(0);
const [isImageZoomed, setIsImageZoomed] = useState(false);
 const handleNextImage = useCallback(() => {
    setCurrentImageIndex(prev => prev + 1);
    const nextImage = chapterImagesRef.current[currentImageIndex + 1];
    if (nextImage) {
      nextImage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [currentImageIndex]);

  const toggleImageZoom = useCallback(() => {
    setIsImageZoomed(prev => !prev);
  }, []);


  if (!chapter) return <p>Chapitre introuvable</p>;

  const images = [];
  for (let i = 1; i <= chapter.pages; i++) {
    images.push(`/scans/${chapter.folder}/${i}.jpg`);
  }

  const previousChapter = chapters[chapterIndex - 1];
  const nextChapter = chapters[chapterIndex + 1];

  return (
    <div style={{ maxWidth: 1600, margin: 'auto', padding: 20, fontFamily: 'Arial' }}>
      
      {/* Barre de navigation avec boutons */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          backgroundColor: '#121212',
          padding: '10px 0',
          zIndex: 10,
          borderBottom: '1px solid #ccc',
          gap: 12,
        }}
      >
        {/* Bouton Accueil */}
        <div style={{ flex: '0 0 auto', marginLeft: 12 }}>
          <Link
            to="/"
            style={{
              textDecoration: 'none',
              color: '#D4AF37',
              fontWeight: 'bold',
              fontSize: 16,
              border: '2px solid #D4AF37',
              padding: '6px 12px',
              borderRadius: 6,
              cursor: 'pointer',
              transition: 'background-color 0.3s, color 0.3s',
              display: 'inline-block',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor = '#D4AF37';
              e.currentTarget.style.color = 'white';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#D4AF37';
            }}
          >
            Accueil
          </Link>
        </div>

        {/* Bouton play/pause */}
        <BackgroundMusicButton />

        {/* Bouton précédent */}
        <div style={{ flex: '1 1 auto' }}>
          {previousChapter && (
            <Link to={`/chapter/${previousChapter.number}`} style={{ textDecoration: 'none', color: 'white' }}>
              ← Chapitre précédent
            </Link>
          )}
        </div>

        {/* Titre centré */}
        <div style={{ flex: '2 1 auto', textAlign: 'center', fontWeight: 'bold', color: 'white' }}>
          Chapitre {chapter.number} : {chapter.title}
        </div>

        {/* Bouton suivant */}
        <div style={{ flex: '1 1 auto', textAlign: 'right' }}>
          {nextChapter && (
            <Link to={`/chapter/${nextChapter.number}`} style={{ textDecoration: 'none', color: 'white' }}>
              Chapitre suivant →
            </Link>
          )}
        </div>
      </div>

      {/* Images du chapitre */}
<div
  style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    marginTop: 20,
    alignItems: 'center', // <-- centre horizontalement les images
  }}
>
 {images.map((src, index) => {
  if (hiddenImages.has(index)) return null;

  return (
    <div
      key={index}
      className="chapter-image-wrapper"
      style={{
        display: 'flex',
        justifyContent: 'center',   // Centre l’image horizontalement
        padding: 0,
        margin: 0,
      }}
    >
      <img
        ref={(el) => (chapterImagesRef.current[index] = el)}
        src={src}
        alt=""
        style={{
          width: '70%',              // Redimensionne proprement l’image
          display: 'block',
          margin: 0,
          padding: 0,
        }}
        className={`chapter-image ${index === currentImageIndex ? 'active' : ''} ${isImageZoomed ? 'zoomed' : ''}`}
        onClick={() => {
          if (!isImageZoomed) {
            handleNextImage();
          } else {
            toggleImageZoom();
          }
        }}
        onDoubleClick={toggleImageZoom}
        loading="lazy"
        onError={() => {
           
        }}
      />
    </div>
  );
})}

</div>

      {/* Lien retour */}
      <p style={{ marginTop: 30, textAlign: 'center' }}>
        <Link to="/" style={{ textDecoration: 'none', color: '#D4AF37' }}>
          ← Retour à la liste
        </Link>
      </p>
    </div>
  );
}


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/chapters" element={<ChapterList />} />
        <Route path="/chapter/:chapterNumber" element={<ChapterDetail />} />
        <Route path="/" element={<ChapterList />} />
        <Route path="/chapter/:chapterNumber" element={<ChapterDetail />} />
      </Routes>
    </Router>
    
  );
}

export default App;
