
 const config =
{
    "mongoURI": "mongodb://localhost:27017/testmongodb_typescript_jajamaru",
    "jwtSecret": "jwtSecretToken", // this is the secret for the jwt
    "jwtExpiration": "7d", // this is the expiration time for the jwt
    "jwtExpirationTest": "3m", // this is the expiration time for the jwt in test mode in minutes
    "RefreshTokenExpirationTest": 5, // this is the expiration time for the refresh token in minutes (test)
    "RefreshTokenExpirationDays": 60,  // this is the expiration time for the refresh token in days
    "RefreshTokenExpirationTestDays": 120,
    "jwtRefreshExpiration": 360000,  // this is the expiration time for the refresh token in milliseconds
    "accessCookie" : "access_CoOkie_&_app_name_",
    "refreshCookie" : "refresh_CoOkie_&_app_name_",
  }
  
  export default config;