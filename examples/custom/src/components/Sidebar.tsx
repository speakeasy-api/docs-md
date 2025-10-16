"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import styles from "./styles.module.css";
import { ExpandableCellIcon } from "@speakeasy-api/docs-md-react";
import path from "path";

type SidebarMetadataItem = {
  slug: string;
  sidebarLabel: string;
  tags: {
    operations: {
      method: string;
      path: string;
      elementId: string;
    }[];
  }[];
};

type SideBarTreeNode = {
  label: string;
  href?: string;
  children: Record<string, SideBarTreeNode>;
};

function useSidebarMetadata(
  sidebarMetadata: SidebarMetadataItem[],
  pathPrefix = ""
) {
  return useMemo(() => {
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
            label:
              parentSlugPart.slice(0, 1).toUpperCase() +
              parentSlugPart.slice(1),
            children: {},
          };
        }
        currentNode = currentNode[parentSlugPart].children;
      }

      const node: SideBarTreeNode = {
        label: item.sidebarLabel,
        href: `/${pathPrefix !== "" ? `${pathPrefix}/` : ""}api/${item.slug}`,
        children: {},
      };

      currentNode[lastSlugPart] = node;

      for (const tag of item.tags) {
        for (const operation of tag.operations) {
          const displayName = `${operation.method.toUpperCase()} ${operation.path}`;
          node.children[displayName] = {
            label: displayName,
            href: `/${pathPrefix !== "" ? `${pathPrefix}/` : ""}api/${item.slug}#${operation.elementId}`,
            children: {},
          };
        }
      }
    }
    return sidebarTreeData;
  }, [sidebarMetadata, pathPrefix]);
}

function ListEntry({
  value,
  level,
}: {
  value: SideBarTreeNode;
  level: number;
}) {
  const [isOpen, setIsOpen] = useState(level === 0);
  const hasChildren = Object.keys(value.children).length > 0;
  return (
    <li>
      <div
        className={styles.listEntry}
        style={{ paddingLeft: `${level + 1}rem` }}
      >
        <div className={styles.listEntryLabel}>
          {value.href ? (
            <Link href={value.href}>{value.label}</Link>
          ) : (
            value.label
          )}
        </div>
        {hasChildren && (
          <button
            className={styles.listEntryButton}
            onClick={() => setIsOpen(!isOpen)}
          >
            <ExpandableCellIcon
              className={styles.expandableChevron}
              style={{
                transform: isOpen ? "rotate(0deg)" : "rotate(-90deg)",
              }}
            />
          </button>
        )}
      </div>
      {hasChildren && isOpen && (
        <List items={value.children} level={level + 1} />
      )}
    </li>
  );
}

function List({
  items,
  level = 0,
}: {
  items: Record<string, SideBarTreeNode>;
  level?: number;
}) {
  return (
    <ul className={styles.list}>
      {Object.entries(items).map(([key, value]) => (
        <ListEntry key={key} value={value} level={level} />
      ))}
    </ul>
  );
}

export function Sidebar({
  sidebarMetadata,
  pathPrefix,
}: {
  sidebarMetadata: SidebarMetadataItem[];
  pathPrefix?: string;
}) {
  const sidebarTreeData = useSidebarMetadata(sidebarMetadata, pathPrefix);
  return (
    <div>
      <List items={sidebarTreeData} />
    </div>
  );
}
