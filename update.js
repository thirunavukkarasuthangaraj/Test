const fs = require('fs');
const os = require('os');
let show = os.cpus()
// Read the package.json file
const packageJson = require('./package.json');


// Extract the current version
const version = packageJson.version;

// Extract the last digit of the version number
const lastDigit = parseInt(version.split('.').pop());

// Increment the last digit by 1
const newLastDigit = lastDigit + 1;

// Update the version in packageJson object
packageJson.version = version.replace(lastDigit, newLastDigit);

// Write the updated package.json back to the file
fs.writeFileSync('./package.json', JSON.stringify(packageJson, null, 2));

console.log(`Successfully updated version from ${version} to ${packageJson.version}///${JSON.stringify(packageJson)}///${show}`);

//JSON.stringify(show)

// const fs = require('fs');
// const path = require('path');

// // Read the package.json file
// const packagePath = path.join(__dirname, 'package.json');
// fs.readFile(packagePath, 'utf8', (err, data) => {
//   if (err) throw err;
//   const packageJson = JSON.parse(data);

//   // Extract the current version and convert it to an array of numbers
//   const currentVersion = packageJson.version;
//   const versionParts = currentVersion.split('.').map(Number);

//   // Increment the minor version by 1
//   versionParts[0] += 1;

//   // Update the version in the package.json file
//   packageJson.version = versionParts.join('.');

//   // Write updated package.json file
//   fs.writeFile(packagePath, JSON.stringify(packageJson, null, 2), 'utf8', (err) => {
//     if (err) throw err;
//     console.log(`Package version updated to ${packageJson.version} successfully.`);
//     console.log(versionParts);
//   });
// });
