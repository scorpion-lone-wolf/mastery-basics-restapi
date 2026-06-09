import app from "./app.ts";

function startServer() {
  const PORT = process.env.PORT || 3010;
  app.listen(PORT, () => {
    console.log(`listening on port:${PORT}`);
  });
}
startServer();
