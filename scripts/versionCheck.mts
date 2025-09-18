import { getPackagesDetails } from "./util.mts";

// Make sure all versions are the same
const {
  shared: { version: sharedVersion, dependencies: sharedDependencies },
  react: { version: reactVersion, dependencies: reactDependencies },
  compiler: { version: compilerVersion, dependencies: compilerDependencies },
} = getPackagesDetails();

if (sharedVersion !== reactVersion || sharedVersion !== compilerVersion) {
  throw new Error(
    `Versions do not match: shared=${sharedVersion}, react=${reactVersion}, compiler=${compilerVersion}`
  );
}

function checkedDependendy(
  dependencyName: string,
  dependencies: Record<string, string>,
  version: string
) {
  if (
    dependencies[dependencyName] &&
    dependencies[dependencyName] !== version
  ) {
    throw new Error(
      `Dependency version of ${dependencyName} does not match: expected ${version}, got ${dependencies[dependencyName]}`
    );
  }
}

checkedDependendy(
  "@speakeasy-api/docs-md-shared",
  reactDependencies,
  sharedVersion
);
checkedDependendy(
  "@speakeasy-api/docs-md-shared",
  compilerDependencies,
  sharedVersion
);

checkedDependendy(
  "@speakeasy-api/docs-md-react",
  compilerDependencies,
  reactVersion
);
checkedDependendy(
  "@speakeasy-api/docs-md-react",
  sharedDependencies,
  reactVersion
);

checkedDependendy("@speakeasy-api/docs-md", reactDependencies, compilerVersion);
checkedDependendy(
  "@speakeasy-api/docs-md",
  sharedDependencies,
  compilerVersion
);
