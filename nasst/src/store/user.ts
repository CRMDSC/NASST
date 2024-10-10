// import { observable, action, IObservableArray, computed } from "mobx";

// import logo from "../assests/images/logo.png";





// export class UserStore {
//   rootStore: RootStore;
//   @observable userId = "";
//   @observable isLoggedIn = false;
//   @observable company: UserCompanyView | null = null;
//   @observable username = "";
//   @observable title = "";
//   @observable firstName = "";
//   @observable lastName = "";
//   @observable fullname = "";
//   @observable linkedInUrl="";
//   @observable birthDate=moment(new Date());
//   @observable currentStatus = "";
//   @observable currentCustomStatusText = "";
//   @observable allowedActions: ClockingType[] = [];
//   @observable currentShift?: ShiftView;
//   @observable today?: DaySummaryView;
//   @observable loading = true;
//   @observable now = moment(new Date());
//   @observable incrementWorkingTimer = 0;
//   @observable incrementBreakTimer = 0;
//   // @observable workingHours = 0.5;
//   @observable currentWorkingDuration = 0.5;
//   @observable role: string = "";
//   @observable isSupervisor: boolean = false;
//   @observable imageUrl?: string;
//   @observable attendanceImageConfig : UserAttendanceImageConfig = UserAttendanceImageConfig.InheritedFromCompany;
//   @observable workplaceConfig : WorkplaceConfig = WorkplaceConfig.CompanyOrUserSpecific;
//   @observable isGCCCountry: boolean = false;
//   @observable shiftScheduleType : UserShiftScheduleType = UserShiftScheduleType.InheritedFromCompany;
//   @observable userFaceRecognitionConfig : UserFaceRecognitionConfig = UserFaceRecognitionConfig.InheritedFromCompany
//   @observable locale : string = 'en'
//   @observable rtl = false
//   @observable firstLogin = false
//   @observable userFaceImage?:UserFaceImage;
//   @observable faceRecognitionModelsLoaded : boolean = false;
//   @observable labeledFaceDescriptors : any[] = [];

//   // eslint-disable-next-line max-len
//   @observable companyLogo = logo;
//   @observable companyPrimaryColor? : string = "#005bab";
//   @computed get companyName() {
//     return this.company?.name ?? "";
//   }
//   @computed get companyLocales() {
//     return this.company?.locales ?? "";
//   }


//   @computed get token() {
//     return this.rootStore.token ? this.rootStore.token.token : undefined;
//   }

//   constructor(rootStore : RootStore) {
//     this.rootStore = rootStore;
//   }

//   // @action
//   // init = async () => {
//   //   this.rootStore.firstLoad = false
//   //   if (this.token) {
//   //     await this.getUserInfo();
//   //   } else {
//   //       await this.refreshToken().then( async res => {
//   //           if (res.status === 200){
//   //             await this.getUserInfo();
//   //           } else {
//   //             this.loading = false;
//   //           }
//   //       })
//   //   }
//   // }


//   @action
//   async login(input: LoginInput) {
//     this.loading = true
//     const data = await AccountApi.login(input);
//     if (data) {
//       this.rootStore.token.token = data.payload.accessToken;
//       // tokenStore.refreshToken = data.payload.refreshToken;
//       this.firstLogin = data.payload.firstLogin;
//       this.isLoggedIn = true;
//      // await this.getUserInfo();
//     }
//     this.loading = false;
//     return data;
//   }

//   @action
//   async refreshToken() {
//     const data = await AccountApi.refreshToken();
//     if (data && data.status === 200) {
//       this.rootStore.token.token = data.payload.accessToken;
//     }
//     return data;
//   }

//   @action
//   async logout(withRequest: boolean = true) {
//     let res
//     if (this.token && withRequest)
//       res = await AccountApi.logout();
//     if (res || !withRequest) {
//       this.rootStore.token.token = null;
//       this.company = null;
//       this.isLoggedIn = false;
//       this.role = "";
//       this.imageUrl="";
//       this.companyPrimaryColor = "#005bab"
//       this.companyLogo = logo;
//       return new Promise<void>((resolve) => setTimeout(() => resolve(), 1000));
//     }
//   }



//   // @action
//   // async getUserInfo() {
//   //   try {

//   //     //this.faceRecognitionPrep()
//   //     const info = await AccountApi.getUserInfo();

//   //     console.log(info.payload);
//   //     if (info.status === 200) {
//   //       this.locale = info.payload.locale?? "en";
//   //       this.userId = info.payload.id;
//   //       this.company = info.payload.company;
//   //       //this.workingHours = info.payload.workingHours;
//   //       this.currentWorkingDuration = info.payload.currentWorkingDuration
//   //       this.role = info.payload.role;
//   //       this.attendanceImageConfig = info.payload.userRules.attendanceImageConfig;
//   //       this.workplaceConfig = info.payload.userRules.workplaceConfig;
//   //       this.isLoggedIn = true;
//   //       this.username = info.payload.userName;
//   //       this.currentStatus = info.payload.currentStatus;
//   //       this.currentCustomStatusText = info.payload.currentCustomStatusText ;
//   //       this.title = info.payload.title;
//   //       this.firstName = info.payload.firstName;
//   //       this.lastName = info.payload.lastName;
//   //       this.fullname = info.payload.fullName;
//   //       this.imageUrl = info.payload.imageUrl;
//   //       this.isSupervisor = info.payload.isSupervisor;
//   //       this.isGCCCountry = info.payload.country ? info.payload.country.isGcc?? false : false;
//   //       this.shiftScheduleType = info.payload.userRules.shiftScheduleType;
//   //       this.userFaceImage = info.payload.userFaceImage;
//   //       this.userFaceRecognitionConfig = info.payload.userRules.faceRecognitionConfig;
       

//   //       if (info.payload.company && info.payload.company.imageUrl) {
//   //         this.companyLogo = info.payload.company.imageUrl;
//   //       }
//   //       if (info.payload.company && info.payload.company.primaryColor) {
//   //         this.companyPrimaryColor = info.payload.company.primaryColor;
//   //       } else {
//   //         this.companyPrimaryColor = "#005bab"
//   //       }
//   //       await this.getStatus();


//   //     }
//   //     // else {
//   //     //   this.isLoggedIn = false;
//   //     // }
//   //     this.loading = false;
//   //   } catch (error) {
//   //     console.log(error)
//   //     this.loading = false;
//   //   }

//   // }



// }

// // export default (window as any).userStore = new UserStore();