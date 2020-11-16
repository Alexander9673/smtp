import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  Grid,
  TextField,
  Typography,
} from "@material-ui/core";

import { Component } from "react";

class Index extends Component {
  state = {
    email: "",
    password: "",
    loaded: false,
  };

  componentDidMount() {
    this.state.loaded = true;
    this.setState(this.state);
  }

  render() {
    return (
      <Grid
        container
        justify="center"
        style={{
          marginTop: "10%",
          marginBottom: "10%",
        }}
      >
        <Grid item md={3}>
          <Card>
            {this.state.loaded ? (
              <center>
                <CardContent>
                  <Box>
                    <Typography variant="h3">Login</Typography>
                  </Box>
                  <Box
                    style={{
                      marginTop: "16px",
                      maxWidth: "300px",
                    }}
                  >
                    <TextField fullWidth label="Email Address" />
                  </Box>

                  <Box
                    style={{
                      marginTop: "4px",
                      maxWidth: "300px",
                    }}
                  >
                    <TextField fullWidth label="Password" type="password" />
                  </Box>
                </CardContent>
                <CardActions>
                  <Grid
                    container
                    direction="row"
                    justify="space-between"
                    alignItems="center"
                  >
                    <Grid item style={{ marginRight: "10px" }}>
                      <Button color="primary">Create Account</Button>
                    </Grid>
                    <Grid item>
                      <Button
                        color="primary"
                        variant="contained"
                        disableFocusRipple
                        disableElevation
                      >
                        Login
                      </Button>
                    </Grid>
                  </Grid>
                </CardActions>
              </center>
            ) : (
              <Card>
                <CardContent style={{ textAlign: "center" }}>
                  <CircularProgress />
                  <Typography variant="subtitle1">Loading...</Typography>
                </CardContent>
              </Card>
            )}
          </Card>
        </Grid>
      </Grid>
    );
  }
}

export default Index;
