import styles from "./Menu.module.css";
import { Box, Grid, Button } from "@mui/material";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { selectTool } from "../sidebar/sideBarSlice";
import {
  selectTextColor,
  updateTextColor,
  selectImageSrc,
  updateImageSrc,
} from "./menuSlice";
import image1 from "../../images/staples.png";
import image2 from "../../images/image2.png";

export function Menu() {
  const currentTool = useAppSelector(selectTool);
  const imageSrc = useAppSelector(selectImageSrc);
  const color = useAppSelector(selectTextColor);
  const dispatch = useAppDispatch();
  return (
    <Box sx={{ flexGrow: 1 }} className={styles.Menu}>
      {currentTool === "text" ? (
        <Grid className={styles.Icon}>
          <Button className={styles.ActionButton} variant="outlined">
            <label style={{ marginRight: "10px" }}>Color</label>
            <input
              type="color"
              value={color}
              onChange={(e) => {
                dispatch(updateTextColor(e.target.value));
              }}
            />
          </Button>
        </Grid>
      ) : null}
      {currentTool === "image" ? (
        <Grid className={styles.Icon}>
          <Button
            className={styles.ActionButton}
            variant={imageSrc === "image1" ? "contained" : "outlined"}
            onClick={(e) => {
              dispatch(updateImageSrc("image1"));
            }}
          >
            <img
              src={image1}
              alt=""
              id="img"
              style={{ maxWidth: "80px", maxHeight: "70px" }}
            />
          </Button>
          <Button
            className={styles.ActionButton}
            variant={imageSrc === "image2" ? "contained" : "outlined"}
            onClick={(e) => {
              dispatch(updateImageSrc("image2"));
            }}
          >
            <img
              src={image2}
              alt=""
              id="img"
              style={{ maxWidth: "80px", maxHeight: "70px" }}
            />
          </Button>
        </Grid>
      ) : null}
    </Box>
  );
}
