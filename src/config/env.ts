import fs from 'fs';
import path from 'path';
import dotEnv from 'dotenv';
import dotEnvExpand from 'dotenv-expand';

// import logger from 'utils/logger';

export const getEnvFiles = () => {
  const NODE_ENV = process.env.NODE_ENV;

  return [
    path.resolve(`.env.${NODE_ENV}.local`),
    // Don't include `.env.local` for `test` environment
    // since normally you expect tests to produce the same
    // results for everyone
    NODE_ENV !== 'test' && path.resolve('.env.local'),
    path.resolve(`.env.${NODE_ENV}`),
    path.resolve('.env'),
  ].filter(Boolean) as string[];
};

export const loadEnv = () => {
  const dotEnvFiles = getEnvFiles();

  // logger.log('Loading dotEnvFiles...', dotEnvFiles);

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
