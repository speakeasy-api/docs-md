// We have to do ?raw to get the string version of the CSS file, since we don't
// want Vite to parse it and automagically stick it in a root level style tag.
// Note: we also can't use CSS modules for this same reason
import customStyles from './commandbar.css?inline';

export const ShadowRootStyles = () => {
  return (
    <>
      <style type="text/css">{customStyles}</style>
    </>
  );
};
