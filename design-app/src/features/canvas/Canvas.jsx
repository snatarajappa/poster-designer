import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import styles from "./Canvas.module.css";
import { Grid } from "@mui/material";
import image1 from "../../images/staples.png";
import image2 from "../../images/image2.png";
import { useAppSelector } from "../../app/hooks";
import { selectTool } from "../sidebar/sideBarSlice";
import { selectTextColor, selectImageSrc } from "../menu/menuSlice";

export function Canvas() {
  const textColor = useAppSelector(selectTextColor);
  const currentImageSrc = useAppSelector(selectImageSrc);
  const [imageSrc, setImageSrc] = useState(currentImageSrc);
  const canvasRef = useRef();
  // const ctxRef = useRef();
  const textAreaRef = useRef();
  const [action, setAction] = useState("none");
  const currentTool = useAppSelector(selectTool);
  const [tool, setTool] = useState(currentTool);
  const [elements, setElements] = useState([]);
  const [selectedElement, setSelectedElement] = useState(null);

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);

    elements.forEach((element) => {
      if (action === "writing" && selectedElement.idx === element.id) return;
      drawElement(context, element);
    });
  }, [elements, action, selectedElement]);

  useEffect(() => {
    const textArea = textAreaRef.current;
    if (action === "writing") {
      textArea.focus();
      textArea.value = selectedElement.text;
    }
    setTool(currentTool);
    setImageSrc(currentImageSrc);
  }, [action, selectedElement, currentTool, currentImageSrc]);

  const createElement = (idx, x1, y1, x2, y2, type, properties) => {
    switch (type) {
      case "text":
        return { idx, type, x1, y1, x2, y2, text: "", properties: properties };
      case "image":
        return { idx, type, x1, y1, x2, y2, properties: properties };
      default:
        throw new Error(`Type not recognised: ${type}`);
    }
  };

  const drawElement = (context, element) => {
    switch (element.type) {
      case "text":
        context.textBaseline = "top";
        context.font = "24px sans-serif";
        context.fillStyle = element.properties.textColor;
        context.fillText(element.text, element.x1, element.y1);
        break;
      case "image":
        context.drawImage(
          element.properties?.imageSrc === "image1"
            ? document.getElementById("img1")
            : document.getElementById("img2"),
          element.x1,
          element.y1,
          element.x2 - element.x1,
          element.y2 - element.y1
        );
        break;
      default:
        throw new Error(`Type not recognised: ${element.type}`);
    }
  };
  const updateElement = (idx, x1, y1, x2, y2, type, options, properties) => {
    const elementsCopy = [...elements];

    switch (type) {
      case "text":
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        const textWidth = context.measureText(options.text).width;
        const textHeight = 24;
        elementsCopy[idx] = {
          ...createElement(
            idx,
            x1,
            y1,
            x1 + textWidth,
            y1 + textHeight,
            type,
            properties
          ),
          text: options.text,
        };
        break;
      case "image":
        elementsCopy[idx] = createElement(
          idx,
          x1,
          y1,
          x2,
          y2,
          type,
          properties
        );
        break;
      default:
        throw new Error(`Type not recognised: ${type}`);
    }

    setElements(elementsCopy, true);
  };

  const handleKeyDown = (event) => {
    const key = window.event.keyCode;
    if (key === 13) {
      const { idx, x1, y1, type, properties } = selectedElement;
      setAction("none");
      setSelectedElement(null);
      updateElement(
        idx,
        x1,
        y1,
        null,
        null,
        type,
        {
          text: event.target.value,
        },
        properties
      );
    }

    if (key === 18) {
      const { idx } = selectedElement;
      setAction("none");
      setSelectedElement(null);
      const filteredElements = elements.filter((ele) => {
        if (ele.idx !== idx) {
          return ele;
        }
      });
      setElements(filteredElements, true);
    }
  };

  document.onkeydown = handleKeyDown;
  const getElementAtPosition = (x, y, elements) => {
    return elements
      .map((element) => ({
        ...element,
        position: positionWithinElement(x, y, element),
      }))
      .find((element) => element.position !== null);
  };

  const nearPoint = (x, y, x1, y1, name) => {
    return Math.abs(x - x1) < 5 && Math.abs(y - y1) < 5 ? name : null;
  };

  const positionWithinElement = (x, y, element) => {
    const { type, x1, x2, y1, y2 } = element;
    switch (type) {
      case "image":
        const topLeft = nearPoint(x, y, x1, y1, "tl");
        const topRight = nearPoint(x, y, x2, y1, "tr");
        const bottomLeft = nearPoint(x, y, x1, y2, "bl");
        const bottomRight = nearPoint(x, y, x2, y2, "br");
        const inside =
          x >= x1 && x <= x2 && y >= y1 && y <= y2 ? "inside" : null;
        return topLeft || topRight || bottomLeft || bottomRight || inside;
      case "text":
        return x >= x1 && x <= x2 && y >= y1 && y <= y2 ? "inside" : null;
      default:
        throw new Error(`Type not recognised: ${type}`);
    }
  };

  const handleMouseDown = (e) => {
    const { clientX, clientY } = e;
    const bb = canvasRef.current.getBoundingClientRect();
    const x = clientX - bb.left;
    const y = clientY - bb.top;
    if (action === "writing") return;
    if (tool === "selection") {
      //Write selection logic
      const element = getElementAtPosition(x, y, elements);

      if (element) {
        const offsetX = x - element.x1;
        const offsetY = y - element.y1;
        setSelectedElement({ ...element, offsetX, offsetY });
        setElements((prevState) => prevState);
        if (element.position === "inside") {
          setAction("moving");
        } else {
          setAction("resizing");
        }
      }
    } else {
      const idx = elements.length;
      const properties = {
        textColor: textColor,
        imageSrc: imageSrc,
      };
      let width = 0;
      let height = 0;
      if (tool === "image") {
        width = 200;
        height = 100;
      }
      const element = createElement(
        idx,
        x,
        y,
        x + width,
        y + height,
        tool,
        properties
      );
      setElements((prevState) => [...prevState, element]);
      setSelectedElement(element);
      setAction(tool === "text" ? "writing" : "drawing");
    }
  };

  const adjustElementCoordinates = (element) => {
    const { type, x1, y1, x2, y2 } = element;
    if (type === "image") {
      const minX = Math.min(x1, x2);
      const maxX = Math.max(x1, x2);
      const minY = Math.min(y1, y2);
      const maxY = Math.max(y1, y2);
      return { x1: minX, y1: minY, x2: maxX, y2: maxY };
    } else {
      if (x1 < x2 || (x1 === x2 && y1 < y2)) {
        return { x1, y1, x2, y2 };
      } else {
        return { x1: x2, y1: y2, x2: x1, y2: y1 };
      }
    }
  };

  const handleMouseUp = (e) => {
    const { clientX, clientY } = e;
    const bb = canvasRef.current.getBoundingClientRect();
    const x = clientX - bb.left;
    const y = clientY - bb.top;
    if (selectedElement) {
      if (
        selectedElement.type === "text" &&
        x - selectedElement.offsetX === selectedElement.x1 &&
        y - selectedElement.offsetY === selectedElement.y1
      ) {
        setAction("writing");
        return;
      }
      const index = selectedElement.idx;
      const properties = selectedElement.properties;
      const { idx, type } = elements[index];
      if ((action === "drawing" || action === "resizing") && type === "image") {
        const { x1, y1, x2, y2 } = adjustElementCoordinates(elements[index]);
        updateElement(idx, x1, y1, x2, y2, type, {}, properties);
      }
    }

    if (action === "writing") return;

    setAction("none");
    // setSelectedElement(null);
  };
  const cursorForPosition = (position) => {
    switch (position) {
      case "tl":
      case "br":
      case "start":
      case "end":
        return "nwse-resize";
      case "tr":
      case "bl":
        return "nesw-resize";
      default:
        return "move";
    }
  };
  const resizedCoordinates = (clientX, clientY, position, coordinates) => {
    const { x1, y1, x2, y2 } = coordinates;
    switch (position) {
      case "tl":
      case "start":
        return { x1: clientX, y1: clientY, x2, y2 };
      case "tr":
        return { x1, y1: clientY, x2: clientX, y2 };
      case "bl":
        return { x1: clientX, y1, x2, y2: clientY };
      case "br":
      case "end":
        return { x1, y1, x2: clientX, y2: clientY };
      default:
        return null; //should not really get here...
    }
  };

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const bb = canvasRef.current.getBoundingClientRect();
    const x = clientX - bb.left;
    const y = clientY - bb.top;
    if (tool === "selection") {
      const element = getElementAtPosition(x, y, elements);
      e.target.style.cursor = element
        ? cursorForPosition(element.position)
        : "default";
    }

    if (action === "drawing") {
      const index = elements.length - 1;
      const { x1, y1, properties } = elements[index];
      updateElement(index, x1, y1, x, y, tool, {}, properties);
    } else if (action === "moving") {
      const { idx, x1, x2, y1, y2, type, offsetX, offsetY, properties } =
        selectedElement;
      const width = x2 - x1;
      const height = y2 - y1;
      const newX1 = x - offsetX;
      const newY1 = y - offsetY;
      const options = type === "text" ? { text: selectedElement.text } : {};
      updateElement(
        idx,
        newX1,
        newY1,
        newX1 + width,
        newY1 + height,
        type,
        options,
        properties
      );
    } else if (action === "resizing") {
      const { idx, type, position, properties, ...coordinates } =
        selectedElement;
      const { x1, y1, x2, y2 } = resizedCoordinates(
        x,
        y,
        position,
        coordinates
      );
      updateElement(idx, x1, y1, x2, y2, type, {}, properties);
    }
  };

  return (
    <Grid item xs={10} className={styles.area}>
      <div className={styles.image}>
        <img src={image1} alt="" id="img1" />
        <img src={image2} alt="" id="img2" />
      </div>
      {action === "writing" ? (
        <textarea
          ref={textAreaRef}
          onKeyDown={handleKeyDown}
          style={{
            position: "fixed",
            top: selectedElement.y1 + 181,
            left: selectedElement.x1 + 367,
            font: "24px sans-serif",
            margin: 0,
            padding: 0,
            border: 0,
            outline: 0,
            resize: "auto",
            overflow: "hidden",
            whiteSpace: "pre",
            background: "transparent",
            color: textColor,
          }}
        />
      ) : null}
      <canvas
        className={styles.canvas}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        ref={canvasRef}
        width={`900px`}
        height={`600px`}
      />
    </Grid>
  );
}
