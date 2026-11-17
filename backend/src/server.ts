import { db } from "./config/db";
import { env } from "./config/env";
import { app } from "./app";

db()
  .then(() => {
    app.listen(env.port, () => {
      console.log(`Server running on http://localhost:${env.port}`);
    });
  })
  .catch((error: Error) => {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  });
