import React from "react";

import { Button } from "../../primitives/docusaurus/Button.tsx";
import { Card } from "../../primitives/docusaurus/Card.tsx";

type SidebarContent = {
  title: string;
  content: React.ReactNode;
};

export function DocusaurusSideBar({
  content,
  closeRequest,
}: {
  content: SidebarContent;
  closeRequest: () => void;
}) {
  return (
    <Card>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          style={{
            fontWeight: "bold",
            // Note: the docs at https://docusaurus.community/knowledge/design/css/variables/ say this variable
            // should be `--ifm-heading-h3-font-size`, but it doesn't exist. It's `--ifm-h3-font-size` instead.
            fontSize: "var(--ifm-h3-font-size)",
          }}
        >
          {content?.title}
        </div>
        <Button onClick={closeRequest}>X</Button>
      </div>
      <hr
        style={{
          height: "1px",
          backgroundColor: "var(--ifm-breadcrumb-color-active)",
        }}
      />
      {content?.content}
    </Card>
  );
}
