import React, { useState } from "react";
import "./App.css";
import { Canvas } from "./features/canvas/Canvas";
import { Box, Grid } from "@mui/material";
import { Menu } from "./features/menu/Menu";
import { SideBar } from "./features/sidebar/SideBar";

function App() {
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
          <Menu />
          <Grid className="canvas-div">
            <Canvas />
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}

export default App;
