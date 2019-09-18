import axios from 'axios';

function getEmployeeProjects(projectName: string, jsessionid: string): Promise<string[]> {
  const { HOST, PORT } = process.env;
  const url = `http://${HOST}:${PORT}/service/employees/${projectName}/projects`;

  return axios.get<string[]>(url, {
    headers: {
      'Cookie': `JSESSIONID=${jsessionid}`,
      'Content-Type': 'application/json',
    },
  })
    .then(({ data }) => data);
}

export default getEmployeeProjects;
