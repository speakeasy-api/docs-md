export type TabbedSectionProps = {
  title: string;
  id?: string;
  children: React.ReactElement<{ title: string; tooltip?: string }>[];
};
