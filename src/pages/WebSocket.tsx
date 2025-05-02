import React, { useRef, useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:3001");

function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const prevPos = useRef({ x: 0, y: 0 });
  const [userColor, setUserColor] = useState<string>("#000000");

  // Fonction pour ajuster la taille du canvas
  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };

  useEffect(() => {
    resizeCanvas();
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.lineCap = "round";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctxRef.current = ctx;

    socket.on("setColor", (color: string) => {
      setUserColor(color);
    });

    socket.on("draw", ({ x0, y0, x1, y1, color }) => {
      drawLine(x0, y0, x1, y1, false, color);
    });

    window.addEventListener("resize", resizeCanvas);

    return () => {
      socket.off("draw");
      socket.off("setColor");
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  // Calcule la position de la souris relative au canvas
  const getRelativePos = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    // Calcul du facteur d'échelle
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const drawLine = (
    x0: number,
    y0: number,
    x1: number,
    y1: number,
    emit = false,
    color?: string
  ) => {
    const ctx = ctxRef.current;
    if (!ctx) return;

    ctx.save();
    ctx.strokeStyle = color || userColor;
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.stroke();
    ctx.closePath();
    ctx.restore();

    if (emit) {
      socket.emit("draw", { x0, y0, x1, y1 });
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    setIsDrawing(true);
    prevPos.current = getRelativePos(e);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    if (!isDrawing) return;
    const { x, y } = prevPos.current;
    const { x: newX, y: newY } = getRelativePos(e);
    drawLine(x, y, newX, newY, true);
    prevPos.current = { x: newX, y: newY };
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  return (
    <canvas
      ref={canvasRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={stopDrawing}
      onMouseLeave={stopDrawing}
      style={{
        display: "block",
        position: "absolute",
        top: "15%",
        left: "10%",
        width: "80vw", // 80% de la largeur de la fenêtre
        height: "80vh", // 80% de la hauteur de la fenêtre
        zIndex: 1,
        backgroundColor: "rgba(255, 255, 255, 0.1)", // Couleur semi-transparente
        backdropFilter: "blur(10px)", // Effet de flou
        boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)", // Ombre douce
        borderRadius: "20px", // Coins arrondis (optionnel)
        cursor: "crosshair", // Curseur en croix
      }}
    />
  );
}

export default App;
