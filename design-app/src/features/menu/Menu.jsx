import styles from "./Menu.module.css";
import { Box, Grid, Button } from "@mui/material";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { selectTool } from "../sidebar/sideBarSlice";
import { selectTextColor, updateTextColor } from "./menuSlice";

export function Menu() {
  const currentTool = useAppSelector(selectTool);
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
    </Box>
  );
}
