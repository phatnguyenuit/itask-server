import fs from 'fs';
import path from 'path';
import dotEnv from 'dotenv';
import dotEnvExpand from 'dotenv-expand';

import logger from 'utils/logger';

const NODE_ENV = process.env.NODE_ENV;

const getFilePath = (file: string) =>
  path.resolve(String(process.env.PWD), file);

const dotEnvFiles = [
  getFilePath(`.env.${NODE_ENV}.local`),
  // Don't include `.env.local` for `test` environment
  // since normally you expect tests to produce the same
  // results for everyone
  NODE_ENV !== 'test' && getFilePath('.env.local'),
  getFilePath(`.env.${NODE_ENV}`),
  getFilePath('.env'),
].filter(Boolean) as string[];

logger.log('Loading dotEnvFiles...', dotEnvFiles);

export const loadEnv = () => {
  dotEnvFiles.forEach((dotEnvFile) => {
    if (fs.existsSync(dotEnvFile)) {
      dotEnvExpand(
        dotEnv.config({
          path: dotEnvFile,
        }),
      );
    }
  });
};

export const getEnv = (name: string, defaultValue?: string) => {
  const value = process.env[name] || defaultValue;

  if (!value) {
    throw new Error(`Environment variable named "${name}" is not defined.`);
  }

  return value;
};
