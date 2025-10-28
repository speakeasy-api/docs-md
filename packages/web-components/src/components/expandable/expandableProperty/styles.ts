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

  .propertyTitleContainer {
    display: flex;
    flex-direction: row;
    align-items: center;
    row-gap: 0.5rem;
    width: 100%;
  }

  .propertyTitleContainer h1,
  .propertyTitleContainer h2,
  .propertyTitleContainer h3,
  .propertyTitleContainer h4,
  .propertyTitleContainer h5,
  .propertyTitleContainer h6 {
    margin: 0;
    padding: 0;
  }

  .propertyTitlePrefixContainer {
    display: inline-flex;
    align-items: center;
    width: fit-content;
    gap: 0.5rem;
    padding-right: 0.5rem;

    /*
   * We set a minimum height for the title container to ensure that the title
   * doesn't jank when switching between inline types and multiline types. We
   * need the title to be taller than the type container so the height of the
   * first row in the flexbox doesn't change on layout shift.
   */
    min-height: 2rem;
  }
`;
