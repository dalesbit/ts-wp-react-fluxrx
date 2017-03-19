import { Subject } from '@reactivex/rxjs'
//import { Actions } from 'shared/actions'

const _dispatcher = new Subject()

// Hide the subject, so the outer world doesn't abuse it
const dispatcher =
    _dispatcher
        .asObservable()
        .publishReplay(1)
        .refCount()


export function dispatch(type: any, payload: any = null) {
    /*if (!Actions.hasOwnProperty(type)) {
      throw new Error(`Tried to dispatch an unknown action.
                       Action type: ${type}.
                       Please make sure actions you use are in the
                       list of known actions.`)
    }
    */
    const action = { type, payload }
    _dispatcher.next(action);
}


function buildFilterFunction(args: any) {
    // Check if has actions
    /*const hasActions =
      Object.keys(args)
        .some(key => Object.keys(Actions).indexOf(args[key]) !== -1)

    if (!hasActions) {
      throw new Error('Invalid filters provided to dispatcher func')
    }
    */
    return (message: any) => {
        // If filter args have actions to filter by them
        return (
            Object.keys(args)
                .some(key => args[key] === message.type)
        )
    }
}

// Dispatch full actions (including data)
// We either get a predicate, or a list of actions
export function getAction(...args: any[]) {
    let filteredDispatcher

    if (args.length === 0) {
        filteredDispatcher = _dispatcher
    } else if (typeof args[0] === 'function') {
        filteredDispatcher =
            _dispatcher
                .filter(args[0])
    } else {
        // Sugaring for filtering by actions
        // arguments's values are the actions we would like to filter by

        filteredDispatcher =
            _dispatcher
                .filter(buildFilterFunction(args))
    }
    // After we have filtered, the only data that is interesting is under the data key
    return filteredDispatcher
}

// Dispatch only the data from the actions
export function getPayload(...args: any[]) {
    // We usually only need the data prop, so pluck it by
    // default
    //
    return (
        getAction(...args)
            .pluck('payload')
    );
};

export const DONT_USE_UNLESS_YOUR_NAME_IS_ACTION_CREATOR = _dispatcher
