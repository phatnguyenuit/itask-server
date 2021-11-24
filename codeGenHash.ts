/**
 * IMPORTANT NOTE
 * typescript-json-validator can not work well on Windows. (use Linux/macOS instead)
 * Related issue: https://github.com/ForbesLindesay/typescript-json-validator/issues/36
 *
 * Workaround:
 *  - Open WSL (Windows Subsystem for Linux) having nodejs installed
 *  - Run this file normally
 */
import { hashElement, HashElementNode } from 'folder-hash';
import { exec } from 'child_process';
import fs from 'fs';

const FOLDER_PATH = 'src/datasources';
const HASH_FILE = 'dataSourceHash.json';
const FILE_PATTERN = /\.types\.ts/;

const writeNewHash = (hash: string): void => {
  fs.writeFile(HASH_FILE, hash, (error) => {
    if (error) {
      return console.error(error);
    }

    console.log(`\n✅ Wrote updated file hashes to ${FOLDER_PATH}\n`);
  });
};

const executeJSONValidatorForPath = (filePath: string) =>
  new Promise((resolve, reject) => {
    const command = `cross-env typescript-json-validator --id ${filePath} --collection ${filePath}`;

    exec(command, (error, stdout, stderr) => {
      if (stdout) console.log(stdout);
      if (stderr) console.error(stderr);

      if (error) {
        console.log('❌ Failed to generate new validations for', filePath);

        reject(error);
      } else {
        console.log('✅ Generated new validations for', filePath);
        resolve(null);
      }
    });
  });

const executeJSONValidator = (filePaths: string[]) => {
  console.log('\nRunning JSON Validator...\n');

  return Promise.all(filePaths.map(executeJSONValidatorForPath));
};

type FileHash = {
  filePath: string;
  hash: string;
};

const collectFileHashes = (
  hashedFile: HashElementNode,
  hashedFileNameWithPath: string,
): FileHash[] => {
  const result: FileHash[] = [];

  (hashedFile.children || []).forEach((child) => {
    const childFileNameWithPath = `${hashedFileNameWithPath}/${child.name}`;

    if (FILE_PATTERN.test(child.name)) {
      result.push({
        filePath: childFileNameWithPath,
        hash: child.hash,
      });
    }

    result.push(...collectFileHashes(child, childFileNameWithPath));
  }, []);

  return result;
};

const findChangedFilePaths = (
  newFileHashes: FileHash[],
  oldFileHashes: FileHash[],
): string[] => {
  const result: string[] = [];

  newFileHashes.forEach((newFileHash) => {
    const matchingOldFile = oldFileHashes.find(
      (oldFileHash) => oldFileHash.filePath === newFileHash.filePath,
    );

    if (!matchingOldFile) {
      console.log('ℹ New file', newFileHash.filePath);
      result.push(newFileHash.filePath);
    } else if (newFileHash.hash !== matchingOldFile.hash) {
      console.log('ℹ File has changed', newFileHash.filePath);
      result.push(newFileHash.filePath);
    }
  });

  return result;
};

const generateOrSkipJSONValidator = async (): Promise<void> => {
  try {
    const hash = await hashElement(FOLDER_PATH);

    const newFileHashes = collectFileHashes(hash, FOLDER_PATH);

    let filePathsToGenerate: string[] = [];

    if (!fs.existsSync(HASH_FILE)) {
      console.log('ℹ Hash file does not exist, codegen-ing everything');
      filePathsToGenerate = newFileHashes.map((fileHash) => fileHash.filePath);
    } else {
      try {
        const oldFileHashesJson = fs.readFileSync(HASH_FILE).toString();
        const oldFileHashes = JSON.parse(oldFileHashesJson) as FileHash[];

        filePathsToGenerate = findChangedFilePaths(
          newFileHashes,
          oldFileHashes,
        );
      } catch {
        console.log(
          'ℹ Error occurred when parsing old hash files, codegen-ing everything',
        );
        filePathsToGenerate = newFileHashes.map(
          (fileHash) => fileHash.filePath,
        );
      }
    }

    if (filePathsToGenerate.length === 0) {
      console.log('ℹ No files have changed, skipping validator codegen');
    } else {
      await executeJSONValidator(filePathsToGenerate);
      writeNewHash(JSON.stringify(newFileHashes, null, 2));
    }
  } catch (error) {
    console.error('hashing failed', error);
  }
};

generateOrSkipJSONValidator();
