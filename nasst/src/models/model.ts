// ..\NASSTBACKEND\Data\Entities\Category.cs
export interface Category {
    id: number;
    name: string;
    isArchived: boolean;
}

// ..\NASSTBACKEND\Data\Entities\Log.cs
export interface Log {
    id: number;
    message?: string;
    stackTrace?: string;
    source?: string;
    path?: string;
    protocol?: string;
    method?: string;
    createdAt: Date;
    createdById?: string;
    createdByUser?: User;
}

// ..\NASSTBACKEND\Data\Entities\Player.cs
export interface Player {
    id: number;
    firstName?: string;
    lastName?: string;
    email?: string;
    phoneNumber?: string;
    categortId: number;
    category: Category;
    createdOn: Date;
    updatedOn?: Date;
    isArchived: boolean;
    createdById?: string;
    createdBy?: User;
    updatedById?: string;
    updatedBy?: User;
}

// ..\NASSTBACKEND\Data\Entities\Role.cs
export interface Role {
    createdOn: Date;
    updatedOn?: Date;
    createdById?: string;
    updatedById?: string;
    isArchived: boolean;
    createdBy?: User;
    updatedBy?: User;
}

// ..\NASSTBACKEND\Data\Entities\Role.cs
export enum Roles {
    User = 'User',
    Admin = 'Admin',
}

// ..\NASSTBACKEND\Data\Entities\SportType.cs
export interface SportType {
    id: number;
    name: string;
    playersCount: number;
    teamsCount: number;
    isArchived: boolean;
    createdById?: string;
    createdBy: User;
    updatedById?: string;
    updatedBy: User;
}

// ..\NASSTBACKEND\Data\Entities\User.cs
export interface User  {
    firstName?: string;
    lastName?: string;
    fullName?: string;
    createdOn: Date;
    updatedOn?: Date;
    fcmToken?: string;
    isArchived: boolean;
    createdById?: string;
    createdBy?: User;
    updatedById?: string;
    updatedBy?: User;
}

// ..\NASSTBACKEND\Data\Entities\UserRefreshToken.cs
export interface UserRefreshToken {
    id: number;
    token: string;
    expires?: Date;
    isExpired: boolean;
    created: Date;
    createdByIp?: string;
    revoked?: Date;
    revokedByIp?: string;
    replacedByToken?: string;
    isActive: boolean;
    userId: string;
    user: User;
}

// ..\NASSTBACKEND\Data\InputModels\LoginInput.cs
export interface LoginInput {
    email: string;
    password: string;
    fcmToken: string;
}

// ..\NASSTBACKEND\Data\InputModels\PlayerInput.cs
export interface PlayerInput {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    categoryId: number;
}

// ..\NASSTBACKEND\Data\InputModels\RegisterInput.cs
export interface RegisterInput {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: string;
}

// ..\NASSTBACKEND\Data\InputModels\SportTypeInput.cs
export interface SportTypeInput {
    name: string;
    playersCount: number;
    teamsCount: number;
}

// ..\NASSTBACKEND\Data\InputModels\UpdateSportTypeInput.cs
export interface UpdateSportTypeInput {
    id: number;
    name: string;
    playersCount: number;
    teamsCount: number;
}

// ..\NASSTBACKEND\Data\ViewModels\ErrorView.cs
export interface Error {
    code: string;
    description: string;
    path: string;
    time?: Date;
}

// ..\NASSTBACKEND\Data\ViewModels\LoginView.cs
export interface LoginView {
    accessToken: string;
    accessTokenExpiresIn: number;
    refreshTokenExpiresIn: number;
}

// ..\NASSTBACKEND\Data\ViewModels\Result.cs
export interface Result<TPayload> {
    payload: TPayload;
    status: number;
    errors: Error[];
}

// ..\NASSTBACKEND\Data\ViewModels\SportTypeView.cs
export interface SportTypeView {
    id: number;
    name: string;
    playersCount: number;
    teamsCount: number;
}

// ..\NASSTBACKEND\Data\ViewModels\UserView.cs
export interface UserView {
    userId: string;
    fullName: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
}