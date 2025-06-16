import ReactGA from "react-ga4";

const GA_MEASUREMENT_ID = "G-D9B2GHXN3N";

export const initGA = () => {
  ReactGA.initialize(GA_MEASUREMENT_ID);
};

export const trackPageView = (path) => {
  ReactGA.send({ hitType: "pageview", page: path });
};
