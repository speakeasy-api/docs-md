// Import ambient declarations to make them available to consumers of this package
import "./types/ambient.ts";

// Components directly referenced by Markdown
export type { PillProps } from "./components/pill/pill.ts";

// Import web component files to initialize them
import "./components/pill/pill.ts";
import "./components/expandable/internal/expandableCell/component.ts";
import "./components/expandable/internal/expandableCellIcon/component.ts";
import "./components/expandable/internal/connectingCell/component.ts";
import "./components/expandable/internal/nonExpandableCell/component.ts";
import "./components/expandable/internal/treeTopper/component.ts";
import "./components/expandable/expandableBreakout/component.ts";
import "./components/expandable/expandableProperty/component.ts";

// TODO: these components are only referenced by other components. We're
// temporarily exporting them while we're in the process of migrating React to
// Web Components. Once the migration is complete, we should remove them.
export type { ConnectingCellProps } from "./components/expandable/internal/connectingCell/component.ts";
export type { ExpandableCellIconProps } from "./components/expandable/internal/expandableCellIcon/component.ts";
export type { ExpandableCellProps } from "./components/expandable/internal/expandableCell/component.ts";
export type { NonExpandableCellProps } from "./components/expandable/internal/nonExpandableCell/component.ts";
export type { TreeTopperProps } from "./components/expandable/internal/treeTopper/component.ts";
export type { ExpandableBreakoutProps } from "./components/expandable/expandableBreakout/component.ts";
export type { ExpandablePropertyProps } from "./components/expandable/expandableProperty/component.ts";
