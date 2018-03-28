const express = require("express");
const bodyParser = require("body-parser");
const request = require("superagent");
const localtunnel = require("localtunnel");

const hue = require("node-hue-api");
const HueApi = hue.HueApi;
const lightState = hue.lightState;

const displayResult = function (result) {
  console.log(JSON.stringify(result, null, 2));
};

const greenHueColor = 30000;

const host = "192.168.102.22";
const username = "KL3373i5toa0QQaoi273VOotxTGLCHmtGYbgGQpx";
const api = new HueApi(host, username);
const normalState = lightState
  .create()
  .on()
  .hue(10000)
  .bri(10);

const successState = lightState
  .create()
  .on()
  .shortAlert()
  .hue(30000)
  .bri(230);

const failureState = lightState
  .create()
  .on()
  .shortAlert()
  .hue(70000)
  .bri(230);

const app = express();

const subdomain = process.env.SUBDOMAIN;

app.set("port", process.env.PORT || 8000);

app.use(bodyParser.json());

app.get("/success", (req, res) => {
  api
    .setLightState(1, successState)
    .then(() => {
      return new Promise(resolve => setTimeout(() => resolve(), 10000));
    })
    .then(() => {
      return api.setLightState(1, normalState);
    })
    .then(() => res.send("OK"));
});

app.get("/failure", (req, res) => {
  api
    .setLightState(1, failureState)
    .then(() => {
      return new Promise(resolve => setTimeout(() => resolve(), 10000));
    })
    .then(() => {
      return api.setLightState(1, normalState);
    })
    .then(() => res.send("OK"));
});

app.listen(app.get("port"), function () {
  console.log("Node app is running on port", app.get("port"));
});
