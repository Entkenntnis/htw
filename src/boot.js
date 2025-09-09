// Boot up script
// Check if system is properly configured

// check if secrets.js exists, if not, create is as a copy of screts.placeholder.js
import fs from 'fs'
import path from 'path'
const secretsPath = path.join(process.cwd(), 'secrets.js')
const secretsPlaceholderPath = path.join(
  process.cwd(),
  'secrets.placeholder.js'
)
if (!fs.existsSync(secretsPath)) {
  fs.copyFileSync(secretsPlaceholderPath, secretsPath)
  console.log('Created secrets.js from secrets.placeholder.js')
  console.log('Please edit it with proper values!')
}

// import ./app and run it
import('./app.js')
