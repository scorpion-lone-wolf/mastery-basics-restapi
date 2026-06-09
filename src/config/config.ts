import "dotenv/config";
const _config = {
  port: process.env.PORT,
  monogoConnString: process.env.MONGO_CONNECTION_STRING,
};

export const config = Object.freeze(_config);
