import { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

export default function Carrusel({ items }) {
    const trackRef = useRef(null);
    const autoScrollRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();

    const startAutoScroll = () => {
        stopAutoScroll();
        autoScrollRef.current = setInterval(() => {
            const track = trackRef.current;
            if (!track) return;

            track.scrollLeft += 1;

            const lastImage = track.lastElementChild;
            if (lastImage) {
                const lastImageRight = lastImage.offsetLeft + lastImage.offsetWidth;

                if (track.scrollLeft + track.clientWidth >= lastImageRight) {
                    track.scrollLeft = 0;
                }
            }
        }, 88);
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
        if (!track) return;
        track.scrollBy({ left: -200, behavior: "smooth" });
        restartAutoScroll();
    };

    const scrollRight = () => {
        const track = trackRef.current;
        if (!track) return;
        track.scrollBy({ left: 200, behavior: "smooth" });
        restartAutoScroll();
    };

    const restartAutoScroll = () => {
        stopAutoScroll();
        setTimeout(() => startAutoScroll(), 5000);
    };

    const handleClick = (item) => {
        const from = location.pathname + location.search;

        if (item.tipo === "juego") {
            navigate(`/juego/${item.id}`, { state: { from } });
        } else if (item.tipo === "serie") {
            navigate(`/serie/${item.id}`, { state: { from } });
        } else if (item.tipo === "animado") {
            navigate(`/animado/${item.id}`, { state: { from } });
        } else if (item.tipo === "anime") {
            navigate(`/anime/${item.id}`, { state: { from } });
        }
    };

    return (
        <Box
            className="carousel"
            sx={{ position: "relative" }}
        >
            {/* Botón izquierda */}
            <IconButton
                className="carousel-button left"
                onClick={scrollLeft}
                sx={{
                    position: "absolute",
                    left: 0,
                    top: "50%",
                    transform: "translateY(-50%)",
                    backgroundColor: "rgba(0,0,0,0.5)",
                    color: "#fff",
                    "&:hover": { backgroundColor: "rgba(0,0,0,0.7)" },
                    zIndex: 10,
                }}
            >
                <ChevronLeftIcon />
            </IconButton>

            {/* Track del carrusel */}
            <Box
                className="carousel-track"
                ref={trackRef}
                onMouseEnter={stopAutoScroll}
                onMouseLeave={startAutoScroll}
                sx={{
                    display: "flex",
                    overflowX: "auto",
                    gap: "10px",
                    padding: "10px 40px",
                    scrollbarWidth: "none",
                    "&::-webkit-scrollbar": { display: "none" },
                }}
            >
                {items.map((item, i) => (
                    <Box
                        key={i}
                        component="img"
                        src={item.portada}
                        alt=""
                        className="carousel-img"
                        onClick={() => handleClick(item)}
                        sx={{
                            cursor: "pointer",
                            borderRadius: "8px",
                            flexShrink: 0,
                            width: "180px",
                            height: "260px",
                            objectFit: "cover",
                            boxShadow: "0 0 10px rgba(0,0,0,0.5)",
                            transition: "transform 0.2s",
                            "&:hover": {
                                transform: "scale(1.05)",
                            },
                        }}
                    />
                ))}
            </Box>

            {/* Botón derecha */}
            <IconButton
                className="carousel-button right"
                onClick={scrollRight}
                sx={{
                    position: "absolute",
                    right: 0,
                    top: "50%",
                    transform: "translateY(-50%)",
                    backgroundColor: "rgba(0,0,0,0.5)",
                    color: "#fff",
                    "&:hover": { backgroundColor: "rgba(0,0,0,0.7)" },
                    zIndex: 10,
                }}
            >
                <ChevronRightIcon />
            </IconButton>
        </Box>
    );
}
