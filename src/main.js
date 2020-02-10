import dotenv from 'dotenv'
import App from "./App.svelte"

dotenv.config();
const app = new App({
  target: document.body,
});

export default app
