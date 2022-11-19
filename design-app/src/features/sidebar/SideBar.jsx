import { Button, Grid, Box } from "@mui/material";
import styles from "./SideBar.module.css";
import PostAddRoundedIcon from "@mui/icons-material/PostAddRounded";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import HighlightAltIcon from "@mui/icons-material/HighlightAlt";
import { useState } from "react";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { selectTool, updateTool } from "./sideBarSlice";

export function SideBar() {
  const tool = useAppSelector(selectTool);
  const dispatch = useAppDispatch();
  const [currentTool, updateCurrentTool] = useState(tool);
  return (
    <Box sx={{ flexGrow: 1 }} className={styles.SideBar}>
      <Grid className={styles.Icon}></Grid>
      <Grid className={styles.Icon}>
        <Button
          variant={currentTool === "text" ? "contained" : "outlined"}
          startIcon={<PostAddRoundedIcon />}
          className={styles.ActionButton}
          onClick={() => {
            updateCurrentTool("text");
            dispatch(updateTool("text"));
          }}
        >
          Text
        </Button>
      </Grid>
      <Grid className={styles.Icon}>
        <Button
          variant={currentTool === "image" ? "contained" : "outlined"}
          startIcon={<AddPhotoAlternateIcon />}
          className={styles.ActionButton}
          onClick={() => {
            updateCurrentTool("image");
            dispatch(updateTool("image"));
          }}
        >
          Photos
        </Button>
      </Grid>
      <Grid className={styles.Icon}>
        <Button
          variant={currentTool === "selection" ? "contained" : "outlined"}
          startIcon={<HighlightAltIcon />}
          className={styles.ActionButton}
          onClick={() => {
            updateCurrentTool("selection");
            dispatch(updateTool("selection"));
          }}
        >
          Select
        </Button>
      </Grid>
    </Box>
  );
}
