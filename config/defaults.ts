
 const config =
{
    "mongoURI": "mongodb://localhost:27017/testereee",
    "jwtSecret": "jwtSecretToken", // this is the secret for the jwt
    "jwtExpiration": 360000, // this is the expiration time for the jwt
    "jwtExpirationTest": "3m", // this is the expiration time for the jwt in test mode in minutes
    "RefreshTokenExpirationTest": 5, // this is the expiration time for the refresh token in minutes (test)
    "RefreshTokenExpirationDays": 1,  // this is the expiration time for the refresh token in days
    "RefreshTokenExpirationTestDays": 120,
    "jwtRefreshExpiration": 360000
  }
  
  export default config;