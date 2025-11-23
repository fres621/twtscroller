import { resolve } from 'path';
import { defineConfig, rolldown } from 'rolldown';
import alias from '@rollup/plugin-alias';
import { writeFile } from 'fs/promises';

const bundle = await rolldown({
    input: 'src/index.tsx',
    external: ['react', 'react/jsx-runtime', 'react-dom'],
    transform: {
        jsx: {
            runtime: "classic"
        }
    },
    plugins: [
        alias({
            entries: [
                { find: /^@(.*)/, replacement: resolve("src", "$1") },
            ]
        })
    ],
});

await bundle.write({
    file: 'dist/bundle.js',
});

let js = await bundle.generate({
    format: "iife",
    minify: true,
});
await writeFile("dist/bookmarklet.js", "javascript:" + js.output[0].code.replace(/%/g, '%25'));
