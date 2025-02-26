import { useState } from 'react';
import SpinToWin from './SpinToWin';
import ad1 from '../assets/ad1.png';

function Sidebar() {
  const [showGame, setShowGame] = useState(false);

  return (
    <div className="sidebar">
      <img src={ad1} alt="Ad" className="ad-image" />
      <button onClick={() => setShowGame(true)}>Spin to Win!</button>
      {showGame && <SpinToWin closeGame={() => setShowGame(false)} />}
    </div>
  );
}

export default Sidebar;