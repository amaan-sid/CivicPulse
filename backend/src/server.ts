import { db } from "./config/db";
import { app } from "./app";

const PORT = process.env.BACKEND_PORT || 4000;

// Database Connection
db();

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});