import { CodeEditor } from './components/CodeEditor';
import {
  SandpackLayout,
  SandpackConsole,
  SandpackProvider,
  SandpackPreview,
  SandpackCodeEditor,
  SandpackOptions,
  SandpackSetup,
} from '@codesandbox/sandpack-react';
import { styles } from './styles';
import { useAtomValue } from 'jotai';
import { dependenciesAtom, lastEditorValueAtom } from './state';
import { Fragment } from 'react';

export type DependencyName = string;
export type DependencyVersion = string;
export type Dependencies = Record<DependencyName, DependencyVersion>;

export type TryItNowProps = {
  externalDependencies?: Dependencies;
  defaultValue?: string;
  _enableUnsafeAutoImport?: boolean;
  wrapperProps?: React.HTMLAttributes<HTMLDivElement>;
  containerProps?: React.HTMLAttributes<HTMLDivElement>;
  container?: React.ReactNode;
  disableContainer?: boolean;
  sandpackOptions?: SandpackOptions;
  setupOptions?: SandpackSetup;
};


export const TryItNow = ({
  externalDependencies,
  defaultValue = '',
  _enableUnsafeAutoImport,
  containerProps,
  disableContainer,
  sandpackOptions = {},
  setupOptions = {}
}: TryItNowProps) => {
  const autoImportDependencies = useAtomValue(dependenciesAtom);
  const previousCodeAtomValue = useAtomValue(lastEditorValueAtom);
  const OuterContainer = disableContainer ? Fragment : 'div';
  
  return (
    <OuterContainer style={{...styles.container, ...containerProps?.style}} {...containerProps}>
      <SandpackProvider
        options={{
          autoReload: false,
          autorun: false,
          activeFile: 'index.tsx',
          ...sandpackOptions
        }}
        template="vanilla-ts"
        files={{
          'index.tsx': {
            code: _enableUnsafeAutoImport && previousCodeAtomValue? previousCodeAtomValue : defaultValue,
            active: true,
          },
        }}
        customSetup={{
          dependencies:
            autoImportDependencies && _enableUnsafeAutoImport
              ? { ...autoImportDependencies, ...externalDependencies }
              : externalDependencies,
          entry: 'index.tsx',
          ...setupOptions
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
