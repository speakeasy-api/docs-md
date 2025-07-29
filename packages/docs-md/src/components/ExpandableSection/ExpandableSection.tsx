// Nextra requires us to jump through some hoops to use client components in MDX
// files. This is because MDX files cannot import files marked with "use
// client", for some reason, but it's perfectly happy to import a server
// component (this file) that then imports a client component.

import type { ExpandableSectionProps } from "./components/ExpandableSectionContents.tsx";
import { ExpandableSectionContents } from "./components/ExpandableSectionContents.tsx";
import { ExpandableEntry } from "./ExpandableEntry.tsx";

export function ExpandableSection(_: ExpandableSectionProps) {
  return (
    <ExpandableSectionContents>
      <ExpandableEntry id="one" slot="entry">
        <div slot="title">Item one</div>
        <div slot="content">Description</div>
      </ExpandableEntry>
      <ExpandableEntry id="two" parentId="one" slot="entry">
        <div slot="title">Item two</div>
        <div slot="content">Description</div>
      </ExpandableEntry>
      <ExpandableEntry id="four" parentId="two" slot="entry">
        <div slot="title">Item four</div>
        <div slot="content">Description</div>
      </ExpandableEntry>
      <ExpandableEntry id="five" parentId="four" slot="entry">
        <div slot="title">Item five</div>
        <div slot="content">Description</div>
      </ExpandableEntry>
      <ExpandableEntry id="three" parentId="one" slot="entry">
        <div slot="title">Item three</div>
        <div slot="content">Description</div>
      </ExpandableEntry>
      <ExpandableEntry id="six" slot="entry">
        <div slot="title">Item six</div>
        <div slot="content">Description</div>
      </ExpandableEntry>
      <ExpandableEntry id="seven" parentId="six" slot="entry">
        <div slot="title">Item seven</div>
        <div slot="content">Description</div>
      </ExpandableEntry>
      <ExpandableEntry id="eight" parentId="six" slot="entry">
        <div slot="title">Item eight</div>
        <div slot="content">Description</div>
      </ExpandableEntry>
    </ExpandableSectionContents>
  );
}
