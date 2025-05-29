import type { PropsWithChildren } from "react";
import React, { useCallback, useState } from "react";

import Container from "./container.mdx";

// TODO: https://github.com/orgs/mdx-js/discussions/2272 implies there's a more
// elegant way to do this, but I couldn't get it to work after a bit of fiddling
const TypedContainer = Container as React.FC<{ children: React.ReactNode }>;

function SideBarContainer({
  onCloseRequest,
  children,
  title,
}: PropsWithChildren<{ title: string; onCloseRequest: () => void }>) {
  // TODO: also need to listen for keyboard events
  const clickShield = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
  }, []);
  const closeRequest = useCallback(() => {
    onCloseRequest();
  }, []);
  return (
    <TypedContainer>
      <summary
        style={{
          cursor: "default",
          display: "flex",
          justifyContent: "space-between",
        }}
        onClick={clickShield}
      >
        {title}
        <button onClick={closeRequest}>X</button>
      </summary>
      {children}
    </TypedContainer>
  );
}

export function SideBar({
  cta,
  children,
  title,
}: PropsWithChildren<{
  cta: string;
  title: string;
}>) {
  const [show, setShow] = useState(false);
  const onClick = useCallback(() => setShow(true), []);
  const onCloseRequest = useCallback(() => setShow(false), []);
  return (
    <>
      <button onClick={onClick}>{cta}</button>
      {show && (
        <SideBarContainer title={title} onCloseRequest={onCloseRequest}>
          {children}
        </SideBarContainer>
      )}
    </>
  );
}
