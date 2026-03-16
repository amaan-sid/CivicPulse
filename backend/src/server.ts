import { db } from "./config/db";
import { app } from "./app";

const PORT = process.env.BACKEND_PORT || 4000;

db()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error: Error) => {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  });
