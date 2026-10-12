import React, { useState } from 'react';
import PalaceBox from './PalaceBox';
import CenterInfo from './CenterInfo';
import { API_BASE } from '../apiBase';

function TuViChart({ lunarInfo, tuviInfo, userInfo }) {
    const [selectedStar, setSelectedStar] = useState(null);
    const [selectedPalace, setSelectedPalace] = useState(null);

    if (!tuviInfo) return null;

    const { boxes } = tuviInfo;

    const handleStarClick = async (starName, cungName) => {
        try {
            const url = `${API_BASE}/api/meanings/star/${encodeURIComponent(starName)}?palace=${encodeURIComponent(cungName)}`;
            const res = await fetch(url);
            const data = await res.json();
            setSelectedStar({ starName, cungName, meaning: data.text || data });
            setSelectedPalace(null);
        } catch (error) {
            console.error(error);
        }
    };

    const handlePalaceClick = async (cungName) => {
        try {
            const res = await fetch(`${API_BASE}/api/meanings/palace/${encodeURIComponent(cungName)}`);
            const data = await res.json();
            setSelectedPalace({ cungName, meaningList: data });
            setSelectedStar(null);
        } catch (error) {
            console.error(error);
        }
    };

    const closeInfo = () => {
        setSelectedStar(null);
        setSelectedPalace(null);
    };

    return (
        <div className="tuvi-chart">
            {(selectedStar || selectedPalace) && (
                <div className="star-modal-overlay" onClick={closeInfo}>
                    <div className="star-modal-content" onClick={e => e.stopPropagation()}>
                        <button className="close-btn" onClick={closeInfo}>×</button>
                        
                        {selectedStar && (
                            <>
                                <h3>Sao {selectedStar.starName}</h3>
                                <p className="cung-subtitle">Tại cung <strong>{selectedStar.cungName}</strong></p>
                                <div className="star-meaning-body">
                                    <p>{selectedStar.meaning}</p>
                                </div>
                            </>
                        )}

                        {selectedPalace && (
                            <>
                                <h3>{selectedPalace.cungName}</h3>
                                <div className="star-meaning-body">
                                    {selectedPalace.meaningList.map((item, idx) => (
                                        <div key={idx} style={{ marginBottom: '15px' }}>
                                            <h4 style={{ color: '#ffb347', marginBottom: '5px' }}>{item.title}</h4>
                                            <p>{item.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

            <div className="grid-container">
                {/* Row 1: Tị (6), Ngọ (7), Mùi (8), Thân (9) */}
                <PalaceBox data={boxes[6]} position={6} onStarClick={handleStarClick} onPalaceClick={handlePalaceClick} />
                <PalaceBox data={boxes[7]} position={7} onStarClick={handleStarClick} onPalaceClick={handlePalaceClick} />
                <PalaceBox data={boxes[8]} position={8} onStarClick={handleStarClick} onPalaceClick={handlePalaceClick} />
                <PalaceBox data={boxes[9]} position={9} onStarClick={handleStarClick} onPalaceClick={handlePalaceClick} />

                {/* Row 2 */}
                <PalaceBox data={boxes[5]} position={5} onStarClick={handleStarClick} onPalaceClick={handlePalaceClick} />
                <div className="center-wrapper">
                    <CenterInfo lunarInfo={lunarInfo} tuviInfo={tuviInfo} userInfo={userInfo} />
                </div>
                <PalaceBox data={boxes[10]} position={10} onStarClick={handleStarClick} onPalaceClick={handlePalaceClick} />

                {/* Row 3 */}
                <PalaceBox data={boxes[4]} position={4} onStarClick={handleStarClick} onPalaceClick={handlePalaceClick} />
                <PalaceBox data={boxes[11]} position={11} onStarClick={handleStarClick} onPalaceClick={handlePalaceClick} />

                {/* Row 4: Dần (3), Sửu (2), Tí (1), Hợi (12) */}
                <PalaceBox data={boxes[3]} position={3} onStarClick={handleStarClick} onPalaceClick={handlePalaceClick} />
                <PalaceBox data={boxes[2]} position={2} onStarClick={handleStarClick} onPalaceClick={handlePalaceClick} />
                <PalaceBox data={boxes[1]} position={1} onStarClick={handleStarClick} onPalaceClick={handlePalaceClick} />
                <PalaceBox data={boxes[12]} position={12} onStarClick={handleStarClick} onPalaceClick={handlePalaceClick} />
            </div>
        </div>
    );
}

export default TuViChart;
