
#!/bin/bash

# We disable no-missing-import because we have a root level index file that
# indirectly imports all components anyways
#
# We disable no-incompatible-property-type because we pass functions as
# attributes to the lit elements. This doesn't work if someone were to render
# these components directly in HTML, but we don't support or need this use case
# anyways. As such, we can ignore it.
#
# This list needs to be kept in sync with the tsconfig.json file
lit-analyzer --strict\
  --rules.no-unknown-tag-name error\
  --rules.no-unknown-event error\
  --rules.no-unknown-slot error\
  --rules.no-unknown-attribute error\
  --rules.no-missing-import off\
  --rules.no-incompatible-property-type off\
  "src/**/*.{js,ts}"