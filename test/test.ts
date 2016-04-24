// Project: https://github.com/davetemplin/async-file/
// Written by: Dave Templin <https://github.com/davetemplin/>

import * as File from '../index';
import * as path from 'path';
import {assert} from 'chai';

describe('File', function () {
    
    var clean: string[];
    before(async function () {
        clean = [];
    });        
    
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
        var file = path.resolve(__dirname, 'temp1.txt');
        await File.writeTextFile(file, 'Hello world!\n', null, 'a');
        clean.push(file);
    });

    it('readdir', async function () {        
        var result = await File.readdir(__dirname);
        assert(result.indexOf('test1.txt') >= 0);
    });

    it('unlink', async function () {
        var file = path.resolve(__dirname, 'temp2.txt');
        await File.writeTextFile(file, 'Delete me.\n', null, 'a');
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
    
    it('createDirectory', async function () {
        var p0 = path.resolve(__dirname, 'temp3');
        var p1 = path.resolve(p0, 'dir1');
        var p2 = path.resolve(p1, 'dir2');        
        await File.createDirectory(p2);
        var r0 = await File.exists(p0);
        var r1 = await File.exists(p1);
        var r2 = await File.exists(p2);
        assert(r0, p0 + ' does not exist');
        assert(r1, p1 + ' does not exist');
        assert(r2, p2 + ' does not exist');
        clean.push(p0);        
    });
    
    it('delete file', async function () {
        var p0 = path.resolve(__dirname, 'temp4.txt');
        await File.writeTextFile(p0, 'test123');
        await File.delete(p0);
        var r0 = await File.exists(p0);
        assert(!r0, p0 + ' exists');
    });

    it('delete empty directory', async function () {
        var p0 = path.resolve(__dirname, 'temp5');
        await File.createDirectory(p0);
        await File.delete(p0);
        var r0 = await File.exists(p0);
        assert(!r0, p0 + ' exists');
    });
    
    it('delete non-empty directory', async function () {
        var p0 = path.resolve(__dirname, 'temp6');
        var p1 = path.resolve(p0, 'dir1');
        var p2 = path.resolve(p1, 'dir2');
        var p3 = path.resolve(p0, 'dir3');
        await File.createDirectory(p2);
        await File.createDirectory(p3);
        await File.writeTextFile(path.resolve(p0, 'a.txt'), 'aaa');
        await File.writeTextFile(path.resolve(p2, 'b.txt'), 'bbb');
        await File.writeTextFile(path.resolve(p3, 'c.txt'), 'ccc');
        await File.writeTextFile(path.resolve(p3, 'd.txt'), 'ddd');
        await File.writeTextFile(path.resolve(p3, 'e.txt'), 'eee');
        await File.writeTextFile(path.resolve(p3, 'f.txt'), 'fff');
        await File.writeTextFile(path.resolve(p2, 'g.txt'), 'ggg');
        
        await File.delete(p0);
        var r0 = await File.exists(p0);
        assert(!r0, p0 + ' exists');
    });

    after(async function () {
        for (var item of clean)
            await File.delete(item);
    });
});