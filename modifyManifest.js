import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import process from 'process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const manifestPath = path.join(__dirname, 'dist/manifest.json');
const packagePath = path.join(__dirname, 'package.json'); // path to package.json

// Check for --dev flag
const isDev = process.argv.includes('--dev');

try {
    // Read and parse the package.json file
    const packageData = await fs.readFile(packagePath, 'utf8');
    const packageJson = JSON.parse(packageData);

    // Read and parse the manifest.json file
    const manifestData = await fs.readFile(manifestPath, 'utf8');
    const manifestJson = JSON.parse(manifestData);

    manifestJson.version = packageJson.version; // Set version from package.json

    // Update the manifest.json fields
    const name = 'OwlClock';
    manifestJson.name = name;
    manifestJson.action.title = name;
    if (isDev) {
        manifestJson.name += '-dev';
        manifestJson.version += '-dev';
        manifestJson.description += ' (This is a development version, expect bugs! Release version: https://owlclock.vijexa.dev/manifest.json)';
        manifestJson.action.title += '-dev';
    }
    

    // Write the modified JSON back to the manifest.json file
    await fs.writeFile(manifestPath, JSON.stringify(manifestJson, null, 2), 'utf8');
    console.log('Manifest updated successfully');
} catch (err) {
    console.error('Error:', err);
    process.exit(1);
}
