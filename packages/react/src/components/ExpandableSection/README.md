# Expandable Section Concepts

The expandable family of components are pretty complex, so this README exists to
document them. The expandable family of components renders a schema. It presents
schemas in a tree view, although does not have to asthetically resemble a tree.

## Top-level components

Every expandable section always exactly one top-level component:
`ExpandableSection`. This component manages a few things:

- Rendering the tree topper, which is visual decoration that occurs before the
  first part of tree data
- Computing tree data from children into a state-management friendly version.
  - See `useTreeData`
- Managing open-closed state of tree nodes
- Scrolling to the hash of a tree node on page load and when the hash changes

Inside of this component is each node of the tree. In practice, each node is
rendered as a flat, non-nested row of components, with each row being one of:

- `ExpandableBreakout`: a breakout row represents a named entity. These named
  entities are typically the name of an object from the spec (aka an OpenAPI
  component ref). They consist of an expand icon and the name
- `ExpandableProperty`: a property row represents a property in an object.
  Properties are similar to breakouts, except that they also include:
  - Annotations: annotations are additional information about the property, such
    whether or not the property is required, if it's deprecated, constraints on
    the property (such as max length), etc.
  - Type information: if the type information for the property can fit inline in
    the row, then we show it directly. Otherwise we show a very short descriptor
    of the type, and then show the full signature inside the row front matter
    (which can be collapsed). Type information is responsive.

When a row is collapsed, we only show a single line of information, as described
above. When a row is expanded, we render front matter and children for the node,
if they exist. In the case where neither exist, we call this a non-collapsible
node.

## Parts of a row

The inline information of a row contains the following components displayed in a
row in the following order:

- `ConnectingCells`: There can be zero to many of these connecting cells, and
  directly represent levels of nesting, as well as relationships between rows
- `ExpandableCell` or `NonExpandableCell`: There is always exactly one of these
  cells. They include the expandable icon if the row is expandable, and
  otherwise display a placeholder
- Cell contents: The contents of the cell
  - For breakouts, this is a heading (with a hash) with the name of the breakout
  - For properties, this is the property name, annotations, and type signature

Inline information is wrapped in an internal component called `BreakoutContents`
or `PropertyContents`, depending on the type of the row. All components before
the cell contents are rendered inside of another internal component called
`PrefixCells`.

### Row front matter components

Each row component includes several subcomponents used to render front matter:

- `ExpandablePropertyTitle`: the title of the property
- `ExpandablePropertyDescription`: the description of the property
- `ExpandablePropertyExamples`: the examples of the property
- `ExpandablePropertyDefaultValue`: the default value of the property

Breakout cells have their own versions of the above.

## Example component tree

- `ExpandableSection`
  - `ExpandableBreakout`
    - `BreakoutContents`
      - `PrefixCells`
        - `ConnectingCell`
        - `ExpandableCell`
      - `BreakoutCell`
        - `BreakoutTitle`
        - `BreakoutDescription`
        - `BreakoutExamples`
        - `BreakoutDefaultValue`
  - `ExpandableProperty`
    - `PropertyContents`
      - `PrefixCells`
        - `ConnectingCell`
        - `ExpandableCell`
      - `PropertyCell`
        - `PropertyTitle`
        - `PropertyDescription`
        - `PropertyExamples`
        - `PropertyDefaultValue`
  - `ExpandableProperty`
    - `PropertyContents`
      - `PrefixCells`
        - `ConnectingCell`
        - `ExpandableCell`
      - `PropertyCell`
        - `PropertyTitle`
        - `PropertyDescription`
        - `PropertyExamples`
        - `PropertyDefaultValue`
  - `ExpandableProperty`
    - `PropertyContents`
      - `PrefixCells`
        - `ConnectingCell`
        - `ExpandableCell`
      - `PropertyCell`
        - `PropertyTitle`
        - `PropertyDescription`
        - `PropertyExamples`
        - `PropertyDefaultValue`
  - `ExpandableProperty`
    - `PropertyContents`
      - `PrefixCells`
        - `ConnectingCell`
        - `ExpandableCell`
      - `PropertyCell`
        - `PropertyTitle`
        - `PropertyDescription`
        - `PropertyExamples`
        - `PropertyDefaultValue`
  - `ExpandableBreakout`
  - `ExpandableProperty`

Note how each property and breakout is rendered in a flat list, _regardless_ of
levels of nesting! The nesting aesthetics is implemented fully by `PrefixCells`.

## Anchor Highlight and Scroll Padding

- When navigating to or clicking an in-page hash for a row title, the target row
  opens (if applicable) and the title is briefly highlighted. Highlighting runs
  even if the hash does not change.
- If the target title is already within the viewport (with a buffer), the page
  does not scroll; otherwise, it scrolls smoothly with headroom provided via
  `scroll-margin-top` on the title elements.
- The highlight color is controlled by the CSS variable
  `--speakeasy-highlight-color`. Define this in your site’s CSS to theme it. If
  not provided, a sensible default color is used.

Example override:

```
:root {
  --speakeasy-highlight-color: rgba(255, 235, 59, 0.6);
}
```
