import fs from 'fs';
import path from 'path';
import dotEnv from 'dotenv';
import dotEnvExpand from 'dotenv-expand';

const NODE_ENV = process.env.NODE_ENV;

const dotEnvFiles = [
  path.resolve('..', `.env.${NODE_ENV}.local`),
  // Don't include `.env.local` for `test` environment
  // since normally you expect tests to produce the same
  // results for everyone
  NODE_ENV !== 'test' && path.resolve('..', '.env.local'),
  path.resolve('..', `.env.${NODE_ENV}`),
  path.resolve('..', '.env'),
].filter(Boolean) as string[];

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
