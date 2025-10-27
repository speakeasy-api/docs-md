// Import ambient declarations to make them available to consumers of this package
import "./types/ambient.ts";

// Components directly referenced by Markdown
export type { PillProps } from "./components/pill/pill.ts";

// Import web component files to initialize them
import "./components/pill/pill.ts";
import "./components/expandable/expandableCell/expandableCell.ts";
import "./components/expandable/expandableCellIcon/expandableCellIcon.ts";
import "./components/expandable/connectingCell/connectingCell.ts";
import "./components/expandable/nonExpandableCell/nonExpandableCell.ts";
import "./components/expandable/treeTopper/treeTopper.ts";

// TODO: these components are only referenced by other components. We're
// temporarily exporting them while we're in the process of migrating React to
// Web Components. Once the migration is complete, we should remove them.
export type { ConnectingCellProps } from "./components/expandable/connectingCell/connectingCell.ts";
export type { ExpandableCellIconProps } from "./components/expandable/expandableCellIcon/expandableCellIcon.ts";
export type { ExpandableCellProps } from "./components/expandable/expandableCell/expandableCell.ts";
export type { NonExpandableCellProps } from "./components/expandable/nonExpandableCell/nonExpandableCell.ts";
export type { TreeTopperProps } from "./components/expandable/treeTopper/treeTopper.ts";
