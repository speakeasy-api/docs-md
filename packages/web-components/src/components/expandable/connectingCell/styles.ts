import { css } from "lit";

export const styles = css`
  .connectingCellRow {
    display: flex;
    flex-direction: row;
  }

  .connectingCellContainer {
    display: grid;
    grid-template-columns: auto auto;
    grid-template-rows: auto 1fr;
  }

  .connectingCellContent {
    padding-top: 5px;
    flex: 1;
    min-width: 0; /* Prevent cell content from overflowing */
  }

  .upperLeftConnectingCell {
    min-width: var(--speakeasy-expandable-cell-size);
    height: calc(5px + var(--speakeasy-expandable-cell-size));
    box-sizing: border-box;
  }

  .upperRightConnectingCell {
    min-width: calc(0.5rem + var(--speakeasy-expandable-cell-size));
    height: calc(5px + var(--speakeasy-expandable-cell-size));
    box-sizing: border-box;
  }

  .lowerLeftConnectingCell {
    min-width: var(--speakeasy-expandable-cell-size);
    min-height: var(--speakeasy-expandable-cell-size);
    box-sizing: border-box;
  }

  .lowerRightConnectingCell {
    min-width: calc(0.5rem + var(--speakeasy-expandable-cell-size));
    min-height: var(--speakeasy-expandable-cell-size);
    box-sizing: border-box;
  }

  .verticalConnected {
    border-right: var(--speakeasy-border-width) solid
      var(--speakeasy-expandable-line-color);
  }

  .horizontalConnected {
    border-bottom: var(--speakeasy-border-width) solid
      var(--speakeasy-expandable-line-color);
  }

  .emptyConnectingCell {
    min-width: calc(2 * var(--speakeasy-expandable-cell-size));
  }
`;
