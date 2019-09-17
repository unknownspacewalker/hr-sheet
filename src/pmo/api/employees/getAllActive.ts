import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const url = 'http://internaltools.pmo.aws.griddynamics.net:8080/service/api/employee/active';

function getAllActive(jsessionid: string): Promise<IEmployee[]> {
  return axios.get<IEmployee[]>(url, {
    headers: {
      'Cookie': `JSESSIONID=${jsessionid}`,
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.data);
}

export default getAllActive;
