// Project: https://github.com/davetemplin/async-file/
// Written by: Dave Templin <https://github.com/davetemplin/>

import * as fs from './index';

(async function () {
    await fs.writeTextFile('data.log', '\nPASSED!\n', undefined, 'a');
    process.exit();
})();