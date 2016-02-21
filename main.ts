// Project: https://github.com/davetemplin/async-file/
// Written by: Dave Templin <https://github.com/davetemplin/>

import * as File from './index';

(async function () {
    await File.writeTextFile('data.log', '\nPASSED!\n', null, File.OpenFlags.append);
    process.exit();
})();