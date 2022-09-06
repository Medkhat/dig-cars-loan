import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { defineConfig } from 'vite';

function pathResolve(dir) {
  return resolve(__dirname, '.', dir);
}

// https://vitejs.dev/config/
export default defineConfig(userConfig => {
  return {
    resolve: {
      alias: [
        {
          find: /@\//,
          replacement: pathResolve('src') + '/'
        }
      ]
    },
    define: {
      'process.env': '{}'
    },
    esbuild: {
      jsxFactory: 'jsx',
      jsxInject: '/** @jsx jsx */ import { jsx } from "@emotion/react"'
    },
    envPrefix: 'AC',
    sourcemap: userConfig.mode === 'development',
    server: {
      https: false,
      fsServe: {
        root: pathResolve('./')
      }
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            react: ['react', 'react-dom', '@emotion/react', '@emotion/styled'],
            tools: [
              '@hookform/resolvers',
              '@reduxjs/toolkit',
              'browser-image-compression',
              'jwt-decode',
              'konva',
              'lottie-react',
              'moment',
              'qrcode.react',
              'ramda',
              'react-confetti',
              'react-currency-format',
              'react-error-boundary',
              'react-google-recaptcha',
              'react-hook-form',
              'react-konva',
              'react-konva-utils',
              'react-redux',
              'react-router-dom',
              'react-timer-hook',
              'react-use',
              'redux-persist',
              'vite-plugin-eruda',
              'yup'
            ],
            ui_lib: [
              '@headlessui/react',
              '@tailwindcss/aspect-ratio',
              '@tailwindcss/line-clamp',
              'framer-motion',
              'react-div-100vh',
              'react-iframe',
              'react-imask',
              'react-input-mask',
              'react-otp-input',
              'react-select',
              'react-toastify',
              'swiper',
              'tailwindcss-pseudo-selectors'
            ]
          }
        }
      }
    },
    plugins: [
      //eruda(),
      react({
        babel: {
          plugins: [
            'babel-plugin-macros',
            [
              '@emotion/babel-plugin-jsx-pragmatic',
              {
                export: 'jsx',
                import: '__cssprop',
                module: '@emotion/react'
              }
            ],
            ['@babel/plugin-transform-react-jsx', { pragma: '__cssprop' }, 'twin.macro']
          ]
        }
      })
    ]
  };
});
