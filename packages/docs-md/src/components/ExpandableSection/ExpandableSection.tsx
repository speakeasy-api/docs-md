// Nextra requires us to jump through some hoops to use client components in MDX
// files. This is because MDX files cannot import files marked with "use
// client", for some reason, but it's perfectly happy to import a server
// component (this file) that then imports a client component. But also, we
// can't pass function components as props to the client component from the
// server component, so we create a wrapper client component that only exists to
// pass function components to the real component.

import { useState } from "react";

import { ConnectingCell } from "./ConnectingCell.tsx";
import { ContentCell } from "./ContentCell.tsx";
import { ExpandableCell } from "./ExpandableCell.tsx";
import type { ExpandableSectionProps } from "./ExpandableSectionContents.tsx";

export function ExpandableSection(_: ExpandableSectionProps) {
  const [isItemOneOpen, setIsItemOneOpen] = useState(false);
  const [isItemTwoOpen, setIsItemTwoOpen] = useState(false);
  const [isItemTwoTwoExpanded, setIsItemTwoTwoExpanded] = useState(false);
  const [isItemThreeOpen, setIsItemThreeOpen] = useState(false);
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <ConnectingCell
          bottom="connected"
          top="highlighted"
          left="none"
          right="highlighted"
        />
        <ExpandableCell
          bottom="none"
          left="highlighted"
          isOpen={isItemOneOpen}
          setIsOpen={setIsItemOneOpen}
        />
        <ContentCell isOpen={isItemOneOpen}>
          <div slot="title">Item one</div>
          <div slot="content">Description</div>
        </ContentCell>
      </div>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <ConnectingCell
          bottom="connected"
          top="connected"
          left="none"
          right="connected"
        />
        <ExpandableCell
          bottom={isItemTwoOpen ? "connected" : "none"}
          left="connected"
          isOpen={isItemTwoOpen}
          setIsOpen={setIsItemTwoOpen}
        />
        <ContentCell isOpen={isItemTwoOpen}>
          <div slot="title">Item two</div>
          <div slot="content">Description</div>
        </ContentCell>
      </div>
      {isItemTwoOpen && (
        <div style={{ display: "flex", flexDirection: "row" }}>
          <ConnectingCell
            bottom="connected"
            top="connected"
            left="none"
            right="none"
          />
          <ConnectingCell
            bottom="none"
            top="connected"
            left="none"
            right="connected"
          />
          <ExpandableCell
            bottom="none"
            left="connected"
            isOpen={isItemTwoTwoExpanded}
            setIsOpen={setIsItemTwoTwoExpanded}
          />
          <ContentCell isOpen={isItemTwoTwoExpanded}>
            <div slot="title">Item two</div>
            <div slot="content">Description</div>
          </ContentCell>
        </div>
      )}
      <div style={{ display: "flex", flexDirection: "row" }}>
        <ConnectingCell
          bottom="none"
          top="connected"
          left="none"
          right="connected"
        />
        <ExpandableCell
          bottom="none"
          left="connected"
          isOpen={isItemThreeOpen}
          setIsOpen={setIsItemThreeOpen}
        />
        <ContentCell isOpen={isItemThreeOpen}>
          <div slot="title">Item three</div>
          <div slot="content">Description</div>
        </ContentCell>
      </div>
    </div>
  );
}
