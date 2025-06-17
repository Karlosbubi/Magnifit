/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
	// Handle tiktoken and WASM modules properly
	webpack: (config, { isServer }) => {
		// Handle tiktoken on server side
		if (isServer) {
			config.externals = config.externals || [];
			config.externals.push('tiktoken');
		}

		return config;
	},
	// Updated config option
	serverExternalPackages: ["tiktoken"],
	// Enable standalone output for Docker
	output: 'standalone',
};

export default config;
