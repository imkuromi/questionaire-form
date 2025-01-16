import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import { Typography } from "@mui/material";

export default function Navbar() {
  return (

      <Grid container size={{ sm: 12, md: 12, lg: 12 }} sx={{ backgroundColor: "#FFF"}}>
        <Grid size={{ sm: 12, md: 12, lg: 12 }} sx={{}}>
          <Box
            sx={{
              width: "100%",
              color: "#000",
              padding: "0.5rem",
              borderBottom: 0.5,
              borderColor: "grey.300",
            }}
          >
            <Typography variant="h1" sx={{fontSize:'24px'}}>
            🦊 Foxbith Questionnaire
            </Typography>
          </Box>
        </Grid>
      </Grid>

  );
}
