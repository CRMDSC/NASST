import { UserStore } from './user';
import { TokenStore } from './token'
import {  observable, reaction } from 'mobx'
import moment from 'moment'

export class RootStore {
    user: UserStore
    token: TokenStore

    @observable firstLoad = true;

    constructor(){
        this.token = new TokenStore(this)
        this.user = new UserStore(this)
    }

    
}

export default (window as any).root = new RootStore()