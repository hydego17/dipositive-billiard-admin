const { execSync } = require("child_process")
const fs = require("fs")
const path = require("path")
const readline = require("readline")

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

const packagePath = path.join(__dirname, "..", "package.json")
const package = require(packagePath)

function executeCommand(command) {
  try {
    execSync(command, { stdio: "inherit" })
  } catch (error) {
    console.error(`Failed to execute command: ${command}`)
    process.exit(1)
  }
}

function incrementPatchVersion(version) {
  const parts = version.split(".")
  parts[2] = parseInt(parts[2]) + 1
  return parts.join(".")
}

function updateVersion(version) {
  package.version = version
  fs.writeFileSync(packagePath, JSON.stringify(package, null, 2) + "\n")
}

const currentVersion = package.version
const newVersion = incrementPatchVersion(currentVersion)

console.log(`Current version: ${currentVersion}`)
console.log(`New version: ${newVersion}`)

rl.question(`Confirm publishing version ${newVersion}? (y/n): `, (answer) => {
  if (answer.toLowerCase() === "y") {
    try {
      updateVersion(newVersion)
      console.log(`Updated version to ${newVersion}`)

      executeCommand("git add .")
      executeCommand(`git commit -m "Release v${newVersion}"`)
      executeCommand(`git tag v${newVersion}`)
      executeCommand("git push && git push --tags")

      console.log(`\nSuccessfully published version ${newVersion}!`)
      console.log("GitHub Actions will now build and create a new release.")
      console.log("Check your GitHub repository for the release status.")
    } catch (error) {
      console.error("Failed to publish:", error)
    }
  } else {
    console.log("Publishing cancelled")
  }
  rl.close()
})
