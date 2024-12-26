import express from "express";
import { login } from "../Controllers/Auth.js";
import { updatechaneldata, getallchanels } from "../Controllers/channel.js";
import { upgradePlan } from "../Controllers/Subscription.js"; // Import the new controller

const routes = express.Router();

routes.post('/login', login);
routes.patch('/update/:id', updatechaneldata);
routes.get('/getallchannel', getallchanels);

// Add a new route for upgrading the plan
routes.post('/upgrade', upgradePlan);

export default routes;
