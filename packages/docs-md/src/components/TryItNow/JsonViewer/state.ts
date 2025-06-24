import { atom } from "jotai";

const expandedGroupsAtom = atom<Map<string, boolean>>(
  new Map([["root", true]])
);

export const setIsExpandedGroupAtom = atom(
  null,
  (get, set, groupName: string, expanded: boolean) => {
    set(
      expandedGroupsAtom,
      new Map(get(expandedGroupsAtom).set(groupName, expanded))
    );
  }
);

export const getIsExpandedGroupAtom = atom((get) => {
  return (groupName: string) => get(expandedGroupsAtom).get(groupName) ?? true;
});
