import React from 'react';
import { getStarColor } from '../engine/constants';

function PalaceBox({ data, position, onStarClick, onPalaceClick }) {
    if (!data) return <div className="palace-box empty" />;

    const { cungName, fullCanChi, chiName, majorStars, goodStars, badStars, trangSinh, daiHan, thang, isTuan, isTriet } = data;

    return (
        <div className={`palace-box pos-${position} ${isTuan ? 'has-tuan' : ''} ${isTriet ? 'has-triet' : ''}`}>
            {/* Tuan/Triet Labels */}
            {isTuan && <div className="tuan-label">Tuần</div>}
            {isTriet && <div className="triet-label">Triệt</div>}

            <div className="box-header">
                <span className="chi-name">{fullCanChi}</span>
                <button
                    type="button"
                    className="cung-name-group clickable"
                    onClick={() => onPalaceClick && onPalaceClick(cungName)}
                >
                    <span className="cung-name">{cungName}</span>
                    <span className="dai-han" title="Nhãn đại hạn trên lá số nguyên cục. Không phải luận vận hạn đã duyệt.">{daiHan}</span>
                </button>
            </div>

            <div className="major-stars-container">
                {majorStars.map((star, idx) => (
                    <button
                        key={idx}
                        type="button"
                        className="major-star clickable"
                        style={{ color: getStarColor(star) }}
                        onClick={() => onStarClick && onStarClick(star, cungName)}
                    >
                        {star}
                    </button>
                ))}
            </div>

            <div className="minor-stars-container">
                <div className="good-stars">
                    {goodStars.map((star, idx) => (
                        <button
                            key={idx}
                            type="button"
                            className="minor-star clickable"
                            style={{ color: getStarColor(star) }}
                            onClick={() => onStarClick && onStarClick(star, cungName)}
                        >
                            {star}
                        </button>
                    ))}
                </div>
                <div className="bad-stars">
                    {badStars.map((star, idx) => (
                        <button
                            key={idx}
                            type="button"
                            className="minor-star clickable"
                            style={{ color: getStarColor(star) }}
                            onClick={() => onStarClick && onStarClick(star, cungName)}
                        >
                            {star}
                        </button>
                    ))}
                </div>
            </div>

            <div className="box-footer">
                <span className="chi-bottom">{chiName}</span>
                <span className="trang-sinh">{trangSinh}</span>
                <span className="thang-lap">Tháng {thang}</span>
            </div>
        </div>
    );
}

export default PalaceBox;
