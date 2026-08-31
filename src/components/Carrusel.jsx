import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

export default function Carrusel({ items = [], variant = "row" }) {
    const trackRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    const updateScrollState = useCallback(() => {
        const track = trackRef.current;
        if (!track) return;
        const max = track.scrollWidth - track.clientWidth;
        setCanScrollLeft(track.scrollLeft > 8);
        setCanScrollRight(max > 8 && track.scrollLeft < max - 8);
    }, []);

    useEffect(() => {
        const track = trackRef.current;
        if (!track) return;

        updateScrollState();
        track.addEventListener("scroll", updateScrollState, { passive: true });

        const observer = new ResizeObserver(updateScrollState);
        observer.observe(track);

        return () => {
            track.removeEventListener("scroll", updateScrollState);
            observer.disconnect();
        };
    }, [items, updateScrollState]);

    const getPageDelta = () => {
        const track = trackRef.current;
        if (!track) return 0;
        const card = track.querySelector(".carousel-card");
        if (!card) return track.clientWidth * 0.85;
        const styles = window.getComputedStyle(track);
        const gap = parseFloat(styles.columnGap || styles.gap) || 12;
        const cardSize = card.offsetWidth + gap;
        const visible = Math.max(1, Math.floor((track.clientWidth + gap) / cardSize));
        return visible * cardSize;
    };

    const scrollByPage = (direction) => {
        const track = trackRef.current;
        if (!track) return;
        track.scrollBy({ left: direction * getPageDelta(), behavior: "smooth" });
    };

    const handleClick = (item) => {
        const from = location.pathname + location.search;
        const routes = {
            juego: `/juego/${item.id}`,
            serie: `/serie/${item.id}`,
            animado: `/animado/${item.id}`,
            anime: `/anime/${item.id}`,
        };
        const path = routes[item.tipo];
        if (path) navigate(path, { state: { from } });
    };

    if (!items.length) {
        return <p className="carousel-empty">No hay títulos para mostrar.</p>;
    }

    return (
        <div className={`carousel carousel--${variant}`}>
            {canScrollLeft && (
                <button
                    type="button"
                    className="carousel-button left"
                    onClick={() => scrollByPage(-1)}
                    aria-label="Anterior"
                >
                    <ChevronLeftIcon />
                </button>
            )}

            <div className="carousel-track" ref={trackRef}>
                {items.map((item) => (
                    <button
                        type="button"
                        key={`${item.tipo}-${item.id}`}
                        className="carousel-card"
                        onClick={() => handleClick(item)}
                    >
                        <span className="carousel-card-media">
                            <img
                                src={item.portada}
                                alt={item.titulo || ""}
                                className="carousel-img"
                                loading="lazy"
                            />
                        </span>
                        {item.titulo && (
                            <span className="carousel-card-body">
                                <span className="carousel-card-title">{item.titulo}</span>
                                {item.meta && (
                                    <span className="carousel-card-meta">{item.meta}</span>
                                )}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {canScrollRight && (
                <button
                    type="button"
                    className="carousel-button right"
                    onClick={() => scrollByPage(1)}
                    aria-label="Siguiente"
                >
                    <ChevronRightIcon />
                </button>
            )}
        </div>
    );
}
