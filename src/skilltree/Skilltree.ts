import IEmployee from '../interfaces/IEmployee';
import signIn from './api/auth/signIn';
import getSkilledEmployees, { RawSkilledEmployee } from './api/getSkilledEmployees';

type Skill = {
  'id': number;
  'name': string;
  'level': string;
  'declared_level': string;
};
type SkilledEmployee = {
  username: string;
  skills: {
    [skillName: string]: boolean;
  };
};
type Acc = { [id: string]: SkilledEmployee };


class Skilltree {
  token: string;

  skills: { [skillName: string]: number };

  skilledEmployeesMap: Acc;

  constructor() {
    this.skills = {
      ReactJS: 222920465,
      NodeJS: 160,
      Angular: 222920434,
    };
  }

  signIn = async () => {
    this.token = await signIn();
  };

  getSkillIds = async () => { };

  searchForSkilledEmployees = async () => {
    const rawReactSkilledEmployees = await getSkilledEmployees(this.token, this.skills.ReactJS);
    const rawAngularSkilledEmployees = await getSkilledEmployees(this.token, this.skills.Angular);
    const rawNodejsSkilledEmployees = await getSkilledEmployees(this.token, this.skills.NodeJS);
    const skilledEmployeesMap = [
      ...rawReactSkilledEmployees,
      ...rawAngularSkilledEmployees,
      ...rawNodejsSkilledEmployees,
    ]
      .reduce((acc: Acc, curr: RawSkilledEmployee): Acc => {
        if (!acc[curr.user_id]) {
          acc[curr.user_id] = {
            username: curr.user_id,
            skills: {},
          };
        }
        acc[curr.user_id].skills[curr.skills[0].name] = Boolean(curr.skills[0].declared_level);
        return acc;
      }, {});
    this.skilledEmployeesMap = skilledEmployeesMap;
  };

  populate = (employees: IEmployee[]): IEmployee[] => {
    const copy = Object.assign(employees);
    return copy.map((emp: IEmployee) => {
      const skills = {
        ReactJS: false,
        NodeJS: false,
        Angular: false,
      };

      try {
        Object.assign(
          skills,
          this.skilledEmployeesMap[emp.username].skills,
        );
      } catch (e) {
        // do nothing
      }

      return Object.assign(emp, { skills });
    });
  };
}

export default Skilltree;
