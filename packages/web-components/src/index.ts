import "./types/ambient.ts";

// Components directly referenced by Markdown
export { Pill, type PillProps } from "./components/pill/pill.ts";

// TDODO: these components only referenced by other components. We export them
// while we're in the process of migrating React to Web Components. Once the
// migration is complete, we should remove them.
// TODO: we need a new way to include these in ambient declarations too, since
// we currently crawl this file to generate the ambient declarations.
export {
  ConnectingCell,
  type ConnectingCellProps,
} from "./components/expandable/connectingCell/connectingCell.ts";
export {
  ExpandableCellIcon,
  type ExpandableCellIconProps,
} from "./components/expandable/expandableCellIcon/expandableCellIcon.ts";
export {
  ExpandableCell,
  type ExpandableCellProps,
} from "./components/expandable/expandableCell/expandableCell.ts";
