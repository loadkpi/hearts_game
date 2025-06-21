import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const App = () => {
  const [hearts, setHearts] = useState([]);
  const [won, setWon] = useState(false);
  const [targetIndex, setTargetIndex] = useState(0);
  const containerRef = useRef(null);

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
        bouncing: false
      });
    }
    setHearts(initialHearts);
  }, []);

  useEffect(() => {
    if (hearts.length === 0) return;

    const animateHearts = () => {
      setHearts(prevHearts => 
        prevHearts.map(heart => {
          if (heart.bouncing) return heart;

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

    if (heartId === targetIndex) {
      setWon(true);
    } else {
      setHearts(prevHearts =>
        prevHearts.map(heart =>
          heart.id === heartId 
            ? { ...heart, bouncing: true }
            : heart
        )
      );
    }
  };

  return (
    <div className="app" ref={containerRef}>
      {hearts.map(heart => (
        <div
          key={heart.id}
          className={`heart ${heart.bouncing ? 'bouncing' : ''}`}
          style={{
            left: heart.x,
            top: heart.y
          }}
          onClick={() => handleHeartClick(heart.id)}
        >
          ❤️
        </div>
      ))}
      
      {won && (
        <div className="win-message">
          <div className="win-text">Pavel loves Elena</div>
        </div>
      )}
    </div>
  );
};

export default App;