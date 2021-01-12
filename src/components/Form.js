import React, { useContext, useState } from "react";
import ReactCompareImage from "react-compare-image";
import { upscalePhoto } from "../services/upscale";
import { DarkModeContext } from "../context/DarkModeContext";
import { makeStyles } from "@material-ui/core/styles";
import toBase64 from "../helper/toBase64";
import LoadingScreen from "./LoadingScreen";
import {
    Grid,
    Paper,
    Box,
    Slider,
    Button,
    Fab,
    Typography,
} from "@material-ui/core";
import Brightness4Icon from "@material-ui/icons/Brightness4";

const useStyles = makeStyles((theme) => ({
    container: {
        height: "100vh",
        padding: "2rem",
    },
    item: {
        height: "8rem",
    },
    // box: {
    //     padding: "2rem",
    //     "& .MuiTextField-root": {
    //         margin: theme.spacing(1),
    //     },
    // },
}));

export default function Form() {
    const classes = useStyles();
    const { setDarkState } = useContext(DarkModeContext);

    const [image, setImage] = useState("");
    const [scale, setScale] = useState(4);

    const [upscaled, setUpscaled] = useState("");
    const [loading, setLoading] = useState(false);

    function handleChange(event) {
        let promise = toBase64(event.target.files[0]);
        promise
            .then((result) => {
                setImage(result);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    function handleSubmit(e) {
        e.preventDefault();
        setLoading(!loading);
        upscalePhoto(image, scale).then((result) => {
            setUpscaled(result.data.upscaled);
            setLoading(false);
        });
    }

    return (
        <>
            {image && upscaled ? (
                <Box
                    component={Paper}
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    style={{
                        marginTop: "4rem",
                        marginLeft: "7rem",
                        position: "fixed",
                        width: "40%",
                        padding: "0.5rem",
                    }}
                >
                    <ReactCompareImage
                        leftImage={image}
                        leftImageLabel="Sebelum"
                        rightImage={upscaled}
                        rightImageLabel="Sesudah"
                    />
                </Box>
            ) : (
                <></>
            )}
            <Fab
                color="secondary"
                aria-label="add"
                style={{ position: "fixed", bottom: "40px", left: "40px" }}
                onClick={setDarkState}
            >
                <Brightness4Icon />
            </Fab>
            <LoadingScreen loading={loading} />
            <Grid container alignItems="center" className={classes.container}>
                <Grid item md={1}></Grid>
                <Grid item md={5}>
                    <Typography
                        variant="h2"
                        color="secondary"
                        style={{
                            fontFamily: "plane-crash",
                            textShadow: "2px 2px #ff000",
                        }}
                    >
                        gede-keun
                    </Typography>
                    <Typography variant="subtitle1" color="secondary">
                        Menggunakan metode Deep Convolutional Neural Networks
                        terbaru. Secara cerdas mengurangi noise dan gerigi pada
                        gambar tanpa kehilangan kualitas.
                    </Typography>
                </Grid>
                <Grid item md={1}></Grid>
                <Grid item component={Paper} md={4} className={classes.item}>
                    <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        style={{
                            width: "100%",
                            height: "100%",
                        }}
                    >
                        <form onSubmit={handleSubmit}>
                            {!image ? (
                                <label htmlFor="upload-photo">
                                    <input
                                        style={{ display: "none" }}
                                        id="upload-photo"
                                        name="upload-photo"
                                        type="file"
                                        onChange={handleChange}
                                        disabled={image ? true : false}
                                    />

                                    <Button
                                        color="secondary"
                                        variant="contained"
                                        component="span"
                                        disabled={image ? true : false}
                                        style={{ width: "20rem" }}
                                    >
                                        Upload Gambar
                                    </Button>
                                </label>
                            ) : (
                                <>
                                    <Typography id="discrete-slider">
                                        Penaikan Skala
                                    </Typography>
                                    <Slider
                                        color="secondary"
                                        defaultValue={3}
                                        valueLabelDisplay="auto"
                                        step={1}
                                        marks
                                        min={1}
                                        max={4}
                                        value={scale}
                                        onChange={(event, value) => {
                                            setScale(value);
                                        }}
                                        fullWidth
                                    />
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        type="submit"
                                        style={{ width: "20rem" }}
                                        disabled={upscaled}
                                    >
                                        Upscale
                                    </Button>
                                </>
                            )}
                        </form>
                    </Box>
                </Grid>
                <Grid item md={1}></Grid>
            </Grid>
        </>
    );
}
