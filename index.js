"use strict";
// Project: https://github.com/davetemplin/async-file/
// Written by: Dave Templin <https://github.com/davetemplin/>
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const pathutil = require("path");
const rimraf = require("rimraf");
var fs_1 = require("fs");
exports.createReadStream = fs_1.createReadStream;
exports.createWriteStream = fs_1.createWriteStream;
exports.watch = fs_1.watch;
exports.watchFile = fs_1.watchFile;
exports.unwatchFile = fs_1.unwatchFile;
exports.Stats = fs_1.Stats;
exports.ReadStream = fs_1.ReadStream;
exports.WriteStream = fs_1.WriteStream;
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
function access(path, mode) {
    return new Promise(resolve => fs.access(path, mode, err => !err ? resolve(true) : resolve(false)));
}
exports.access = access;
function appendFile(file, data, options) { return promisify(fs.appendFile, arguments); }
exports.appendFile = appendFile;
function chmod(path, mode) { return promisify(fs.chmod, arguments); }
exports.chmod = chmod;
function chown(path, uid, gid) { return promisify(fs.chown, arguments); }
exports.chown = chown;
function close(fd) { return promisify(fs.close, arguments); }
exports.close = close;
/**
 * Convenience method to end a writable stream returning a promise.
 */
function end(w, chunk, encoding) { return new Promise(resolve => w.end(chunk, encoding, () => resolve())); }
exports.end = end;
function fchmod(fd, mode) { return promisify(fs.fchmod, arguments); }
exports.fchmod = fchmod;
function fchown(fd, uid, gid) { return promisify(fs.fchown, arguments); }
exports.fchown = fchown;
function fstat(fd) { return promisify(fs.fstat, arguments); }
exports.fstat = fstat;
function ftruncate(fd, len) { return promisify(fs.ftruncate, arguments); }
exports.ftruncate = ftruncate;
function futimes(fd, atime, mtime) { return promisify(fs.futimes, arguments); }
exports.futimes = futimes;
function fsync(fd) { return promisify(fs.fsync, arguments); }
exports.fsync = fsync;
function lchmod(path, mode) { return promisify(fs.lchmod, arguments); }
exports.lchmod = lchmod;
function lchown(path, uid, gid) { return promisify(fs.lchown, arguments); }
exports.lchown = lchown;
function link(srcpath, dstpath) { return promisify(fs.link, arguments); }
exports.link = link;
function lstat(path) { return promisify(fs.lstat, arguments); }
exports.lstat = lstat;
function mkdir(path, mode) { return promisify(fs.mkdir, arguments); }
exports.mkdir = mkdir;
function mkdtemp(path, encoding) { return promisify(fs.mkdtemp, arguments); }
exports.mkdtemp = mkdtemp;
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
function open(path, flags, mode) { return promisify(fs.open, arguments); }
exports.open = open;
function read(fd, buffer, offset, length, position) { return promisify(fs.read, arguments, null, function () { return { bytesRead: arguments[1], buffer: arguments[2] }; }); }
exports.read = read;
function readdir(path) { return promisify(fs.readdir, arguments); }
exports.readdir = readdir;
function readFile(file, options) { return promisify(fs.readFile, arguments); }
exports.readFile = readFile;
function readlink(path) { return promisify(fs.readlink, arguments); }
exports.readlink = readlink;
function realpath(path, cache) { return promisify(fs.realpath, arguments); }
exports.realpath = realpath;
function rename(oldPath, newPath) { return promisify(fs.rename, arguments); }
exports.rename = rename;
function rmdir(path) { return promisify(fs.rmdir, arguments); }
exports.rmdir = rmdir;
function stat(path) { return promisify(fs.stat, arguments); }
exports.stat = stat;
function symlink(srcpath, dstpath, type) { return promisify(fs.symlink, arguments); }
exports.symlink = symlink;
function truncate(path, len) { return promisify(fs.truncate, arguments); }
exports.truncate = truncate;
function unlink(path) { return promisify(fs.unlink, arguments); }
exports.unlink = unlink;
function utimes(path, atime, mtime) { return promisify(fs.utimes, arguments); }
exports.utimes = utimes;
function write(fd) { return promisify(fs.write, arguments, null, function () { return { written: arguments[1], buffer: arguments[2] }; }); }
exports.write = write;
function writeFile(file, data, options) { return promisify(fs.writeFile, arguments); }
exports.writeFile = writeFile;
function readTextFile(file, encoding, flags) {
    if (encoding === undefined)
        encoding = 'utf8';
    if (flags === undefined || flags === null)
        flags = 'r';
    return promisify(fs.readFile, [file, { encoding: encoding, flags: flags }]);
}
exports.readTextFile = readTextFile;
function writeTextFile(file, data, encoding, flags, mode) {
    if (encoding === undefined)
        encoding = 'utf8';
    if (flags === undefined || flags === null)
        flags = 'w';
    var options = { encoding: encoding, flags: flags, mode: mode };
    if (flags[0] === 'a')
        return promisify(fs.appendFile, [file, data, options]);
    else
        return promisify(fs.writeFile, [file, data, options]);
}
exports.writeTextFile = writeTextFile;
function createDirectory(path, mode = 0o777) {
    return new Promise((resolve, reject) => mkdirp(path, mode, err => !err ? resolve() : reject(err)));
}
exports.createDirectory = createDirectory;
exports.mkdirp = createDirectory;
function del(path) {
    return new Promise((resolve, reject) => rimraf(path, err => !err ? resolve() : reject(err)));
}
exports.delete = del;
exports.rimraf = del;
function exists(path) {
    return new Promise((resolve, reject) => fs.lstat(path, err => !err ? resolve(true) : err.code === 'ENOENT' ? resolve(false) : reject(err)));
}
exports.exists = exists;
function mkdirp(path, mode = 0o777, done) {
    path = pathutil.resolve(path);
    fs.mkdir(path, mode, err => {
        if (!err)
            done(null);
        else if (err.code === 'ENOENT')
            mkdirp(pathutil.dirname(path), mode, err => !err ? mkdirp(path, mode, done) : done(err));
        else
            fs.stat(path, (err, stat) => err ? done(err) : !stat.isDirectory() ? done(new Error(path + ' is already a file')) : done(null));
    });
}
function promisify(target, args, context, resolver) {
    return new Promise((resolve, reject) => {
        target.apply(context, Array.prototype.slice.call(args).concat([(err, result) => {
                if (err)
                    reject(err);
                else if (resolver)
                    resolve(resolver.apply(context, arguments));
                else
                    resolve(result);
            }]));
    });
}
//# sourceMappingURL=index.js.map