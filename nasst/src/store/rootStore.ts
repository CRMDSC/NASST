// import { UserStore } from './user';
// import { TokenStore } from './token'
// import { UiStore } from './ui'
// import { NotificationStore } from './notification'
// import { CompanyAddEditStore } from './companyAddEdit'
// import {  observable, reaction } from 'mobx'
// import moment from 'moment'
// import { loadTheme } from '@fluentui/react'
// import constants from '../../assests/locales/constants'
// import i18n from '../../i18n'

// export class RootStore {
//     user: UserStore
//     token: TokenStore
//     ui: UiStore
//     notification: NotificationStore
//     companyAddEdit: CompanyAddEditStore

//     @observable firstLoad = true;

//     constructor(){
//         this.token = new TokenStore(this)
//         this.user = new UserStore(this)
//         this.notification = new NotificationStore(this)
//         this.ui = new UiStore(this)
//         this.companyAddEdit = new CompanyAddEditStore(this)
        
//         reaction
//         (
//             () => this.user.locale,
//             (locale) => {
//             console.log("reaction fired locale: ", locale)
//             i18n.changeLanguage(locale);
//             moment.locale(locale);
        
//             if (constants.rtlLangs.indexOf(locale) > -1) {
//                 loadTheme({rtl : true})
//                 this.user.rtl = true;
        
//                 if (locale === 'ar') {
//                 moment.defineLocale('ar-arNum', {
//                     parentLocale: 'ar',
//                     preparse: function (str : string) {
//                     return str;
//                     },
//                     postformat: function (str : string) {
//                     return str;
//                     }
//                 });
//                 moment.locale('ar-arNum');
//                 }
//             }
//             else {
//                 this.user.rtl = false;
//                 loadTheme({rtl : false})
//             }
//             }
//         );
//     }

    
// }

// export default (window as any).root = new RootStore()