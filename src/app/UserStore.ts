import { Property, Store } from '../frame/decorators';
import { StoreManager } from '../frame/Store';
import { Observable } from '@reactivex/rxjs';

@Store
export class UserStore extends StoreManager {

    @Property
    private users = Observable.from([1]).startWith(0);

    constructor() {
        super();
    }

}
