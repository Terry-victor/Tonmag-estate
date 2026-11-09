// Next 16 vendors an older Baseline mapping snapshot. Set the package's
// supported flag before the Next CLI is imported; the top-level mapping data
// remains updated independently in devDependencies.
process.env.BASELINE_BROWSER_MAPPING_IGNORE_OLD_DATA ??= "true"

await import("next/dist/bin/next")
