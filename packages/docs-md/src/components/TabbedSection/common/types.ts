export type TabbedSectionProps = {
  title: string;
  id?: string;
  baseHeadingLevel: number;
  children: React.ReactElement<{ title: string; tooltip?: string }>[];
};
