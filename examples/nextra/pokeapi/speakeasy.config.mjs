export default {
  spec: "../../specs/pokeapi.yml",
  output: {
    pageOutDir: "./src/app/api",
    componentOutDir: "./src/components/speakeasy",
    framework: "nextra",
  },
  tryItNow: {
    npmPackageName: "speakeasy-api",
    sdkClassName: "Speakeasy",
  },
};
