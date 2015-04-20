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

Run 'taco-mon <command> -h' to view usage for a specific command
```

Also see the `usage/` folder

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
