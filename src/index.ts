import signIn from './pmo/api/auth/signIn';
import getAllActive from './pmo/api/employees/getAllActive';

(async () => {
  try {
    const jsessionid = await signIn();
    console.log(await getAllActive(jsessionid));
  } catch (e) {
    console.log('error:', e.message);
  }
})();
