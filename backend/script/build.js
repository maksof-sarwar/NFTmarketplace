require('esbuild')
	.build({
		logLevel: 'info',
		entryPoints: ['src/index.ts'],
		external: ['@prisma/client', 'ethers', 'async-sema'],
		minify: true,
		format: 'cjs',
		outdir: 'dist',
		bundle: true,
		color: true,
		platform: 'node',
	})
	.catch(() => process.exit(1));
