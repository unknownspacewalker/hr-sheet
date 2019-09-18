interface IEmployee {
  readonly id: number;
  general: {
    readonly username: string | null;
    readonly firstName: string | null;
    readonly familyName: string | null;
    readonly nativeFullName: string | null;
    readonly birthday: string | null;
  }
  jobInfo: {
    readonly hiringDate: string | null;
    readonly managerId: string | null;
  },
  bamboo: {
    readonly id: number;
    readonly firstName: string | null;
    readonly familyName: string | null;
    readonly gender: string | null;
  },
  latestGrade: {
    readonly location: string | null;
    readonly position: string | null;
    readonly track: string | null;
    readonly level: number;
    readonly workProfile: string | null;
    readonly specialization: string | null;
  },
  social: {
    readonly email: string | null;
    readonly phone: string | null;
    readonly internalPhone: string | null;
    readonly socialCastContact: string | null;
    readonly gitHubContact: string | null;
    readonly dockerCloudId: string | null;
    readonly skypeId: string | null;
  },
  readonly projects: string[]
}
