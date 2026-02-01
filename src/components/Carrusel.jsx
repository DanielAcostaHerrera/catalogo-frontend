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
            track.scrollBy({ left: 2, behavior: "smooth" });
            if (track.scrollLeft + track.clientWidth >= track.scrollWidth) {
                track.scrollTo({ left: 0, behavior: "smooth" });
            }
        }, 50);
    };

    const stopAutoScroll = () => {
        if (autoScrollRef.current) clearInterval(autoScrollRef.current);
    };

    useEffect(() => {
        startAutoScroll();
        return () => stopAutoScroll();
    }, []);

    const scrollLeft = () => {
        trackRef.current.scrollBy({ left: -200, behavior: "smooth" });
        restartAutoScroll();
    };

    const scrollRight = () => {
        trackRef.current.scrollBy({ left: 200, behavior: "smooth" });
        restartAutoScroll();
    };

    const restartAutoScroll = () => {
        stopAutoScroll();
        setTimeout(() => {
            startAutoScroll();
        }, 5000);
    };

    const handleClick = (item) => {
        if (item.tipo === "juego") {
            navigate(`/juego/${item.id}`);   // ✅ ahora correcto
        } else if (item.tipo === "serie") {
            navigate(`/serie/${item.id}`);   // ✅ ahora correcto
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
                        alt={`item-${i}`}
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