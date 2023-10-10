import { defineConfig, type UserConfig } from 'vite';
import { resolve } from 'path';
import react from '@vitejs/plugin-react';
import yargsParser from 'yargs-parser';

const buildArgv = yargsParser(process.env.BUILD_ARGV_STR || '');
const isPublishEnv = buildArgv['def_publish_env'] === 'prod'; //是否线上环境
const cdnHost = isPublishEnv ? 'g.alicdn.com' : 'dev.g.alicdn.com';
const version = buildArgv['def_publish_version'];

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  const config: UserConfig = {
    server: {
      fs: {
        // Allow serving files from one level up to the project root
        allow: ['../..'],
      },
    },
    resolve: {
      alias: {
        web: resolve(__dirname, '../../web'),
      },
    },
    plugins: [react()],
  };
  if (command === 'build') {
    config.base = `https://${cdnHost}/thor-server/cheat_detection_wasm/${version}/`;
  }
  return config;
});
