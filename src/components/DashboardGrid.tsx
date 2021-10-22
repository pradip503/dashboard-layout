import { makeStyles } from "@material-ui/core";
import { Paper, Box, Grid } from "@material-ui/core";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import ErrorIcon from "@mui/icons-material/Error";
import React, { useEffect, useState } from "react";
import Loading from "./Loading";
import apis from "../constants/apis.json";

const useStyles = makeStyles(() => ({
	firstBlock: {
		fontSize: "2rem"
	},
	box: {
		padding: "2rem",
		flexGrow: 1,
	},
	container: {
		padding: "3rem",
		color: "#eee",
	},
	titleContainer: {
		height: "10rem",
		padding: "3rem",
		fontSize: "1.4rem",
		color: "white"
	},
	services: {
		fontSize: "3rem",
		color: "#eee",
	},
	statusContainer: {
		position: "relative",
	},
	endpoints: {
		padding: "1rem",
		color: "#111",
	},
	endpointUrls: {
		fontSize: "2rem",
		textAlign: "left",
	},
	white: {
		fontSize: "2rem",
		color: "#eee",
	},
	iconContainer: {
		position: "absolute",
		top: "-1rem",
		left: "2rem",
		padding: ".5rem",
	},
}));

export default function DashboardGrid() {
	const [results, setResults] = useState([] as any);
	const endPoints = (arr: Array<any>) => {
		const arrayResponse = arr.map(async (response, i) => {
			return {
				url: apis.map((api, i) => {
					if (api.id === i + 1) {
						return api.name;
					}
					return "";
				}),
				status: response.status === 200 ? "UP" : "DOWN",
			};
		});
		return Promise.all(arrayResponse);
	};
	useEffect(() => {
		async function fetchAPIResponse(apis: Array<any>) {
			try {
				const apiResponses = apis.map((api) => {
					return fetch(api.url, { method: "GET" });
				});
				const apiResponseFulfilled = await Promise.all(apiResponses);
				const response = await endPoints(apiResponseFulfilled);
				setResults([...response]);
			} catch (error) {
				console.log(error.message || "Problem while making api call!");
			}
		}
		fetchAPIResponse(apis);
	}, []);
	const classes = useStyles();
	let DashUp: Array<any> = [];
	DashUp.push({
		title: "Running Services",
		value: results.filter((upStatus: any) => upStatus.status === "UP").length,
	});
	let DashDown: Array<any> = [];
	DashDown.push({
		title: "Down Services",
		value: results.filter((upStatus: any) => upStatus.status === "DOWN").length,
	});

	const firstBlock = () => {
		if (DashDown[0].value === 0) {
			return (
				<>
					<Paper className={classes.iconContainer}>
						<CheckCircleIcon color={"success"} sx={{ fontSize: "3rem" }} />
					</Paper>
					<Paper
						className={classes.titleContainer}
						style={{
							background: "#66bb6a",
						}}>
						<span className={classes.firstBlock}>All Up and Running</span>
					</Paper>
				</>
			);
		} else if (DashUp[0].value === 0) {
			return (
				<>
					<Paper className={classes.iconContainer}>
						<CancelIcon color={"error"} sx={{ fontSize: "3rem" }} />
					</Paper>
					<Paper
						className={classes.titleContainer}
						style={{
							background: "#ef5350",
						}}>
						<span className={classes.firstBlock}>All Down</span>
					</Paper>
				</>
			);
		} else {
			return (
				<>
					<Paper className={classes.iconContainer}>
						<ErrorIcon color={"warning"} sx={{ fontSize: "3rem" }} />
					</Paper>
					<Paper
						className={classes.titleContainer}
						style={{
							background: "#ecb857",
						}}>
						<span className={classes.firstBlock}>Partially Up</span>
					</Paper>
				</>
			);
		}
	};
	if (results.length !== 0) {
		return (
			<Box className={classes.box}>
				<Grid container spacing={4} className={classes.box}>
					{/* Top Status Bar, */}
					<Grid item xs={12} md={4} className={classes.statusContainer}>
						{firstBlock()}
					</Grid>

					{/* Up Grid */}
					<Grid
						item
						xs={12}
						md={4}
						className={classes.statusContainer}
						>
						<Paper className={classes.iconContainer}>
							
								<CheckCircleIcon
									color={"success"}
									sx={{ fontSize: "3rem" }}
								/>
							
						</Paper>
						<Paper
							className={classes.titleContainer}
							style={{
								background: "#66bb6a",
								textAlign: "right",
							}}>
							<span>{DashUp[0].title}</span>
							<br />
							<span className={classes.services}>
								{DashUp[0].value}
							</span>
						</Paper>
					</Grid>

					{/* Down grid */}
					<Grid
						item
						xs={12}
						md={4}
						className={classes.statusContainer}
					>
						<Paper className={classes.iconContainer}>

							<CancelIcon
								color={"error"}
								sx={{ fontSize: "3rem" }}
							/>

						</Paper>
						<Paper
							className={classes.titleContainer}
							style={{
								background: "#ef5350",
								textAlign: "right",
							}}>
							<span>{DashDown[0].title}</span>
							<br />
							<span className={classes.services}>
								{DashDown[0].value}
							</span>
						</Paper>
					</Grid>
				</Grid>
				<Grid container spacing={3} className={classes.box}>
					{results.map((result: any, i: any) => (
						<>
							<Grid item xs={10} md={4}>
								<Paper className={classes.endpoints} elevation={0}>
									<pre className={classes.endpointUrls}>{result.url[i]}</pre>
								</Paper>
							</Grid>
							<Grid item xs={2} md={2}>
								<Paper
									className={classes.endpoints}
									elevation={0}
									style={{
										background: `${result.status === "UP" ? "#66bb6a" : "#ef5350"
											}`,
									}}>
									<span className={classes.white}>{result.status}</span>
								</Paper>
							</Grid>
						</>
					))}
				</Grid>
			</Box>
		);
	} else {
		return (
			<div
				style={{
					display: "flex",
					justifyContent: "center",
					minHeight: "100vh",
					width: "100%",
				}}>
				<Loading />
			</div>
		);
	}
}
