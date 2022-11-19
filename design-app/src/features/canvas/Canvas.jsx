import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import styles from "./Canvas.module.css";
import { Grid } from "@mui/material";
import image1 from "../../images/staples.png";
import { useAppSelector } from "../../app/hooks";
import { selectTool } from "../sidebar/sideBarSlice";
import { selectTextColor } from "../menu/menuSlice";

export function Canvas() {
  const textColor = useAppSelector(selectTextColor);
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
  }, [action, selectedElement, currentTool]);

  const createElement = (idx, x1, y1, x2, y2, type, properties) => {
    switch (type) {
      case "text":
        return { idx, type, x1, y1, x2, y2, text: "", properties: properties };
      case "image":
        return { idx, type, x1, y1, x2, y2 };
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
          document.getElementById("img"),
          element.x1,
          element.y1,
          200,
          100
        );
        break;
      default:
        throw new Error(`Type not recognised: ${element.type}`);
    }
  };
  const updateElement = (idx, x1, y1, x2, y2, type, options) => {
    const elementsCopy = [...elements];
    switch (type) {
      case "text":
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        const textWidth = context.measureText(options.text).width;
        const textHeight = 24;
        const properties = {
          textColor: textColor,
        };
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
        break;
      default:
        throw new Error(`Type not recognised: ${type}`);
    }

    setElements(elementsCopy, true);
  };

  const handleKeyDown = (event) => {
    const key = window.event.keyCode;
    if (key === 13) {
      const { idx, x1, y1, type } = selectedElement;
      setAction("none");
      setSelectedElement(null);
      updateElement(idx, x1, y1, null, null, type, {
        text: event.target.value,
      });
    }
  };

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

  const distance = (a, b) =>
    Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));

  const onLine = (x1, y1, x2, y2, x, y, maxDistance = 1) => {
    const a = { x: x1, y: y1 };
    const b = { x: x2, y: y2 };
    const c = { x, y };
    const offset = distance(a, b) - (distance(a, c) + distance(b, c));
    return Math.abs(offset) < maxDistance ? "inside" : null;
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
    if (action === "writing") return;
    if (tool === "selection") {
      //Write selection logic
      const element = getElementAtPosition(clientX, clientY, elements);

      if (element) {
        const offsetX = clientX - element.x1;
        const offsetY = clientY - element.y1;
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
      const bb = canvasRef.current.getBoundingClientRect();
      const x = clientX - bb.left;
      const y = clientY - bb.top;
      const properties = {
        textColor: textColor,
      };
      const element = createElement(idx, x, y, x, y, tool, properties);
      setElements((prevState) => [...prevState, element]);
      setSelectedElement(element);
      setAction(tool === "text" ? "writing" : "drawing");
    }
  };

  const adjustElementCoordinates = (element) => {
    const { type, x1, y1, x2, y2 } = element;
    if (type === "rectangle") {
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
    if (selectedElement) {
      if (
        selectedElement.type === "text" &&
        clientX - selectedElement.offsetX === selectedElement.x1 &&
        clientY - selectedElement.offsetY === selectedElement.y1
      ) {
        setAction("writing");
        return;
      }
      const index = selectedElement.idx;
      const { idx, type } = elements[index];
      if ((action === "drawing" || action === "resizing") && type === "image") {
        const { x1, y1, x2, y2 } = adjustElementCoordinates(elements[index]);
        updateElement(idx, x1, y1, x2, y2, type);
      }
    }

    if (action === "writing") return;

    setAction("none");
    setSelectedElement(null);
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

    if (tool === "selection") {
      const element = getElementAtPosition(clientX, clientY, elements);
      e.target.style.cursor = element
        ? cursorForPosition(element.position)
        : "default";
    }

    if (action === "drawing") {
      const index = elements.length - 1;
      const { x1, y1 } = elements[index];
      updateElement(index, x1, y1, clientX, clientY, tool);
    } else if (action === "moving") {
      const { idx, x1, x2, y1, y2, type, offsetX, offsetY } = selectedElement;
      const width = x2 - x1;
      const height = y2 - y1;
      const newX1 = clientX - offsetX;
      const newY1 = clientY - offsetY;
      const options = type === "text" ? { text: selectedElement.text } : {};
      updateElement(
        idx,
        newX1,
        newY1,
        newX1 + width,
        newY1 + height,
        type,
        options
      );
    } else if (action === "resizing") {
      const { id, type, position, ...coordinates } = selectedElement;
      const { x1, y1, x2, y2 } = resizedCoordinates(
        clientX,
        clientY,
        position,
        coordinates
      );
      updateElement(id, x1, y1, x2, y2, type);
    }
  };

  return (
    <Grid item xs={10} className={styles.area}>
      <div className={styles.image}>
        <img src={image1} alt="" id="img" />
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
