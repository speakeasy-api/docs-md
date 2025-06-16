import {
  SandpackCodeEditor,
  SandpackConsole,
  SandpackLayout,
  SandpackPreview,
  SandpackProvider,
  useErrorMessage,
} from "@codesandbox/sandpack-react";
import { useAtomValue } from "jotai";

import { CodeEditor } from "./CodeEditor/index.tsx";
import { dependenciesAtom, lastEditorValueAtom } from "./state/index.ts";
import { styles } from "./styles.ts";

type DependencyName = string;
type DependencyVersion = string;
type Dependencies = Record<DependencyName, DependencyVersion>;

type TryItNowProps = {
  /**
   * These are dependencies that are required by the code snippet,
   * like "zod" or an npm package.
   */
  externalDependencies?: Dependencies;
  /**
   * Starting value of the editor
   */
  defaultValue?: string;
  /**
   * Experimental: When enabled, the editor will automatically
   * scan for external dependencies from npm as the user adds them
   * as imports.
   */
  _enableUnsafeAutoImport?: boolean;
};

const TryItNowContents = ({
  _enableUnsafeAutoImport,
}: {
  _enableUnsafeAutoImport?: boolean;
}) => {
  const error = useErrorMessage();
  return (
    <SandpackLayout>
      {_enableUnsafeAutoImport ? <CodeEditor /> : <SandpackCodeEditor />}
      {!error && (
        <SandpackConsole
          resetOnPreviewRestart
          showSetupProgress
          showRestartButton
        />
      )}
      <SandpackPreview style={error ? undefined : styles.preview}>
        {error ? <pre>{error}</pre> : null}
      </SandpackPreview>
    </SandpackLayout>
  );
};

export const TryItNow = ({
  externalDependencies,
  defaultValue = "",
  _enableUnsafeAutoImport,
}: TryItNowProps) => {
  const autoImportDependencies = useAtomValue(dependenciesAtom);
  const previousCodeAtomValue = useAtomValue(lastEditorValueAtom);

  return (
    <div style={{ ...styles.container }}>
      <SandpackProvider
        options={{
          autoReload: false,
          autorun: false,
          activeFile: "index.ts",
        }}
        template="vanilla-ts"
        files={{
          "index.ts": {
            code:
              _enableUnsafeAutoImport && previousCodeAtomValue
                ? previousCodeAtomValue
                : defaultValue,
            active: true,
          },
        }}
        customSetup={{
          dependencies:
            autoImportDependencies && _enableUnsafeAutoImport
              ? { ...autoImportDependencies, ...externalDependencies }
              : externalDependencies,
          entry: "index.ts",
        }}
        theme="dark"
      >
        <TryItNowContents />
      </SandpackProvider>
    </div>
  );
};
