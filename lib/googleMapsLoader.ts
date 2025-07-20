import { Loader } from "@googlemaps/js-api-loader";

const loader = new Loader({
  apiKey: "AIzaSyBnVFVQHJJrkGI_6lrWpjbEWMNeEhvwwhE",
  libraries: ["places"],
  version: "weekly",
});

export default loader;
