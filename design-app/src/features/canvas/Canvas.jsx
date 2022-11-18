import React, { useState, useEffect, useRef } from "react";
import styles from "./Canvas.module.css";
import { Grid } from "@mui/material";
import image1 from "../../images/staples.jpeg";

export function Canvas() {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [image, setImage] = useState("");
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
  const startAction = (e) => {
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    setIsDrawing(true);
  };

  // Function for ending the drawing
  const endAction = () => {
    ctxRef.current.closePath();
    setIsDrawing(false);
  };

  const draw = (e) => {
    if (!isDrawing) {
      return;
    }
    // ctxRef.current.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    // ctxRef.current.stroke();
    let rect = canvasRef.current.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;
    ctxRef.current.drawImage(document.getElementById("img"), x, y, 100, 100);
  };
  return (
    <Grid item xs={10} className={styles.area}>
      <div className={styles.image}>
        <img src={image1} alt="" id="img" />
      </div>
      <canvas
        className={styles.canvas}
        onMouseDown={startAction}
        onMouseUp={endAction}
        onMouseMove={draw}
        ref={canvasRef}
        width={`900px`}
        height={`600px`}
      />
    </Grid>
  );
}
