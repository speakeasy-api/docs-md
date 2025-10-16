import { lazy, Suspense } from "react";

// This import needs to have a literal value so bundlers can statically
// analyze this component. This is why we don't use a generic component that
// takes in a 'src' property, or anything like that.
const Contents = lazy(() => import("../contents/owner.mdx"));

export default function() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Contents />
    </Suspense>
  );
}
