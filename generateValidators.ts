/**
 * IMPORTANT NOTE
 * typescript-json-validator can not work well on Windows. (use Linux/macOS instead)
 * Related issue: https://github.com/ForbesLindesay/typescript-json-validator/issues/36
 *
 * Workaround:
 *  - Open WSL (Windows Subsystem for Linux) having nodejs installed
 *  - Run this file normally
 */
import fs from 'fs';
import { exec } from 'child_process';
import { hashElement, HashElementNode } from 'folder-hash';
import minimatch from 'minimatch';
import path from 'path';

const LOOKUP_FOLDER_PATH = './src';
const HASHED_FILE_PATH = 'generatedHashes.json';
const LOOKUP_FILE_GLOB = '*.types.ts';

const executeJSONValidatorForPath = (filePath: string) =>
  new Promise((resolve, reject) => {
    // --noExtraProps if want to enforce no extra properties
    const command = `typescript-json-validator --id ${filePath} --collection ${filePath} --noExtraProps`;

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

const collectHashFiles = (hash: HashElementNode, rootFolderPath: string) => {
  const result: FileHash[] = [];

  if (!hash.children) return result;

  hash.children.forEach((child) => {
    const childFileNameWithPath = `${rootFolderPath}/${child.name}`;
    const isMatched = minimatch(child.name, LOOKUP_FILE_GLOB, {
      matchBase: true,
    });

    if (isMatched) {
      result.push({
        filePath: childFileNameWithPath,
        hash: child.hash,
      });
    }

    result.push(...collectHashFiles(child, childFileNameWithPath));
  }, []);

  return result;
};

const getChangedFilePaths = (
  newFileHashes: FileHash[],
  existingFileHashes: FileHash[],
): string[] =>
  newFileHashes
    .filter((fileHash) => {
      const existingFileHash = existingFileHashes.find(
        (f) => f.filePath === fileHash.filePath,
      );

      if (!existingFileHash) {
        console.log('ℹ Detected new file', fileHash.filePath);

        return true;
      } else if (fileHash.hash !== existingFileHash.hash) {
        console.log('ℹ File has changed', fileHash.filePath);

        return true;
      }

      return false;
    })
    .map((f) => f.filePath);

const writeNewHash = (fileHashes: FileHash[], hashFilePath: string): void => {
  fs.writeFile(hashFilePath, JSON.stringify(fileHashes, null, 2), (error) => {
    if (error) {
      return console.error(error);
    }

    console.log(
      `✅ Wrote updated file hashes to ${path.resolve(hashFilePath)}`,
    );
  });
};

const generateOrSkipGeneratingValidators = async (
  folderPath: string,
  fileGlob: string,
  hashedFilePath: string,
) => {
  try {
    const hash = await hashElement(folderPath, {
      files: {
        include: [fileGlob],
      },
    });

    const newFileHashes = collectHashFiles(hash, folderPath);
    const isExistedHashFile = fs.existsSync(hashedFilePath);

    let filePathsToGenerate: string[] = newFileHashes.map(
      (fileHash) => fileHash.filePath,
    );

    if (!isExistedHashFile) {
      console.log('ℹ Hash file does not exist, generating everything...');
    } else {
      try {
        const existedHashFileContent = fs
          .readFileSync(hashedFilePath)
          .toString();
        const existedFileHashes = JSON.parse(
          existedHashFileContent,
        ) as FileHash[];

        filePathsToGenerate = getChangedFilePaths(
          newFileHashes,
          existedFileHashes,
        );
      } catch {
        console.log(
          'ℹ Error occurred when parsing old hash files, generating everything...',
        );
      }
    }

    if (filePathsToGenerate.length === 0) {
      console.log('ℹ No files have changed, skipping generating validators');
    } else {
      await executeJSONValidator(filePathsToGenerate);
      writeNewHash(newFileHashes, hashedFilePath);
    }
  } catch (error) {
    console.error('Failed to hash', folderPath);
    console.error(error);
  }
};

generateOrSkipGeneratingValidators(
  LOOKUP_FOLDER_PATH,
  LOOKUP_FILE_GLOB,
  HASHED_FILE_PATH,
);
