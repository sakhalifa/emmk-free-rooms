# free-rooms-emmk

First, you need to setup those environment variables:

| Keys              | Description                                                                            |
| ----------------- | -------------------------------------------------------------------------------------- |
| CAS_LOGIN         | The login used to authenticate to Bordeaux-INP CAS                                     |
| CAS_PASSWORD      | The password used to authenticate to Bordeaux-INP CAS                                  |
| CLEAN_FETCH_TIMER | When the worker will check which keys to delete from the fetch cache. In milliseconds. |
| CLEAN_USERS_TIMER | When the worker will check which keys are null to delete from the user cache. In ms.   |
