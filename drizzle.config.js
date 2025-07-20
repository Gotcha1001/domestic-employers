// /** @type {import("drizzle-kit").Config} */
// export default {
//   schema: "./configs/schema.js",
//   dialect: "postgresql",

//   //NEW ONE
//   dbCredentials: {
//     url: "postgresql://neondb_owner:npg_LuYPn3h2sCgN@ep-orange-moon-a8s9p3n0-pooler.eastus2.azure.neon.tech/neondb?sslmode=require&channel_binding=require",
//   },
// };

/** @type {import("drizzle-kit").Config} */
const config = {
  schema: "./configs/schema.ts",
  dialect: "postgresql",

  //NEW ONE
  dbCredentials: {
    url: "postgresql://neondb_owner:npg_LuYPn3h2sCgN@ep-orange-moon-a8s9p3n0-pooler.eastus2.azure.neon.tech/neondb?sslmode=require&channel_binding=require",
  },
};

export default config;
