import { execSync } from 'child_process';
import { readdir } from 'fs/promises';
import fs from 'fs';
import path from 'path';

const inPath = '/Volumes/Backup Plus/components/drivers/#Cirenia/3';

async function run() {
    try {
        const files = await readdir(inPath);
        for (const fileName of files) {
            const inFullPath = path.resolve(inPath, fileName);
            const inBasePath = path.resolve(inPath, '..');
            const edgeFolder = inPath.substring(inBasePath);

            const outFullPath = path.resolve(inBasePath, `${edgeFolder} (edit)`, fileName);


            ensureFolderExist(path.resolve(inBasePath, `${edgeFolder} (edit)`));

            console.log({ inFullPath, outFullPath });
            execSync(`vips icc_transform "${inFullPath}" "${outFullPath}" sRGB2014.icc --input-profile=AdobeRGB1998.icc`, (error, stdout, stderr) => {
                if (error) {
                    console.log(`error: ${error.message}`);
                    return;
                }

                if (stderr) {
                    console.log(`stderr: ${stderr}`);
                    return;
                }
                console.log(`stdout: ${stdout}`);
            });
        }
    } catch (err) {
        console.error(err);
    }
}

function ensureFolderExist(dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath);
    }
}

run();