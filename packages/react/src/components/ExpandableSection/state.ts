import { createContext, useContext } from "react";

import { InternalError } from "../../util/internalError";

type OpenStateContextType = {
  // TODO: storing this at the root of the context means we re-render the entire
  // tree when it changes. If performance becomes an issue, we should consider
  // distributing open state via, I dunno maybe a Jotai atom family?
  openNodes: Set<string>;
  setIsOpen: (id: string, isOpen: boolean) => void;
};

export const OpenStateContext = createContext<OpenStateContextType | null>(
  null
);

export function useIsOpen(id: string) {
  const context = useContext(OpenStateContext);
  if (context === null) {
    throw new InternalError("OpenStateContext is not initialized");
  }
  return [
    context.openNodes.has(id),
    (isOpen: boolean) => context.setIsOpen(id, isOpen),
  ] as const;
}

// Graveyarding this code temporarily. It needs to be rewritten, but will be
// done in a follow-up PR

// export function useOpenNodeByHash() {
//   const context = useContext(TreeDataContext);
//   if (context === null) {
//     throw new InternalError("TreeData context is not initialized");
//   }

//   // We need a stable callback, but with an up to date context, so we stick it
//   // in a ref and reference it indirectly
//   const contextRef = useRef(context);
//   contextRef.current = context;
//   return useCallback((hash: string) => {
//     const context = contextRef.current;
//     // Since we call setState indirectly from this function, we have to defer
//     // calling setState until the next tick. Otherwise we'll get a "cannot set
//     // state during render" error.
//     setTimeout(() => {
//       const nodeId = context.data.headingIdToIdMap.get(hash);
//       if (!nodeId) {
//         // If we don't have a node ID, then this hash corresponds with a heading
//         // outside of the expandable section. We do nothing in this case.
//         return;
//       }

//       // If we're already open, we don't need to do anything so we bail early.
//       // This is especially important because we don't want to scroll to this
//       // element if it's already open and disrupt someone's reading flow.
//       if (isOpen(context, nodeId)) {
//         return;
//       }

//       let node = context.data.nodeMap.get(nodeId);
//       if (!node) {
//         throw new InternalError(
//           `Node with id ${nodeId} not found in tree data`
//         );
//       }

//       while (node) {
//         context.setIsOpen(node.id, true);
//         node = node.parent;
//       }

//       // Scroll to the element, after giving React a chance to re-render
//       setTimeout(() => {
//         const element = document.getElementById(hash);
//         if (element) {
//           element.scrollIntoView({ behavior: "smooth" });
//         }
//         // TODO: we should base this on React's rendering state, not a timeout
//       }, 250);
//     });
//   }, []);
// }

// export function useAreAllParentsOpen(id: string) {
//   const context = useContext(TreeDataContext);
//   if (context === null) {
//     throw new InternalError("TreeData context is not initialized");
//   }

//   const node = context.data.nodeMap.get(id);
//   if (!node) {
//     throw new InternalError(`Node with id ${id} not found in tree data`);
//   }

//   let currentParent = node.parent;

//   // Root nodes are always open
//   if (!currentParent) {
//     return true;
//   }

//   while (currentParent) {
//     if (!context.openNodes.has(currentParent.id)) {
//       return false;
//     }
//     currentParent = currentParent.parent;
//   }

//   return true;
// }
