import { useEffect, useState } from 'react';

const re = /require\(['"](?<dependency>[\S_-]+)['"]/g;

/**
 * Detects dependencies from transpiled code that external such as npm packages.
 * @param transpiledCode 
 * @returns 
 */
export function useTranspileDependencyMatches(transpiledCode: string) {
  const [dependencies, setDependencies] = useState<Record<
    string,
    string
  > | null>(null);
  // use match for require

  useEffect(() => {
    const dependencies = transpiledCode.matchAll(re);
    const dependenciesArray = Array.from(dependencies).reduce(
      (prev, match) => {
        const dependency = match.groups?.dependency;
        // filter out local dependencies
        if (dependency?.startsWith('./') || dependency?.startsWith('../')) {
          return prev;
        }
    
        if (dependency) {
          prev[dependency] = 'latest';
        }
        return prev;
      },
      {} as Record<string, string>
    );
    setDependencies(dependenciesArray || null);
  }, [transpiledCode]);

  return dependencies;
}
