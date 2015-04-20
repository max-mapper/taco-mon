# taco-mon

[![NPM](https://nodei.co/npm/taco-mon.png)](https://nodei.co/npm/taco-mon/)

A CLI deployment and process monitoring tool, part of the [taco](https://github.com/maxogden/taco) modular deployment system for unix.

Uses the [mon](https://github.com/tj/mon) process monitor, written in C. Lets you manage and deploy processes from tarball streams.

## installation

```
npm install taco-mon -g
```

## usage

```
Usage: taco-mon <command>

Commands:

start            start a process by name
stop             stop a process by name
restart          stop and start a process by name
deploy           deploy a new process from a tarball
status           get the status of all processes
link             symlink an external program into the taco deploys folder

Run 'taco-mon <command> -h' to view usage for a specific command
```

The `usage/` folder has full use for each command

### `taco-mon deploy`

Pipe a tarball into this and supply a path as the first argument. The tarball will be unpacked into a `versions/<name>-<timestamp>` folder in the path you specified, symlinked to `deploys/<name>`, and then `taco-mon restart` will be run for you

You may pass any options for `taco-mon start` to this command

### `taco-mon start`

Starts a process by name. Skips if the process is already started.

Options

```
--start-with              prefix the start command with a string
--start-prefix            alias for --start-with
--on-error                execute <cmd> on error
--on-restart              execute <cmd> on restarts
--sleep                   sleep seconds before re-executing [1]
--attempts                retry attempts within 60 seconds [10]
--prefix                  add a log prefix
--logfile                 specify logfile [<name>.log]
--pidfile                 write program pid to file [<name>.pid]
--mon-pidfile             write mon pid to file [<name>.mon.pid]
--mon                     specify a custom mon executable to use
```

## example

Pack up your app and move the tarball to your server somehow:

```
$ taco-pack . > myapp.tar.gz
```

on server:

```
$ cat myapp.tar.gz | taco-build "npm install --production" | taco-mon deploy .
```

`taco-mon` will deploy and start your process. You can then run `taco-mon status` to view your process status.
