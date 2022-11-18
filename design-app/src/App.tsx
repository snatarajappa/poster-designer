import React, { useState } from "react";
import "./App.css";
import { Canvas } from "./features/canvas/Canvas";
import { Box, Grid } from "@mui/material";
import { Menu } from "./features/menu/Menu";
import { SideBar } from "./features/sidebar/SideBar";

function App() {
  const [lineWidth, setLineWidth] = useState(5);
  const [lineColor, setLineColor] = useState("black");
  const [lineOpacity, setLineOpacity] = useState(0.1);
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={0}>
        <Grid item xs={12} className="App-header">
          <h1>Deisgn App</h1>
        </Grid>
      </Grid>
      <Grid container spacing={0}>
        <Grid item xs={1}>
          <SideBar></SideBar>
        </Grid>
        <Grid item xs={11}>
          <Menu
            setLineColor={setLineColor}
            setLineWidth={setLineWidth}
            setLineOpacity={setLineOpacity}
          />
          <Grid className="canvas-div">
            <Canvas />
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}

export default App;
