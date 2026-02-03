import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function Carrusel({ items }) {
    const trackRef = useRef(null);
    const autoScrollRef = useRef(null);
    const navigate = useNavigate();

    const startAutoScroll = () => {
        stopAutoScroll();
        autoScrollRef.current = setInterval(() => {
            const track = trackRef.current;
            if (!track) return;

            // velocidad EXACTA equivalente a tu smooth original:
            // 1px cada 88ms ≈ 16.62s por imagen
            track.scrollLeft += 1;

            const lastImage = track.lastElementChild;
            if (lastImage) {
                const lastImageRight = lastImage.offsetLeft + lastImage.offsetWidth;

                if (track.scrollLeft + track.clientWidth >= lastImageRight) {
                    track.scrollLeft = 0;
                }
            }

        }, 88); // ← velocidad calibrada EXACTA (ANTES: 90)
    };

    const stopAutoScroll = () => {
        if (autoScrollRef.current) clearInterval(autoScrollRef.current);
    };

    useEffect(() => {
        startAutoScroll();
        return () => stopAutoScroll();
    }, []);

    const scrollLeft = () => {
        const track = trackRef.current;
        track.scrollBy({ left: -200, behavior: "smooth" });
        restartAutoScroll();
    };

    const scrollRight = () => {
        const track = trackRef.current;
        track.scrollBy({ left: 200, behavior: "smooth" });
        restartAutoScroll();
    };

    const restartAutoScroll = () => {
        stopAutoScroll();
        setTimeout(() => startAutoScroll(), 5000);
    };

    const handleClick = (item) => {
        if (item.tipo === "juego") {
            navigate(`/juego/${item.id}`);
        } else if (item.tipo === "serie") {
            navigate(`/serie/${item.id}`);
        }
    };

    return (
        <div className="carousel" style={{ position: "relative" }}>
            <button className="carousel-button left" onClick={scrollLeft}>‹</button>

            <div
                className="carousel-track"
                ref={trackRef}
                onMouseEnter={stopAutoScroll}
                onMouseLeave={startAutoScroll}
            >
                {items.map((item, i) => (
                    <img
                        key={i}
                        src={item.portada}
                        alt=""
                        className="carousel-img"
                        onClick={() => handleClick(item)}
                        style={{ cursor: "pointer" }}
                    />
                ))}
            </div>

            <button className="carousel-button right" onClick={scrollRight}>›</button>
        </div>
    );
}