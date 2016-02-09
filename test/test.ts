// Project: https://github.com/davetemplin/async-file/
// Written by: Dave Templin <https://github.com/davetemplin/>

import * as File from '../index';
import * as path from 'path';
import {assert} from 'chai';

describe('File', function () {
    
    it('readFile', async function () {
        var file = path.resolve(__dirname, 'test1.txt');
        var data = await File.readFile(file, 'utf8');
        assert(data === 'Lorem ipsum dolor sit amet');
    });
    
    it('readTextFile', async function () {
        var file = path.resolve(__dirname, 'test1.txt');
        var data = await File.readTextFile(file);
        assert(data === 'Lorem ipsum dolor sit amet');
    });
    
    it('writeTextFile', async function () {
        var file = path.resolve(__dirname, 'test.tmp');
        await File.writeTextFile(file, 'Hello world!\n', null, File.OpenFlags.append);
    });

    it('readdir', async function () {        
        var result = await File.readdir(__dirname);
        assert(result.indexOf('test1.txt') >= 0);
    });

    it('unlink', async function () {
        var file = path.resolve(__dirname, 'test.tmp');
        await File.writeTextFile(file, 'Delete me.\n', null, File.OpenFlags.append);
        await File.unlink(file);
        var result = await File.exists(file);
        assert(result === false);
    });

    it('exists', async function () {        
        var file = path.resolve(__dirname, 'test1.txt');
        var result = await File.exists(file);
        assert(result === true);
    });
    
    it('does not exist', async function () {        
        var file = path.resolve(__dirname, 'nonexistant.tmp');
        var result = await File.exists(file);
        assert(result === false);
    });
    
});