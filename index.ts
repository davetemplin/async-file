// Project: https://github.com/davetemplin/async-file/
// Written by: Dave Templin <https://github.com/davetemplin/>

import * as fs from 'fs';
import * as pathutil from 'path';
import * as rimraf from 'rimraf';

export { 
    createReadStream,
    createWriteStream,
    watch,
    watchFile,
    unwatchFile,
    Stats,
    FSWatcher, 
    ReadStream, 
    WriteStream    
} from 'fs';

export type Encoding = 'ascii'|'base64'|'binary'|'hex'|'ucs2'|'utf16le'|'utf8';
export type Flags = 'r'|'r+'|'rs'|'rs+'|'w'|'wx'|'w+'|'wx+'|'a'|'ax'|'a+'|'ax+';

/**
 * Tests a user's permissions for the file or directory specified by path.
 * @param path The path to the file or directory to test.
 * @param mode An optional integer that specifies the accessibility checks to be performed.
 * The following constants define the possible values of mode.
 * It is possible to create a mask consisting of the bitwise OR of two or more values.
 * * `fs.constants.F_OK` - path is visible to the calling process. This is useful for determining if a file exists, but says nothing about rwx permissions. Default if no mode is specified.
 * * `fs.constants.R_OK` - path can be read by the calling process.
 * * `fs.constants.W_OK` - path can be written by the calling process.
 * * `fs.constants.X_OK` - path can be executed by the calling process. This has no effect on Windows (will behave like fs.constants.F_OK).
 * @returns Returns `true` if the file is accessible or `false` if the file is inaccessible.
 *
 * @example
 * The following example checks if the file `/etc/passwd` can be read and written by the current process.
 * ```js
 * await fs.access('/etc/passwd', fs.constants.R_OK | fs.constants.W_OK);
 * ```
 * 
 * Note: Using `fs.access()` to check for the accessibility of a file before calling `fs.open()`, `fs.readFile()` or `fs.writeFile()` is not recommended.
 * Doing so introduces a race condition, since other processes may change the file's state between the two calls.
 * Instead, user code should open/read/write the file directly and handle the error raised if the file is not accessible.
 */
export function access(path: string, mode?: number|string) {
    return new Promise<boolean>(resolve =>
        fs.access(path, <any>mode, err => 
            !err ? resolve(true) : resolve(false)));
}

export function appendFile(file: string|number, data: any, options?: { encoding?: Encoding; mode?: number|string; flag?: Flags; }) { return promisify<void>(fs.appendFile, arguments); }
export function chmod(path: string, mode: number|string) { return promisify<void>(fs.chmod, arguments); }
export function chown(path: string, uid: number, gid: number) { return promisify<void>(fs.chown, arguments); }
export function close(fd: number) { return promisify<void>(fs.close, arguments); }

/**
 * Convenience method to end a writable stream returning a promise.
 */
export function end(w: NodeJS.WritableStream, chunk?: any, encoding?: Encoding) { return new Promise<void>(resolve => w.end(chunk, encoding, () => resolve())); }

export function fchmod(fd: number, mode: number|string) { return promisify<void>(fs.fchmod, arguments); }
export function fchown(fd: number, uid: number, gid: number) { return promisify<void>(fs.fchown, arguments); }
export function fstat(fd: number) { return promisify<fs.Stats>(fs.fstat, arguments); }
export function ftruncate(fd: number, len?: number) { return promisify<void>(fs.ftruncate, arguments); }
export function futimes(fd: number, atime: Date|number, mtime: Date|number) { return promisify<void>(fs.futimes, arguments); }
export function fsync(fd: number) { return promisify<void>(fs.fsync, arguments); }
export function lchmod(path: string, mode: number|string) { return promisify<void>(fs.lchmod, arguments); }
export function lchown(path: string, uid: number, gid: number) { return promisify<void>(fs.lchown, arguments); }
export function link(srcpath: string, dstpath: string) { return promisify<void>(fs.link, arguments); }
export function lstat(path: string) { return promisify<fs.Stats>(fs.lstat, arguments); }
export function mkdir(path: string, mode?: number|string) { return promisify<void>(fs.mkdir, arguments); }
export function mkdtemp(path: string, encoding?: Encoding) { return promisify<string>((fs as any).mkdtemp, arguments); }

/**
 * Opens a file stream on the specified path, with the specified mode and access.
 * *Added in: v0.0.2*
 * @param path The file to open.
 * @param flags Specifies whether a file is created if one does not exist, and determines whether the contents of existing files are retained or overwritten.
 * `r` - Open file for reading. An exception occurs if the file does not exist.
 * `r+` - Open file for reading and writing. An exception occurs if the file does not exist.
 * `rs+` - Open file for reading and writing in synchronous mode. Instructs the operating system to bypass the local file system cache.
 * This is primarily useful for opening files on NFS mounts as it allows you to skip the potentially stale local cache. It has a very real impact on I/O performance so don't use this flag unless you need it.
 * Note that this doesn't turn `fs.open()` into a synchronous blocking call. If that's what you want then you should be using `fs.openSync()`.
 * * `w` - Open file for writing. The file is created (if it does not exist) or truncated (if it exists).
 * * `wx` - Like `w` but fails if `path` exists.
 * * `w+` - Open file for reading and writing. The file is created (if it does not exist) or truncated (if it exists).
 * * `wx+` - Like `w+` but fails if `path` exists.
 * * `a` - Open file for appending. The file is created if it does not exist.
 * * `ax` - Like `a` but fails if `path` exists.
 * * `a+` - Open file for reading and appending. The file is created if it does not exist.
 * * `ax+` - Like `a+` but fails if `path` exists.
 * The exclusive flag `x` (`O_EXCL` flag in [open(2)](http://man7.org/linux/man-pages/man2/open.2.html)) ensures that `path` is newly created. On POSIX systems, `path` is considered to exist even if it is a symlink to a non-existent file. The exclusive flag may or may not work with network file systems.
 * `flags` can also be a number as documented by [open(2)](http://man7.org/linux/man-pages/man2/open.2.html); commonly used constants are available from `fs.constants`. On Windows, flags are translated to their equivalent ones where applicable, e.g. `O_WRONLY` to `FILE_GENERIC_WRITE`, or `O_EXCL|O_CREAT` to `CREATE_NEW`, as accepted by `CreateFileW`.
 * On Linux, positional writes don't work when the file is opened in append mode. The kernel ignores the position argument and always appends the data to the end of the file.
 * *Note: The behavior of fs.open() is platform specific for some flags. As such, opening a directory on OS X and Linux with the 'a+' flag - see example below - will return an error. In contrast, on Windows and FreeBSD, a file descriptor will be returned.*
 * @param mode Sets the file mode (permission and sticky bits), but only if the file was created. It defaults to `0666`, readable and writable.
 * @returns Returns an integer representing the file descriptor.
 */
export function open(path: string, flags: Flags, mode?: number|string) { return promisify<number>(fs.open, arguments); }

export function read(fd: number, buffer: Buffer, offset: number, length: number, position: number) { return promisify<{bytesRead: number, buffer: Buffer}>(fs.read, arguments, null, function () { return { bytesRead: <number>arguments[1], buffer: <Buffer>arguments[2] }; }); }
export function readdir(path: string) { return promisify<string[]>(fs.readdir, arguments); }
export function readFile(file: string|number, 
    options?: { 
        encoding?: Encoding;
        flag?: Flags; } | Encoding | Flags
    ) { return promisify<any>(fs.readFile, arguments); }
export function readlink(path: string) { return promisify<string>(fs.readlink, arguments); }
export function realpath(path: string, cache?: {[path: string]: string}) { return promisify<string>(fs.realpath, arguments); }
export function rename(oldPath: string, newPath: string) { return promisify<void>(fs.rename, arguments); }
export function rmdir(path: string) { return promisify<void>(fs.rmdir, arguments); }
export function stat(path: string) { return promisify<fs.Stats>(fs.stat, arguments); }
export function symlink(srcpath: string, dstpath: string, type?: string) { return promisify<void>(fs.symlink, arguments); }
export function truncate(path: string, len?: number) { return promisify<void>(fs.truncate, arguments); }
export function unlink(path: string) { return promisify<void>(fs.unlink, arguments); }
export function utimes(path: string, atime: Date|number, mtime: Date|number) { return promisify<void>(fs.utimes, arguments); }
export function write(fd: number, buffer: Buffer, offset: number, length: number, position?: number): Promise<{written: number, buffer: Buffer}>;
export function write(fd: number, data: any, offset?: number, encoding?: Encoding): Promise<{written: number, buffer: Buffer}>;
export function write(fd: number) { return promisify<{written: number; buffer: Buffer}>(fs.write, arguments, null, function () { return { written: <number>arguments[1], buffer: <Buffer>arguments[2] }; }); }

export function writeFile(file: string|number, data: string|any, 
    options?: { 
        encoding?: Encoding; 
        flag?: Flags; 
        mode?: number|string } | Encoding | Flags
    ) { return promisify<any>(fs.writeFile, arguments); }

export function readTextFile(file: string|number, encoding?: Encoding, flags?: Flags) {
    if (encoding === undefined)
        encoding = 'utf8';
    if (flags === undefined || flags === null)
        flags = 'r';
    return promisify<string>(fs.readFile, [file, {encoding: encoding, flags: flags}]);
}

export function writeTextFile(file: string|number, data: string, encoding?: Encoding, flags?: Flags, mode?: number|string) {
    if (encoding === undefined)
        encoding = 'utf8';
    if (flags === undefined || flags === null)
        flags = 'w';
    var options = {encoding: encoding, flags: flags, mode: mode};
    if (flags[0] === 'a')
        return promisify<void>(fs.appendFile, [file, data, options]);
    else
        return promisify<void>(fs.writeFile, [file, data, options]);
}

export function createDirectory(path: string, mode: number|string = 0o777) {
    return new Promise<void>((resolve, reject) =>
        mkdirp(path, mode, err =>
            !err ? resolve() : reject(err)));
}
export {createDirectory as mkdirp};

function del(path: string) {
    return new Promise<void>((resolve, reject) =>
        rimraf(path, err =>
            !err ? resolve() : reject(err)));
}
export {del as delete};
export {del as rimraf};

export function exists(path: string) {
    return new Promise<boolean>((resolve, reject) => 
        fs.lstat(path, err => 
            !err ? resolve(true) : err.code === 'ENOENT' ? resolve(false) : reject(err)));
}

function mkdirp(path: string, mode: number|string = 0o777, done: { (err: Error): void }): void {    
    path = pathutil.resolve(path);    
    fs.mkdir(path, <string>mode, err => {
        if (!err)
            done(<any>null);
        else if (err.code === 'ENOENT')
            mkdirp(pathutil.dirname(path), mode, err =>
                !err ? mkdirp(path, mode, done) : done(err));
        else
            fs.stat(path, (err: Error, stat: { isDirectory: {(): boolean}}) => 
                err ? done(err) : !stat.isDirectory() ? done(new Error(path + ' is already a file')) : done(<any>null));
    });
}

function promisify<T>(target: Function, args: any[]|IArguments, context?: any, resolver?: {(): T}) {    
    return new Promise<T>((resolve, reject) => {
        target.apply(context, Array.prototype.slice.call(args).concat([(err: Error, result: T) => {
            if (err)
                reject(err);
            else if (resolver)
                resolve(resolver.apply(context, arguments));
            else
                resolve(result);
        }]));
    });
}