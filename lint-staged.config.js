export default {
    'packages/**/.{ts,js,json,md,html,css,scss}': [
        'nx affected --target lint --uncommitted --fix true',
        'nx format:write --uncommitted',
        'nx affected --target test --uncommitted',
    ],
};
