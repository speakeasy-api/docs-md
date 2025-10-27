import { css } from "lit";

export const styles = css`
  .entryContainer {
    display: flex;
    flex-direction: column;
  }

  .entryHeaderContainer {
    display: flex;
    flex-direction: row;
    gap: 8px;
  }

  .breakoutCellTitle {
    height: calc(2 * var(--speakeasy-expandable-cell-size));
    display: flex;
    align-items: center;
  }

  .breakoutCellTitle h1,
  .breakoutCellTitle h2,
  .breakoutCellTitle h3,
  .breakoutCellTitle h4,
  .breakoutCellTitle h5,
  .breakoutCellTitle h6 {
    /* Provide headroom when scrolled into view */
    scroll-margin-top: 5rem;
  }
`;
