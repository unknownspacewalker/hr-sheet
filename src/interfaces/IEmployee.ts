interface IEmployee {
  readonly id: number;
  readonly manager: string | null;
  readonly username: string | null;
  readonly firstName: string | null;
  readonly familyName: string | null;
  readonly track: string | null;
  readonly level: number;
  readonly location: string | null;
  readonly priority: '1. Bench' | '2. Internal Project' | '3. Billable Project';
}
