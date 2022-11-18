import { Button, Grid, Box } from "@mui/material";
import styles from "./SideBar.module.css";
import PostAddRoundedIcon from "@mui/icons-material/PostAddRounded";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import GestureIcon from "@mui/icons-material/Gesture";
import HighlightAltIcon from "@mui/icons-material/HighlightAlt";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import { useState } from "react";

export function SideBar() {
  const [action, setAction] = useState("text");
  return (
    <Box sx={{ flexGrow: 1 }} className={styles.SideBar}>
      <Grid className={styles.Icon}></Grid>
      {/* <Grid className={styles.Icon}></Grid> */}
      <Grid className={styles.Icon}>
        <Button
          variant={action === "draw" ? "contained" : "outlined"}
          startIcon={<GestureIcon />}
          className={styles.ActionButton}
          onClick={() => {
            setAction("draw");
          }}
        >
          Draw
        </Button>
      </Grid>
      <Grid className={styles.Icon}>
        <Button
          variant={action === "text" ? "contained" : "outlined"}
          startIcon={<PostAddRoundedIcon />}
          className={styles.ActionButton}
          onClick={() => {
            setAction("text");
          }}
        >
          Text
        </Button>
      </Grid>
      <Grid className={styles.Icon}>
        <Button
          variant={action === "photos" ? "contained" : "outlined"}
          startIcon={<AddPhotoAlternateIcon />}
          className={styles.ActionButton}
          onClick={() => {
            setAction("photos");
          }}
        >
          Photos
        </Button>
      </Grid>
      <Grid className={styles.Icon}>
        <Button
          variant={action === "shape" ? "contained" : "outlined"}
          startIcon={<AddCircleOutlineRoundedIcon />}
          className={styles.ActionButton}
          onClick={() => {
            setAction("shape");
          }}
        >
          Shape
        </Button>
      </Grid>
      <Grid className={styles.Icon}>
        <Button
          variant={action === "select" ? "contained" : "outlined"}
          startIcon={<HighlightAltIcon />}
          className={styles.ActionButton}
          onClick={() => {
            setAction("select");
          }}
        >
          Select
        </Button>
      </Grid>
      <Grid className={styles.Icon}>
        <Button
          variant={action === "delete" ? "contained" : "outlined"}
          startIcon={<DeleteRoundedIcon />}
          className={styles.ActionButton}
          onClick={() => {
            setAction("delete");
          }}
        >
          Delete
        </Button>
      </Grid>
    </Box>
  );
}
