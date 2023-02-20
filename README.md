# free-rooms-emmk

## Cloning the repository

This repository uses a submodule. It is therefore really appreciated if you use the option `--recurse` when cloning...

## Environment variables

| Keys              | Description                                                                            |
| ----------------- | -------------------------------------------------------------------------------------- |
| CAS_LOGIN         | The login used to authenticate to Bordeaux-INP CAS                                     |
| CAS_PASSWORD      | The password used to authenticate to Bordeaux-INP CAS                                  |
| CLEAN_FETCH_TIMER | When the worker will check which keys to delete from the fetch cache. In milliseconds. |
| CLEAN_USERS_TIMER | When the worker will check which keys are null to delete from the user cache. In ms.   |

## Installation

Either do it manually, or use the script [createDockerImage.sh](createDockerImage.sh) to create a clean docker image.
The docker image will always launch the server on its local port 8000, it's up to you to map it to another port.
