"use client";

import Link from "next/link";
import sidebarMetadata from "./sidebarMetadata.json";

type SideBarTreeNode = {
  label: string;
  href?: string;
  children: Record<string, SideBarTreeNode>;
};

const sidebarTreeData: Record<string, SideBarTreeNode> = {};

for (const item of sidebarMetadata) {
  const slugParts = item.slug.split("/");
  const lastSlugPart = slugParts[slugParts.length - 1];
  const parentSlugParts = slugParts.slice(0, slugParts.length - 1);

  // Create the parent nodes, if needed
  let currentNode = sidebarTreeData;
  for (const parentSlugPart of parentSlugParts) {
    if (!currentNode[parentSlugPart]) {
      currentNode[parentSlugPart] = {
        label: parentSlugPart,
        children: {},
      };
    }
    currentNode = currentNode[parentSlugPart].children;
  }

  const node: SideBarTreeNode = {
    label: item.sidebarLabel,
    href: `/api/${item.slug}`,
    children: {},
  };

  currentNode[lastSlugPart] = node;

  for (const tag of item.tags) {
    for (const operation of tag.operations) {
      const displayName = `${operation.method.toUpperCase()} ${operation.path}`;
      node.children[displayName] = {
        label: displayName,
        href: `/api/${item.slug}#${operation.elementId}`,
        children: {},
      };
    }
  }
}

function List({
  items,
  level = 0,
}: {
  items: Record<string, SideBarTreeNode>;
  level?: number;
}) {
  return (
    <ul style={{ paddingLeft: `${level}rem` }}>
      {Object.entries(items).map(([key, value]) => (
        <li key={key}>
          {value.href ? (
            <Link href={value.href}>{value.label}</Link>
          ) : (
            value.label
          )}
          {value.children && <List items={value.children} level={level + 1} />}
        </li>
      ))}
    </ul>
  );
}

export function Sidebar() {
  return (
    <div>
      <List items={sidebarTreeData} />
    </div>
  );
}
