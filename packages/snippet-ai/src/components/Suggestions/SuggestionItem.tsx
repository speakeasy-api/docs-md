import type { Ref } from 'react';
import { forwardRef, Fragment, useMemo } from 'react';
import type { ActionId, ActionImpl } from 'kbar';
import clsx from 'clsx';

const SuggestionItem = forwardRef(
  (
    {
      action,
      // active,
      currentRootActionId,
    }: {
      action: ActionImpl;
      active: boolean;
      currentRootActionId: ActionId;
    },
    ref: Ref<HTMLDivElement>
  ) => {
    const ancestors = useMemo(() => {
      if (!currentRootActionId) return action.ancestors;
      const index = action.ancestors.findIndex(
        (ancestor) => ancestor.id === currentRootActionId
      );
      // +1 removes the currentRootAction; e.g.
      // if we are on the "Set theme" parent action,
      // the UI should not display "Set theme… > Dark"
      // but rather just "Dark"
      return action.ancestors.slice(index + 1);
    }, [action.ancestors, currentRootActionId]);

    return (
      <div
        ref={ref}
        className={clsx(
          'flex cursor-pointer items-center justify-between border-l-4 border-solid px-4 py-3 hover:bg-neutral-200 dark:hover:bg-neutral-800',
          // TODO: add this back when we replace kbar with cmd+k and get proper keyboard accessibility
          /*active
            ? 'border-l-neutral-400 dark:border-l-neutral-600'
            :*/ 'border-l-transparent'
        )}
      >
        <div className="flex items-center gap-2 text-sm">
          {action.icon && action.icon}
          <div className="flex flex-col">
            <div>
              {ancestors.length > 0 &&
                ancestors.map((ancestor) => (
                  <Fragment key={ancestor.id}>
                    <span className="mr-2 opacity-50">{ancestor.name}</span>
                    <span className="mr-2">&rsaquo;</span>
                  </Fragment>
                ))}
              <span>{action.name}</span>
            </div>
            {action.subtitle && (
              <span className="text-xs">{action.subtitle}</span>
            )}
          </div>
        </div>
        {action.shortcut?.length ? (
          <div aria-hidden className="grid grid-flow-col gap-1">
            {action.shortcut.map((sc) => (
              <kbd
                key={sc}
                className="rounded-sm bg-neutral-100 px-2 py-1 text-sm dark:bg-neutral-900"
              >
                {sc}
              </kbd>
            ))}
          </div>
        ) : null}
      </div>
    );
  }
);

SuggestionItem.displayName = 'SuggestionItem';

export { SuggestionItem };
