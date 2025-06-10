import { CodeEditor } from "./components/CodeEditor";
import {
  SandpackLayout,
  SandpackConsole,
  SandpackProvider,
  SandpackPreview,
  SandpackCodeEditor,
  SandpackOptions,
  SandpackSetup,
} from "@codesandbox/sandpack-react";
import { styles } from "./styles";
import { useAtomValue } from "jotai";
import { dependenciesAtom, lastEditorValueAtom } from "./state";
import { Fragment } from "react";

export type DependencyName = string;
export type DependencyVersion = string;
export type Dependencies = Record<DependencyName, DependencyVersion>;

export type TryItNowProps = {
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
   * Props for the container that wraps the editor and console output.
   */
  containerProps?: React.HTMLAttributes<HTMLDivElement>;
  /**
   * Render only the Sandpack provider and components to use in a
   * custom container.
   */
  disableContainer?: boolean;
  sandpackOptions?: SandpackOptions;
  sandpackSetupOptions?: SandpackSetup;
  /**
   * Experimental: When enabled, the editor will automatically
   * scan for external dependencies from npm as the user adds them
   * as imports.
   */
  _enableUnsafeAutoImport?: boolean;
};

export const TryItNow = ({
  externalDependencies,
  defaultValue = "",
  _enableUnsafeAutoImport,
  containerProps,
  disableContainer,
  sandpackOptions = {},
  sandpackSetupOptions = {},
}: TryItNowProps) => {
  const autoImportDependencies = useAtomValue(dependenciesAtom);
  const previousCodeAtomValue = useAtomValue(lastEditorValueAtom);
  const OuterContainer = disableContainer ? Fragment : "div";

  return (
    <OuterContainer
      style={{ ...styles.container, ...containerProps?.style }}
      {...containerProps}
    >
      <SandpackProvider
        options={{
          autoReload: false,
          autorun: false,
          activeFile: "index.tsx",
          ...sandpackOptions,
        }}
        template="vanilla-ts"
        files={{
          "index.tsx": {
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
          entry: "index.tsx",
          ...sandpackSetupOptions,
        }}
        theme="auto"
      >
        <SandpackLayout>
          <SandpackPreview style={styles.preview} />
          {_enableUnsafeAutoImport ? <CodeEditor /> : <SandpackCodeEditor />}
          <SandpackConsole
            resetOnPreviewRestart
            showSetupProgress
            showRestartButton
          />
        </SandpackLayout>
      </SandpackProvider>
    </OuterContainer>
  );
};
