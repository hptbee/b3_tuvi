import { useEffect, useId, useRef, useState } from 'react';
import PalaceBox from './PalaceBox';
import CenterInfo from './CenterInfo';
import { API_BASE } from '../apiBase';

function TuViChart({ lunarInfo, tuviInfo, userInfo }) {
    const [lookup, setLookup] = useState(null);
    const controller = useRef(null);
    const sequence = useRef(0);
    const dialog = useRef(null);
    const trigger = useRef(null);
    const heading = useRef(null);
    const headingId = useId();
    const current = lookup?.chart === tuviInfo ? lookup : null;
    const isOpen = Boolean(current);
    useEffect(() => () => {
        sequence.current += 1;
        controller.current?.abort();
    }, [tuviInfo]);
    useEffect(() => {
        if (isOpen && dialog.current && !dialog.current.open) dialog.current.showModal();
    }, [isOpen]);
    const loadInfo = async ({ kind, starName, cungName }, captureFocus = true) => {
        if (captureFocus) trigger.current = document.activeElement;
        controller.current?.abort();
        const next = new AbortController();
        controller.current = next;
        const id = ++sequence.current;
        const intent = { kind, starName, cungName, chart: tuviInfo };
        setLookup({ ...intent, status: 'loading', data: null });
        try {
            const url = kind === 'star'
                ? `${API_BASE}/api/meanings/star/${encodeURIComponent(starName)}?palace=${encodeURIComponent(cungName)}`
                : `${API_BASE}/api/meanings/palace/${encodeURIComponent(cungName)}`;
            const response = await fetch(url, { signal: next.signal, cache: 'no-store' });
            if (!response.ok) throw new Error('Meaning unavailable');
            const data = await response.json();
            const valid = kind === 'star'
                ? typeof data?.text === 'string' && data.text.length <= 50_000
                : Array.isArray(data) && data.length <= 32 && data.every(item => typeof item?.title === 'string' && typeof item?.desc === 'string' && item.title.length <= 200 && item.desc.length <= 50_000);
            if (!valid) throw new Error('Invalid meaning response');
            if (next.signal.aborted || id !== sequence.current) return;
            setLookup({ ...intent, status: 'ready', data });
        } catch (error) {
            if (next.signal.aborted || id !== sequence.current || error?.name === 'AbortError') return;
            setLookup({ ...intent, status: 'error', data: null });
        }
    };
    const handleStarClick = (starName, cungName) => loadInfo({ kind: 'star', starName, cungName });
    const handlePalaceClick = cungName => loadInfo({ kind: 'palace', cungName });
    const closeInfo = () => {
        sequence.current += 1;
        controller.current?.abort();
        dialog.current?.close();
        setLookup(null);
        if (trigger.current?.isConnected) trigger.current.focus();
    };

    if (!tuviInfo) return null;
    const { boxes } = tuviInfo;

    return (
        <div className="tuvi-chart">
            {current && (
                <dialog className="star-modal-content" ref={dialog} aria-labelledby={headingId} onCancel={event => { event.preventDefault(); closeInfo(); }} onKeyDown={event => {
                    if (event.key !== 'Tab') return;
                    const buttons = [...event.currentTarget.querySelectorAll('button')];
                    const first = buttons[0];
                    const last = buttons.at(-1);
                    const active = document.activeElement;
                    if (!buttons.includes(active) || (event.shiftKey ? active === first : active === last)) {
                        event.preventDefault();
                        (event.shiftKey ? last : first)?.focus();
                    }
                }} onClick={event => {
                    if (event.target !== event.currentTarget) return;
                    const bounds = event.currentTarget.getBoundingClientRect();
                    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) closeInfo();
                }}>
                    <button type="button" className="close-btn" aria-label="Đóng thông tin" onClick={closeInfo}>×</button>
                    <h3 id={headingId} ref={heading} tabIndex={-1}>{current.kind === 'star' ? `Sao ${current.starName}` : current.cungName}</h3>
                    {current.kind === 'star' && <p className="cung-subtitle">Tại cung <strong>{current.cungName}</strong></p>}
                    {current.status === 'loading' && <p role="status">Đang tải thông tin…</p>}
                    {current.status === 'error' && <div><p role="alert">Không tải được thông tin. Vui lòng thử lại.</p><button type="button" onClick={() => { heading.current?.focus(); loadInfo(current, false); }}>Thử lại</button></div>}
                    {current.status === 'ready' && <div className="star-meaning-body">
                        {current.kind === 'star' ? <p>{current.data.text || 'Chưa có nội dung tra cứu.'}</p> : current.data.length === 0 ? <p>Chưa có nội dung tra cứu.</p> : current.data.map((item, index) => <div key={index} className="palace-meaning-item"><h4>{item.title}</h4><p>{item.desc}</p></div>)}
                    </div>}
                </dialog>
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
