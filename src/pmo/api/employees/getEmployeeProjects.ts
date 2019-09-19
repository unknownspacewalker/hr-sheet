import axios from 'axios';

const { HOST, PORT } = process.env;

function getEmployeeProjects(username: string, jsessionid: string): Promise<string[]> {
  const url = `http://${HOST}:${PORT}/service/employees/${username}/projects`;

  return axios.get<string[]>(url, {
    headers: {
      'Cookie': `JSESSIONID=${jsessionid}`,
      'Content-Type': 'application/json',
    },
  })
    .then(({ data }) => data);
}

export default getEmployeeProjects;
