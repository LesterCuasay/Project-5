# __Testing__

Head back to the [README.md](README.md) file.

&nbsp;
## __Table of Contents__
- [Automated Jest Testing Results](#automated-jest-testing-results)

### __Automated Jest Testing Results__

Jest was setup by adding the below code to the [setupTests.js](https://github.com/LesterCuasay/Project-5/blob/main/frontend/src/setupTests.js) to utilise the mocks/handler.js file to simulate users logging in and logging out. The code stated below starts a simulated browser and shits it down after each test is run. The handler.js creates a user object and accesses the base url and dj-rest-auth/logout/ to test user authentication.

```js
import "@testing-library/jest-dom";
import { setupServer } from "msw/node";
import { handlers } from "./mocks/handlers";

const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

Although, as my project is unified to get the tests to pass a few changes has to be made in various files:

[axiosDefaults.js](https://github.com/LesterCuasay/Project-5/blob/main/frontend/src/api/axiosDefaults.js) line 3:

```js
// axios.defaults.baseURL = "/api";
axios.defaults.baseURL = "http://localhost:8000/";
```

[settings.py](https://github.com/LesterCuasay/Project-5/blob/main/taskmaster_api/settings.py) line 124:

```py
'DIRS': []
# 'DIRS': [os.path.join(BASE_DIR, 'staticfiles', 'build')],,
```

[urls.py](https://github.com/LesterCuasay/Project-5/blob/main/taskmaster_api/urls.py) line 22:

```py
urlpatterns = [
    path('', root_route),
    path('admin/', admin.site.urls),
    path('api-auth/', include('rest_framework.urls')),
    path('dj-rest-auth/logout/', logout_route),
    path('dj-rest-auth/', include('dj_rest_auth.urls')),
    path(
        'dj-rest-auth/registration/',
        include('dj_rest_auth.registration.urls')
    ),
    path('', include('profiles.urls')),
    path('', include('tasks.urls')),
    path('', include('notes.urls')),
    path('', include('followers.urls')),
    path('', include('favourites.urls')),
]
```

After these changes the tests will pass, this was the only fix I could find to get the tests to pass as because my project in development runs using localhost:8000.

- I created 3 tests utilising the Jest testing suite, all of the tests is for [NavBar.test.js](https://github.com/LesterCuasay/Project-5/blob/main/frontend/src/components/__tests__/NavBar.test.js) the test is to see if the correct navigation links are shown to a logged in user versus a logged out user.

Test results:

![navbar-test](documentation/testing/navbar-test.png)