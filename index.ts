// Project: https://github.com/davetemplin/async-file/
// Written by: Dave Templin <https://github.com/davetemplin/>

var fs = require('fs');

export interface Buffer {
    [index: number]: number;
    write(string: string, offset?: number, length?: number, encoding?: string): number;
    toString(encoding?: string, start?: number, end?: number): string;
    toJSON(): any;
    length: number;
    equals(otherBuffer: Buffer): boolean;
    compare(otherBuffer: Buffer): number;
    copy(targetBuffer: Buffer, targetStart?: number, sourceStart?: number, sourceEnd?: number): number;
    slice(start?: number, end?: number): Buffer;
    writeUIntLE(value: number, offset: number, byteLength: number, noAssert?: boolean): number;
    writeUIntBE(value: number, offset: number, byteLength: number, noAssert?: boolean): number;
    writeIntLE(value: number, offset: number, byteLength: number, noAssert?: boolean): number;
    writeIntBE(value: number, offset: number, byteLength: number, noAssert?: boolean): number;
    readUIntLE(offset: number, byteLength: number, noAssert?: boolean): number;
    readUIntBE(offset: number, byteLength: number, noAssert?: boolean): number;
    readIntLE(offset: number, byteLength: number, noAssert?: boolean): number;
    readIntBE(offset: number, byteLength: number, noAssert?: boolean): number;
    readUInt8(offset: number, noAsset?: boolean): number;
    readUInt16LE(offset: number, noAssert?: boolean): number;
    readUInt16BE(offset: number, noAssert?: boolean): number;
    readUInt32LE(offset: number, noAssert?: boolean): number;
    readUInt32BE(offset: number, noAssert?: boolean): number;
    readInt8(offset: number, noAssert?: boolean): number;
    readInt16LE(offset: number, noAssert?: boolean): number;
    readInt16BE(offset: number, noAssert?: boolean): number;
    readInt32LE(offset: number, noAssert?: boolean): number;
    readInt32BE(offset: number, noAssert?: boolean): number;
    readFloatLE(offset: number, noAssert?: boolean): number;
    readFloatBE(offset: number, noAssert?: boolean): number;
    readDoubleLE(offset: number, noAssert?: boolean): number;
    readDoubleBE(offset: number, noAssert?: boolean): number;
    writeUInt8(value: number, offset: number, noAssert?: boolean): number;
    writeUInt16LE(value: number, offset: number, noAssert?: boolean): number;
    writeUInt16BE(value: number, offset: number, noAssert?: boolean): number;
    writeUInt32LE(value: number, offset: number, noAssert?: boolean): number;
    writeUInt32BE(value: number, offset: number, noAssert?: boolean): number;
    writeInt8(value: number, offset: number, noAssert?: boolean): number;
    writeInt16LE(value: number, offset: number, noAssert?: boolean): number;
    writeInt16BE(value: number, offset: number, noAssert?: boolean): number;
    writeInt32LE(value: number, offset: number, noAssert?: boolean): number;
    writeInt32BE(value: number, offset: number, noAssert?: boolean): number;
    writeFloatLE(value: number, offset: number, noAssert?: boolean): number;
    writeFloatBE(value: number, offset: number, noAssert?: boolean): number;
    writeDoubleLE(value: number, offset: number, noAssert?: boolean): number;
    writeDoubleBE(value: number, offset: number, noAssert?: boolean): number;
    fill(value: any, offset?: number, end?: number): Buffer;
    indexOf(value: string | number | Buffer, byteOffset?: number): number;
}

export interface Stats {
    isFile(): boolean;
    isDirectory(): boolean;
    isBlockDevice(): boolean;
    isCharacterDevice(): boolean;
    isSymbolicLink(): boolean;
    isFIFO(): boolean;
    isSocket(): boolean;
    dev: number;
    ino: number;
    mode: number;
    nlink: number;
    uid: number;
    gid: number;
    rdev: number;
    size: number;
    blksize: number;
    blocks: number;
    atime: Date;
    mtime: Date;
    ctime: Date;
    birthtime: Date;
}

export interface WriteResult {
    written: number;
    buffer: Buffer;    
}

export interface ReadResult {
    bytesRead: number;
    buffer: Buffer;    
}

export async function access(path: string, mode?: number): Promise<void> { return thunk<void>(fs.access, arguments); }
export async function appendFile(filename: string, data: any, options?: { encoding?: string; mode?: number|string; flag?: string; }): Promise<void> { return thunk<void>(fs.appendFile, arguments); }
export async function chmod(path: string, mode: number|string): Promise<void> { return thunk<void>(fs.chmod, arguments); }
export async function chown(path: string, uid: number, gid: number): Promise<void> { return thunk<void>(fs.chown, arguments); }
export async function close(fd: number): Promise<void> { return thunk<void>(fs.close, arguments); }
export async function fchmod(fd: number, mode: number|string): Promise<void> { return thunk<void>(fs.fchmod, arguments); }
export async function fchown(fd: number, uid: number, gid: number): Promise<void> { return thunk<void>(fs.fchown, arguments); }
export async function fstat(fd: number): Promise<Stats> { return thunk<Stats>(fs.fstat, arguments); }
export async function ftruncate(fd: number, len?: number): Promise<void> { return thunk<void>(fs.ftruncate, arguments); }
export async function futimes(fd: number, atime: Date|number, mtime: Date|number): Promise<void> { return thunk<void>(fs.futimes, arguments); }
export async function fsync(fd: number): Promise<void> { return thunk<void>(fs.fsync, arguments); }
export async function lchmod(path: string, mode: number|string): Promise<void> { return thunk<void>(fs.lchmod, arguments); }
export async function lchown(path: string, uid: number, gid: number): Promise<void> { return thunk<void>(fs.lchown, arguments); }
export async function link(srcpath: string, dstpath: string): Promise<void> { return thunk<void>(fs.link, arguments); }
export async function lstat(path: string): Promise<Stats> { return thunk<Stats>(fs.lstat, arguments); }
export async function mkdir(path: string, mode?: number|string): Promise<void> { return thunk<void>(fs.mkdir, arguments); }
export async function open(path: string, flags: string, mode?: number|string): Promise<number> { return thunk<number>(fs.open, arguments); }
export async function read(fd: number, buffer: Buffer, offset: number, length: number, position: number): Promise<ReadResult> { return thunk<ReadResult>(fs.read, arguments, null, function () { return { bytesRead: <number>arguments[1], buffer: <Buffer>arguments[2] }; }); }
export async function readdir(path: string): Promise<string[]> { return thunk<string[]>(fs.readdir, arguments); }
export async function readFile(file: string|number, options?: Object|string): Promise<any> { return thunk<any>(fs.readFile, arguments); }
export async function readlink(path: string): Promise<string> { return thunk<string>(fs.readlink, arguments); }
export async function realpath(path: string, cache?: {[path: string]: string}): Promise<string> { return thunk<string>(fs.realpath, arguments); }
export async function rename(oldPath: string, newPath: string): Promise<void> { return thunk<void>(fs.rename, arguments); }
export async function rmdir(path: string): Promise<void> { return thunk<void>(fs.rmdir, arguments); }
export async function stat(path: string): Promise<Stats> { return thunk<Stats>(fs.stat, arguments); }
export async function symlink(srcpath: string, dstpath: string, type?: string): Promise<void> { return thunk<void>(fs.symlink, arguments); }
export async function truncate(path: string, len?: number): Promise<void> { return thunk<void>(fs.truncate, arguments); }
export async function unlink(path: string): Promise<void> { return thunk<void>(fs.unlink, arguments); }
export async function utimes(path: string, atime: Date|number, mtime: Date|number): Promise<void> { return thunk<void>(fs.utimes, arguments); }
export async function write(fd: number, buffer: Buffer, offset: number, length: number, position?: number): Promise<WriteResult> { return thunk<WriteResult>(fs.write, arguments, null, function () { return { written: <number>arguments[1], buffer: <Buffer>arguments[2] }; }); }
export async function writeFile(file: string|number, data: string|any, options: Object|string): Promise<void> { return thunk<any>(fs.writeFile, arguments); }



///////////////////////////////////////////////////////////////////////////////

export enum Encoding {
    ascii,
    base64,
    binary,
    hex,
    ucs2,
    utf16le,
    utf8
}

export enum OpenFlags {
    read, //r
    readWrite, //r+
    readSync, //rs
    readWriteSync, //rs+
    write, //w
    writeNoOverwrite, //wx
    create, //w+
    createNoOverwrite, //wx+
    append, //a
    appendNoOverwrite, //ax
    appendRead, //a+
    appendReadNoOverwrite //ax+
}
var openFlags: {[index:number]: string;} = {};
openFlags[OpenFlags.read] = 'r';
openFlags[OpenFlags.readWrite] = 'r+';
openFlags[OpenFlags.readSync] = 'rs';
openFlags[OpenFlags.readWriteSync] = 'rs+';
openFlags[OpenFlags.write] = 'w';
openFlags[OpenFlags.writeNoOverwrite] = 'wx';
openFlags[OpenFlags.create] = 'w+';
openFlags[OpenFlags.createNoOverwrite] = 'wx+';
openFlags[OpenFlags.append] = 'a';
openFlags[OpenFlags.appendNoOverwrite] = 'ax';
openFlags[OpenFlags.appendRead] = 'a+';
openFlags[OpenFlags.appendReadNoOverwrite] = 'ax+';

export async function readTextFile(file: string|number, encoding?: Encoding|string, flags?: OpenFlags|string): Promise<string> {
    if (flags === undefined || flags === null)
        flags = OpenFlags.read;
    return thunk<string>(fs.readFile, [file, createOptions(encoding, flags)]);
}


export async function writeTextFile(file: string|number, data: string, encoding?: Encoding|string, flags?: OpenFlags|string, mode?: string): Promise<void> {
    if (flags === undefined || flags === null)
        flags = OpenFlags.write;
    var options = createOptions(encoding, flags, mode);
    if (options.flags[0] === 'a')
        return thunk<any>(fs.appendFile, [file, data, options]);
    else
        return thunk<any>(fs.writeFile, [file, data, options]);
}

export async function del(path: string): Promise<void> {
    return unlink(path);
}

export async function exists(path: string): Promise<boolean> { 
    try {
        await stat(path);
        return true;
    } 
    catch (err) {
        if (err.code === 'ENOENT')
            return false;
        else
            throw err;            
    }
}

function createOptions(encoding?: Encoding|string, flags?: OpenFlags|string, mode?: string): {mode: number, encoding: string, flags: string} {
    var options: any = {};
    
    if (encoding === undefined || encoding === null)
        encoding = Encoding.utf8;
                    
    if (typeof encoding === 'number')
        options.encoding = Encoding[encoding];
    else if (typeof encoding === 'string')
        options.encoding = encoding;
        
    if (typeof flags === 'number')
        options.flags = openFlags[flags];
    else if (typeof flags === 'string')
        options.flags = flags;
        
    if (mode)
        options.mode = mode;
        
    return options;        
}

function thunk<T>(target: Function, args: any[]|IArguments, context?: any, resolver?: {(): T}): Promise<T> {    
    return new Promise<T>((resolve, reject) => {
        target.apply(context, Array.prototype.slice.call(args).concat([(err: Error, result: T) => {
            if (err)
                reject(err);
            else if (resolver)
                resolver.apply(context, arguments);
            else
                resolve(result);
        }]));
    });
}