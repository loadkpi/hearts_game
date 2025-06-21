import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const getCustomWinMessage = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const encodedMessage = urlParams.get('msg');
  if (encodedMessage) {
    try {
      return atob(encodedMessage);
    } catch (e) {
      console.warn('Invalid base64 message parameter');
    }
  }
  return null;
};

const translations = {
  en: {
    title: "Find the Real Heart!",
    instruction: "Click on hearts to find the one that truly loves you!",
    start: "Click anywhere to start",
    winMessage: "Pavel loves Elena"
  },
  ru: {
    title: "Найди настоящее сердце!",
    instruction: "Кликай на сердечки, чтобы найти то, которое по-настоящему тебя любит!",
    start: "Кликни где угодно, чтобы начать",
    winMessage: "Павел любит Елену"
  }
};

const App = () => {
  const [hearts, setHearts] = useState([]);
  const [won, setWon] = useState(false);
  const [targetIndex, setTargetIndex] = useState(0);
  const [showInfo, setShowInfo] = useState(true);
  const [language, setLanguage] = useState('en');
  const containerRef = useRef(null);

  const customWinMessage = getCustomWinMessage();
  const t = {
    ...translations[language],
    winMessage: customWinMessage || translations[language].winMessage
  };

  useEffect(() => {
    const initialHearts = [];
    const target = Math.floor(Math.random() * 20);
    setTargetIndex(target);

    for (let i = 0; i < 20; i++) {
      initialHearts.push({
        id: i,
        x: Math.random() * (window.innerWidth - 50),
        y: Math.random() * (window.innerHeight - 50),
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        bouncing: false,
        bursting: false
      });
    }
    setHearts(initialHearts);
  }, []);

  useEffect(() => {
    if (hearts.length === 0) return;

    const animateHearts = () => {
      setHearts(prevHearts => 
        prevHearts.map(heart => {
          if (heart.bouncing || heart.bursting) return heart;

          let newX = heart.x + heart.vx;
          let newY = heart.y + heart.vy;
          let newVx = heart.vx;
          let newVy = heart.vy;

          if (newX <= 0 || newX >= window.innerWidth - 50) {
            newVx = -newVx;
            newX = Math.max(0, Math.min(window.innerWidth - 50, newX));
          }
          if (newY <= 0 || newY >= window.innerHeight - 50) {
            newVy = -newVy;
            newY = Math.max(0, Math.min(window.innerHeight - 50, newY));
          }

          return {
            ...heart,
            x: newX,
            y: newY,
            vx: newVx,
            vy: newVy
          };
        })
      );
    };

    const interval = setInterval(animateHearts, 16);
    return () => clearInterval(interval);
  }, [hearts.length]);

  const handleHeartClick = (heartId) => {
    if (won) return;
    setShowInfo(false);

    if (heartId === targetIndex) {
      setWon(true);
    } else {
      setHearts(prevHearts =>
        prevHearts.map(heart =>
          heart.id === heartId 
            ? { ...heart, bursting: true }
            : heart
        )
      );
      
      setTimeout(() => {
        setHearts(prevHearts =>
          prevHearts.filter(heart => heart.id !== heartId)
        );
      }, 600);
    }
  };

  return (
    <div className="app" ref={containerRef}>
      {hearts.map(heart => (
        <div
          key={heart.id}
          className={`heart ${heart.bouncing ? 'bouncing' : ''} ${heart.bursting ? 'bursting' : ''}`}
          style={{
            left: heart.x,
            top: heart.y
          }}
          onClick={() => handleHeartClick(heart.id)}
        >
          ❤️
        </div>
      ))}
      
      {showInfo && (
        <div className="info-message" onClick={() => setShowInfo(false)}>
          <div className="info-text">
            <h2>{t.title}</h2>
            <p>{t.instruction}</p>
            <small>{t.start}</small>
          </div>
        </div>
      )}
      
      <div className="language-switcher">
        <button 
          className={`lang-btn ${language === 'en' ? 'active' : ''}`}
          onClick={() => setLanguage('en')}
        >
          EN
        </button>
        <button 
          className={`lang-btn ${language === 'ru' ? 'active' : ''}`}
          onClick={() => setLanguage('ru')}
        >
          RU
        </button>
      </div>
      
      {won && (
        <div className="win-message">
          <div className="win-text">{t.winMessage}</div>
        </div>
      )}
    </div>
  );
};

export default App;