import React, { useState, useEffect, useRef } from "react";
import styles from "./Canvas.module.css";
import { Menu } from "../menu/Menu";
import { SideBar } from "../sidebar/SideBar";
import { Box, Grid } from "@mui/material";

export function Canvas() {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lineWidth, setLineWidth] = useState(5);
  const [lineColor, setLineColor] = useState("black");
  const [lineOpacity, setLineOpacity] = useState(0.1);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.globalAlpha = lineOpacity;
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = lineWidth;
    ctxRef.current = ctx;
  }, [lineColor, lineOpacity, lineWidth]);
  // Function for starting the drawing
  const startDrawing = (e) => {
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    setIsDrawing(true);
  };

  // Function for ending the drawing
  const endDrawing = () => {
    ctxRef.current.closePath();
    setIsDrawing(false);
  };

  const draw = (e) => {
    if (!isDrawing) {
      return;
    }
    ctxRef.current.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);

    ctxRef.current.stroke();
  };
  return (
    <Grid item xs={10} className={styles.area}>
      <canvas
        className={styles.canvas}
        onMouseDown={startDrawing}
        onMouseUp={endDrawing}
        onMouseMove={draw}
        ref={canvasRef}
        width={`900px`}
        height={`600px`}
      />
    </Grid>
  );
}
