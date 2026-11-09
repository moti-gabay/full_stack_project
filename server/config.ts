
process.loadEnvFile();


export const config = {
    port: process.env.PORT,
    jwt_secret:process.env.JWT_SECRET,
    mongo_uri:process.env.MONGODB_URI
}