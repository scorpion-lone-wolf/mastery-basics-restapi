import app from "./app.ts";
import { config } from "./config/config.ts";
import connectToDB from "./config/db.ts";

async function startServer() {
  await connectToDB();
  const PORT = config.port || 3000;

  app.listen(PORT, () => {
    console.log(`listening on port:${PORT}`);
  });
}
startServer();
