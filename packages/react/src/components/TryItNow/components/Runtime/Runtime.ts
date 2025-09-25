type RuntimeLanguage = "typescript" | "python";

type RuntimeLanguageOptions = {
  code: string;
  dependencies: Record<string, string>;
  output: string;
  error: string;
  status: "pending" | "running" | "success" | "error";
  onCompile: (code: string) => void;
  onRun: () => void;
};
type RuntimeOptions = Partial<Record<RuntimeLanguage, RuntimeLanguageOptions>>;
export function Runtime(options: RuntimeOptions) {
  const { typescript } = options;
  if (typescript) {
    typescript.onCompile = (code: string) => {
      console.log(code);
    };
    typescript.onRun = () => {
      console.log("run");
    };
  }
}
