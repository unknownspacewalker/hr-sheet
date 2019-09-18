import signIn from "./pmo/api/auth/signIn";
import getAllActive from "./pmo/api/employees/getAllActive";

import sheet from "./sheet";

(async () => {
  try {
    // const jsessionid = await signIn();
    // console.log(await getAllActive(jsessionid));

    await sheet();
  } catch (e) {
    console.log("error:", e.message);
    console.log("stack:", e.stack);
  }
})();
