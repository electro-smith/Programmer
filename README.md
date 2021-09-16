# Programmer

WebUSB programmer for Daisy (and other DFU-compatible chips/boards).

Largely based on the webdfu page set up for STM32F103 boards made by devanlai:
https://github.com/devanlai/webdfu -- https://devanlai.github.io/webdfu

## Use

The programmer can flash user-uploaded binary files or select from a pre-compiled list.

To use the programmer, go to this page:

[https://electro-smith.github.io/Programmer/](https://electro-smith.github.io/Programmer/)

and follow the on-page instructions.

## Local Test

To set this app up on a local network, you can use the util/ folder resources.

a run.sh script is included in the root level of the repo. 

However, it is recommended that you run this script from one level outside of the Programmer folder so that the URL patterns are the same as when deployed on electro-smith.github.io

The run script will start the server at `https://localhost:9001/`

With the server started you can access the local version of the programmer at:

[https://localhost:9001/Programmer](https://localhost:9001/Programmer)

