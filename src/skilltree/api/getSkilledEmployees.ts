import dotenv from 'dotenv';
import http from 'https';

dotenv.config();

// const { HOST, LOGIN, PASSWORD } = process.env;

export type RawSkilledEmployee = {
  'user_id': string,
  'full_name': string;
  'job_title': string;
  'work_profile_id': number,
  'grade_id': string;
  'location': string;
  'availability_status': string;
  'assignments': [
    {
      'name': string;
    }
  ],
  'skills': [
    {
      'id': number,
      'name': string;
      'level': string;
      'declared_level': string;
    },
  ]
};

function getSkilledEmployees(token: string, skillId: number): Promise<RawSkilledEmployee[]> {
  return new Promise((resolve, reject) => {
    const options = {
      'method': 'POST',
      'hostname': 'skilltree.griddynamics.net',
      'path': '/api/v2/searchEmployee',
      'headers': {
        'content-type': 'application/json',
        'authorization': `Bearer ${token}`,
      },
    };

    const req = http.request(options, (res) => {
      const chunks: Uint8Array[] = [];

      res.on('data', (chunk) => {
        chunks.push(chunk);
      });

      res.on('end', () => {
        const body = Buffer.concat(chunks);
        console.log('status code:', res.statusCode);
        resolve(JSON.parse(body.toString()));
      });

      res.on('error', (error) => {
        reject(error);
      });
    });

    console.log('req body:', JSON.stringify({
      employees: [],
      skills: [{ id: `${skillId}` }],
      statuses: ['DECLARED'],
    }));

    req.write(JSON.stringify({
      employees: [],
      skills: [{ id: `${skillId}` }],
      statuses: ['DECLARED'],
    }));

    req.end();
  });
}

export default getSkilledEmployees;
