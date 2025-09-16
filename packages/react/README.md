# DocsMD React Components

This repository contains React components used with Speakeasy's Docs product. We
provide these components under an open source license, and are provided as a
reference for customers that wish to implement custom components.

## Component Philosophy

A core philosophy of DocsMD is that any meaningful content should _always_ be
rendered inside of MDX, not as properties to a component. This way, search
indexers and the like can index the content properly, and any styling that a
site may provide for markdown will be applied. These behaviors usually don't
happen when content is not present as markdown.

This presents some unique constraints when designing components. Notably, we
can't do this:

```md
<MyCustomHeading title="My Heading" />
```

In this case, anything the markdown parser does to stylize headings, such as
adding a copy-link icon, will ignore this heading. That means we _must_ instead
write this as:

```md
<MyCustomHeading>

### My Heading

</MyCustomHeading>
```

So if you're wondering why our components don't follow standard React component
conventions, this is why. Most notably, we see this pattern with slots,
described below.

### Slots

Many DocsMD components take in a heterogenous set of children that need to be
"assembled" into a specific structure. For example, the TabbedSection component
takes in a set of children that are one of:

- A single [`SectionTitle`](src/components/SectionTitle/SectionTitle.tsx)
  component that contains the title, aka the "Responses" heading, with
  `slot="title"`
- A set of [`SectionTab`](src/components/SectionTab/SectionTab.tsx) components
  that contains the contents of each tab, aka the status code, with `slot="tab"`
- A set of [`SectionContent`](src/components/SectionContent/SectionContent.tsx)
  components that contains the contents of each section, aka the response body,
  with `slot="section"`

Each section tab is correlated with a section component by way of "id".
Admittedly we're abusing the concept of an `id` here, and for historical reasons
the _actual_ id on a DOM nodes comes from the `headingId` property (we have a
task to fix that some day).

To support sorting of this "grab bag" of children, we borrow a concept from web
components: slots. Each child is assigned a "slot" that is used to determine its
position in the final output.

There are two hooks that are used to get components assigned to slots:

- [`useUniqueChild`](src/util/hooks.ts): gets exactly one child with the given
  slot, and errors if there are no children with that slot or if there are
  multiple children with that slot.
- [`useChildren`](src/util/hooks.ts): gets all children with the given slot,
  returned as an array

It's a little convoluted, and slightly hacky in the React world, but has proven
powerful so far.

### Internal vs External Components

Components are informally divided into two categories:

- External components: These components are directly referenced by compiled MDX
  code.
- Internal components: These components are used by other components in the
  library, and not directly referenced in compiled MDX code.

Both types of components are designed such that they can be overridden. To
support overriding internal components, any other component that references
internal components takes a prop with a component implementation, that defaults
to the internal component implementation.

For example, the
[`ExpandableCell`](src/components/ExpandableCell/ExpandableCell.tsx) component
takes an
[`ExpandableCellIcon`](src/components/ExpandableCell/types.ts)
prop that defaults to the
[`ExpandableCellIcon`](src/components/ExpandableCellIcon/ExpandableCellIcon.tsx)
component. If you wish to provide a custom icon, you can pass in a custom
component to this prop.

Most components are external components, a few are internal components, and
[`Pill`](src/components/Pill/Pill.tsx) is used both internally and externally.

### Component-Specific Documentation

See the source code for each component in the [src/components](src/components)
directory for documentation each component. Property types are always defined
in a file called `types.ts`, and includes documentation for each property.
