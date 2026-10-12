import React from 'react';

function CenterInfo({ lunarInfo, tuviInfo, userInfo }) {
    if (!lunarInfo || !tuviInfo) return null;

    const mapCanh = ["Tí", "Sửu", "Dần", "Mão", "Thìn", "Tị", "Ngọ", "Mùi", "Thân", "Dậu", "Tuất", "Hợi"];
    let canhGio = Math.floor((userInfo.hour + 1) / 2);
    if (canhGio === 12) canhGio = 0;

    return (
        <div className="center-info">
            <h1 className="chart-title">LÁ SỐ TỬ VI</h1>

            <div className="info-grid">
                <div className="info-row">
                    <span className="label">Họ tên:</span>
                    <span className="value bold">{userInfo.name || "Vô Danh"}</span>
                </div>
                <div className="info-row">
                    <span className="label">Năm:</span>
                    <span className="value">{lunarInfo.lunarYear}</span>
                    <span className="value can-chi text-blue">{lunarInfo.canName} {lunarInfo.chiName}</span>
                </div>
                <div className="info-row">
                    <span className="label">Tháng:</span>
                    <span className="value">
                        {userInfo.month} ({lunarInfo.lunarMonth}{lunarInfo.isLeapMonth ? ' nhuận' : ''}
                        {tuviInfo.anSaoMonth && tuviInfo.anSaoMonth !== lunarInfo.lunarMonth ? `, an sao tháng ${tuviInfo.anSaoMonth}` : ''})
                    </span>
                </div>
                <div className="info-row">
                    <span className="label">Ngày:</span>
                    <span className="value">{userInfo.day} ({lunarInfo.lunarDay})</span>
                </div>
                <div className="info-row">
                    <span className="label">Giờ:</span>
                    <span className="value">{userInfo.hour} giờ 00 phút</span>
                    <span className="value can-chi text-blue">{mapCanh[canhGio]}</span>
                </div>

                <br/>
                <div className="info-row">
                    <span className="label">Âm Dương:</span>
                    <span className="value text-blue">{tuviInfo.textAmDuong}</span>
                </div>
                <div className="info-row">
                    <span className="label">Mệnh:</span>
                    <span className="value">{tuviInfo.nguHanhBanMenh}</span>
                </div>
                <div className="info-row">
                    <span className="label">Cục:</span>
                    <span className="value text-blue">{tuviInfo.cucInfo}</span>
                </div>
                <br/>
                <div className="info-row">
                    <span className="label">Chủ Mệnh:</span>
                    <span className="value text-blue">{tuviInfo.chuMenh}</span>
                </div>
                <div className="info-row">
                    <span className="label">Chủ Thân:</span>
                    <span className="value text-blue">{tuviInfo.chuThan}</span>
                </div>
                <br/>
                <div className="info-row">
                    <span className="value text-blue bold">{tuviInfo.thuanLy}</span>
                </div>
                <div className="info-row">
                    <span className="value text-blue bold">{tuviInfo.cucKhacMenh}</span>
                </div>
            </div>
            
            <div className="watermark">Tử Vi Nam Phái</div>
        </div>
    );
}

export default CenterInfo;
