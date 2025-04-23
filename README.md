#   API Documentation

Общие замечания:

* Предполагается, что API работает по адресу `http://localhost:3000`.
* Все запросы, отправляющие данные (POST, PUT), должны иметь заголовок `Content-Type: application/json`.
* Авторизация осуществляется через заголовок `Authorization: Bearer <token>`, где `<token>` - это JWT, полученный после успешной аутентификации (`POST /auth/login`).
* Коды ошибок 4xx и 5xx возвращают JSON в формате:

    ```json
    {
        "error": "Сообщение об ошибке"
    }
    ```

---

##   1. Аутентификация

###   Login

* **URL:** `/auth/login`
* **Method:** `POST`
* **Description:** Аутентифицирует пользователя и возвращает JWT.
* **Authorization:** None
* **Parameters:**
    * **Body:**

        ```json
        {
            "email": "user@example.com",
            "password": "password123"
        }
        ```

* **Response:**
    * **Code:** `200 OK`

        ```json
        {
            "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
        }
        ```

    * **Code:** `401 Unauthorized`

        ```json
        {
            "error": "Invalid credentials"
        }
        ```

    * **Code:** `500 Internal Server Error`

        ```json
        {
            "error": "Internal Server Error"
        }
        ```

---

##   2. Users

###   Get All Users

* **URL:** `/users`
* **Method:** `GET`
* **Description:** Retrieves a list of all users.
* **Authorization:** `Bearer <token>`
* **Parameters:** None
* **Response:**
    * **Code:** `200 OK`

        ```json
        [
            {
                "id": 1,
                "role": "athlete",
                "name": "John Doe",
                "email": "john.doe@example.com"
            },
            {
                "id": 2,
                "role": "organizer",
                "name": "Jane Smith",
                "email": "jane.smith@example.com"
            }
        ]
        ```

    * **Code:** `401 Unauthorized`

        ```json
        {
            "error": "No token provided"
        }
        ```

    * **Code:** `500 Internal Server Error`

        ```json
        {
            "error": "Internal Server Error"
        }
        ```

###   Get User by ID

* **URL:** `/users/:id`
* **Method:** `GET`
* **Description:** Retrieves a user by their ID.
* **Authorization:** `Bearer <token>`
* **Parameters:**
    * `id` (Path parameter): User ID (integer)
* **Response:**
    * **Code:** `200 OK`

        ```json
        {
            "id": 1,
            "role": "athlete",
            "name": "John Doe",
            "email": "john.doe@example.com"
        }
        ```

    * **Code:** `404 Not Found`

        ```json
        {
            "error": "User not found"
        }
        ```

    * **Code:** `401 Unauthorized` (если требуется авторизация)

        ```json
        {
            "error": "No token provided"
        }
        ```

    * **Code:** `500 Internal Server Error`

        ```json
        {
            "error": "Internal Server Error"
        }
        ```

###   Create User

* **URL:** `/users`
* **Method:** `POST`
* **Description:** Creates a new user.
* **Authorization:** None
* **Parameters:**
    * **Body:**

        ```json
        {
            "role": "athlete",
            "name": "New User",
            "email": "new.user@example.com",
            "password": "password123"
        }
        ```

* **Response:**
    * **Code:** `201 Created`

        ```json
        {
            "id": 3,
            "role": "athlete",
            "name": "New User",
            "email": "new.user@example.com"
        }
        ```

    * **Code:** `400 Bad Request`

        ```json
        {
            "error": "Name is required"
        }
        ```

    * **Code:** `500 Internal Server Error`

        ```json
        {
            "error": "Internal Server Error"
        }
        ```

###   Update User

* **URL:** `/users/:id`
* **Method:** `PUT`
* **Description:** Updates an existing user.
* **Authorization:** `Bearer <token>`
* **Parameters:**
    * `id` (Path parameter): User ID (integer)
    * **Body:** (Fields to update, all optional)

        ```json
        {
            "name": "Updated User Name",
            "email": "updated.email@example.com",
            "password": "newpassword456"
        }
        ```

* **Response:**
    * **Code:** `200 OK`

        ```json
        {
            "id": 3,
            "role": "athlete",
            "name": "Updated User Name",
            "email": "updated.email@example.com"
        }
        ```

    * **Code:** `400 Bad Request`

        ```json
        {
            "error": "Invalid email format"
        }
        ```

    * **Code:** `404 Not Found`

        ```json
        {
            "error": "User not found"
        }
        ```

    * **Code:** `401 Unauthorized`

        ```json
        {
            "error": "No token provided"
        }
        ```

    * **Code:** `500 Internal Server Error`

        ```json
        {
            "error": "Internal Server Error"
        }
        ```

###   Delete User

* **URL:** `/users/:id`
* **Method:** `DELETE`
* **Description:** Deletes a user.
* **Authorization:** `Bearer <token>`
* **Parameters:**
    * `id` (Path parameter): User ID (integer)
* **Response:**
    * **Code:** `204 No Content` (Успешное удаление, нет тела ответа)

    * **Code:** `404 Not Found`

        ```json
        {
            "error": "User not found"
        }
        ```

    * **Code:** `401 Unauthorized`

        ```json
        {
            "error": "No token provided"
        }
        ```

    * **Code:** `500 Internal Server Error`

        ```json
        {
            "error": "Internal Server Error"
        }
        ```

---

##   3. Events

###   Get All Events

* **URL:** `/events`
* **Method:** `GET`
* **Description:** Retrieves a list of all events.
* **Authorization:** None
* **Parameters:** None
* **Response:**
    * **Code:** `200 OK`

        ```json
        [
            {
                "id": 1,
                "title": "Coding Competition",
                "description": "A coding competition for all skill levels.",
                "start_date": "2025-05-10T10:00:00.000Z",
                "end_date": "2025-05-12T18:00:00.000Z",
                "discipline": "Algorithm",
                "format": "Open"
            },
            {
                "id": 2,
                "title": "Regional Hackathon",
                "description": "A 24-hour hackathon for developers in the region.",
                "start_date": "2025-06-01T00:00:00.000Z",
                "end_date": "2025-06-02T00:00:00.000Z",
                "discipline": "Web Development",
                "format": "Regional"
            }
        ]
        ```

    * **Code:** `500 Internal Server Error`

        ```json
        {
            "error": "Internal Server Error"
        }
        ```

###   Get Event by ID

* **URL:** `/events/:id`
* **Method:** `GET`
* **Description:** Retrieves an event by its ID.
* **Authorization:** None
* **Parameters:**
    * `id` (Path parameter): Event ID (integer)
* **Response:**
    * **Code:** `200 OK`

        ```json
        {
            "id": 1,
            "title": "Coding Competition",
            "description": "A coding competition for all skill levels.",
            "start_date": "2025-05-10T10:00:00.000Z",
            "end_date": "2025-05-12T18:00:00.000Z",
            "discipline": "Algorithm",
            "format": "Open"
        }
        ```

    * **Code:** `404 Not Found`

        ```json
        {
            "error": "Event not found"
        }
        ```

    * **Code:** `500 Internal Server Error`

        ```json
        {
            "error": "Internal Server Error"
        }
        ```

###   Create Event

* **URL:** `/events`
* **Method:** `POST`
* **Description:** Creates a new event.
* **Authorization:** `Bearer <token>`, `Role: admin` or `organizer`
* **Parameters:**
    * **Body:**

        ```json
        {
            "title": "New Event",
            "description": "Description of the new event.",
            "start_date": "2025-07-01T10:00:00.000Z",
            "end_date": "2025-07-03T18:00:00.000Z",
            "discipline": "AI",
            "format": "Open",
            "organizer_id": 1 //  ID of the user creating the event
        }
        ```

* **Response:**
    * **Code:** `201 Created`

        ```json
        {
            "id": 3,
            "title": "New Event",
            "description": "Description of the new event.",
            "start_date": "2025-07-01T10:00:00.000Z",
            "end_date": "2025-07-03T18:00:00.000Z",
            "discipline": "AI",
            "format": "Open",
            "organizer_id": 1
        }
        ```

    * **Code:** `400 Bad Request`

        ```json
        {
            "error": "Title is required"
        }
        ```

    * **Code:** `401 Unauthorized`

        ```json
        {
            "error": "No token provided"
        }
        ```

    * **Code:** `403 Forbidden`

        ```json
        {
            "error": "Unauthorized"
        }
        ```

    * **Code:** `500 Internal Server Error`

        ```json
        {
            "error": "Internal Server Error"
        }
        ```

###   Update Event

* **URL:** `/events/:id`
* **Method:** `PUT`
* **Description:** Updates an existing event.
* **Authorization:** `Bearer <token>`, `Role: admin` or `organizer`
* **Parameters:**
    * `id` (Path parameter): Event ID (integer)
    * **Body:** (Fields to update, all optional)

        ```json
        {
            "title": "Updated Event Title",
            "description": "Updated description.",
            "start_date": "2025-07-02T10:00:00.000Z"
        }
        ```

* **Response:**
    * **Code:** `200 OK`

        ```json
        {
            "id": 3,
            "title": "Updated Event Title",
            "description": "Updated description.",
            "start_date": "2025-07-02T10:00:00.000Z",
            "discipline": "AI",
            "format": "Open",
            "organizer_id": 1
        }
        ```

    * **Code:** `400 Bad Request`

        ```json
        {
            "error": "Invalid date format"
        }
        ```

    * **Code:** `404 Not Found`

        ```json
        {
            "error": "Event not found"
        }
        ```

    * **Code:** `401 Unauthorized`

        ```json
        {
            "error": "No token provided"
        }
        ```

    * **Code:** `403 Forbidden`

        ```json
        {
            "error": "Unauthorized"
        }
        ```

    * **Code:** `500 Internal Server Error`

        ```json
        {
            "error": "Internal Server Error"
        }
        ```

###   Delete Event

* **URL:** `/events/:id`
* **Method:** `DELETE`
* **Description:** Deletes an event.
* **Authorization:** `Bearer <token>`, `Role: admin`
* **Parameters:**
    * `id` (Path parameter): Event ID (integer)
* **Response:**
    * **Code:** `204 No Content`

    * **Code:** `404 Not Found`

        ```json
        {
            "error": "Event not found"
        }
        ```

    * **Code:** `401 Unauthorized`

        ```json
        {
            "error": "No token provided"
        }
        ```

    * **Code:** `403 Forbidden`

        ```json
        {
            "error": "Unauthorized"
        }
        ```

    * **Code:** `500 Internal Server Error`

        ```json
        {
            "error": "Internal Server Error"
        }
        ```

---

---

##   4. Applications

###   Get All Applications

* **URL:** `/applications`
* **Method:** `GET`
* **Description:** Retrieves a list of all applications.
* **Authorization:** `Bearer <token>`
* **Parameters:** None
* **Response:**
    * **Code:** `200 OK`

        ```json
        [
            {
                "id": 1,
                "event_id": 1,
                "team_id": 1,
                "user_id": 2,
                "status": "pending",
                "created_at": "2025-04-28T12:00:00.000Z",
                "updated_at": "2025-04-28T12:00:00.000Z"
            },
            {
                "id": 2,
                "event_id": 1,
                "team_id": null,
                "user_id": 3,
                "status": "approved",
                "created_at": "2025-04-29T10:00:00.000Z",
                "updated_at": "2025-04-29T14:00:00.000Z"
            }
        ]
        ```

    * **Code:** `401 Unauthorized`

        ```json
        {
            "error": "No token provided"
        }
        ```

    * **Code:** `500 Internal Server Error`

        ```json
        {
            "error": "Internal Server Error"
        }
        ```

###   Get Application by ID

* **URL:** `/applications/:id`
* **Method:** `GET`
* **Description:** Retrieves an application by its ID.
* **Authorization:** `Bearer <token>`
* **Parameters:**
    * `id` (Path parameter): Application ID (integer)
* **Response:**
    * **Code:** `200 OK`

        ```json
        {
            "id": 1,
            "event_id": 1,
            "team_id": 1,
            "user_id": 2,
            "status": "pending",
            "created_at": "2025-04-28T12:00:00.000Z",
            "updated_at": "2025-04-28T12:00:00.000Z"
        }
        ```

    * **Code:** `404 Not Found`

        ```json
        {
            "error": "Application not found"
        }
        ```

    * **Code:** `401 Unauthorized`

        ```json
        {
            "error": "No token provided"
        }
        ```

    * **Code:** `500 Internal Server Error`

        ```json
        {
            "error": "Internal Server Error"
        }
        ```

###   Create Application

* **URL:** `/applications`
* **Method:** `POST`
* **Description:** Creates a new application.
* **Authorization:** `Bearer <token>`
* **Parameters:**
    * **Body:**

        ```json
        {
            "event_id": 1,
            "team_id": null,  //  Can be null for individual applications
            "user_id": 3,
            "status": "pending"
        }
        ```

* **Response:**
    * **Code:** `201 Created`

        ```json
        {
            "id": 3,
            "event_id": 1,
            "team_id": null,
            "user_id": 3,
            "status": "pending",
            "created_at": "2025-04-30T09:00:00.000Z",
            "updated_at": "2025-04-30T09:00:00.000Z"
        }
        ```

    * **Code:** `400 Bad Request`

        ```json
        {
            "error": "Event ID is required"
        }
        ```

    * **Code:** `401 Unauthorized`

        ```json
        {
            "error": "No token provided"
        }
        ```

    * **Code:** `500 Internal Server Error`

        ```json
        {
            "error": "Internal Server Error"
        }
        ```

###   Update Application

* **URL:** `/applications/:id`
* **Method:** `PUT`
* **Description:** Updates an existing application.
* **Authorization:** `Bearer <token>`
* **Parameters:**
    * `id` (Path parameter): Application ID (integer)
    * **Body:** (Fields to update, all optional)

        ```json
        {
            "status": "approved"
        }
        ```

* **Response:**
    * **Code:** `200 OK`

        ```json
        {
            "id": 3,
            "event_id": 1,
            "team_id": null,
            "user_id": 3,
            "status": "approved",
            "created_at": "2025-04-30T09:00:00.000Z",
            "updated_at": "2025-04-30T09:00:00.000Z"
        }
        ```

    * **Code:** `400 Bad Request`

        ```json
        {
            "error": "Invalid status value"
        }
        ```

    * **Code:** `404 Not Found`

        ```json
        {
            "error": "Application not found"
        }
        ```

    * **Code:** `401 Unauthorized`

        ```json
        {
            "error": "No token provided"
        }
        ```

    * **Code:** `500 Internal Server Error`

        ```json
        {
            "error": "Internal Server Error"
        }
        ```

###   Delete Application

* **URL:** `/applications/:id`
* **Method:** `DELETE`
* **Description:** Deletes an application.
* **Authorization:** `Bearer <token>`
* **Parameters:**
    * `id` (Path parameter): Application ID (integer)
* **Response:**
    * **Code:** `204 No Content`

    * **Code:** `404 Not Found`

        ```json
        {
            "error": "Application not found"
        }
        ```

    * **Code:** `401 Unauthorized`

        ```json
        {
            "error": "No token provided"
        }
        ```

    * **Code:** `500 Internal Server Error`

        ```json
        {
            "error": "Internal Server Error"
        }
        ```

---

##   5. Teams

###   Get All Teams

* **URL:** `/teams`
* **Method:** `GET`
* **Description:** Retrieves a list of all teams.
* **Authorization:** `Bearer <token>`
* **Parameters:** None
* **Response:**
    * **Code:** `200 OK`

        ```json
        [
            {
                "id": 1,
                "name": "The Coders",
                "captain_id": 2,
                "event_id": 1,
                "description": "A team of experienced coders.",
                "created_at": "2025-04-27T15:00:00.000Z",
                "updated_at": "2025-04-27T15:00:00.000Z"
            },
            {
                "id": 2,
                "name": "The Algos",
                "captain_id": 3,
                "event_id": 1,
                "description": "A team focused on algorithms.",
                "created_at": "2025-04-28T09:00:00.000Z",
                "updated_at": "2025-04-28T09:00:00.000Z"
            }
        ]
        ```

    * **Code:** `401 Unauthorized`

        ```json
        {
            "error": "No token provided"
        }
        ```

    * **Code:** `500 Internal Server Error`

        ```json
        {
            "error": "Internal Server Error"
        }
        ```

###   Get Team by ID

* **URL:** `/teams/:id`
* **Method:** `GET`
* **Description:** Retrieves a team by its ID.
* **Authorization:** `Bearer <token>`
* **Parameters:**
    * `id` (Path parameter): Team ID (integer)
* **Response:**
    * **Code:** `200 OK`

        ```json
        {
            "id": 1,
            "name": "The Coders",
            "captain_id": 2,
            "event_id": 1,
            "description": "A team of experienced coders.",
            "created_at": "2025-04-27T15:00:00.000Z",
            "updated_at": "2025-04-27T15:00:00.000Z"
        }
        ```

    * **Code:** `404 Not Found`

        ```json
        {
            "error": "Team not found"
        }
        ```

    * **Code:** `401 Unauthorized`

        ```json
        {
            "error": "No token provided"
        }
        ```

    * **Code:** `500 Internal Server Error`

        ```json
        {
            "error": "Internal Server Error"
        }
        ```

###   Create Team

* **URL:** `/teams`
* **Method:** `POST`
* **Description:** Creates a new team.
* **Authorization:** `Bearer <token>`
* **Parameters:**
    * **Body:**

        ```json
        {
            "name": "New Team",
            "captain_id": 3,  //  ID of the team captain (must exist)
            "event_id": 2,    //  ID of the event the team is participating in (must exist)
            "description": "Description of the new team."
        }
        ```

* **Response:**
    * **Code:** `201 Created`

        ```json
        {
            "id": 3,
            "name": "New Team",
            "captain_id": 3,
            "event_id": 2,
            "description": "Description of the new team.",
            "created_at": "2025-05-01T10:00:00.000Z",
            "updated_at": "2025-05-01T10:00:00.000Z"
        }
        ```

    * **Code:** `400 Bad Request`

        ```json
        {
            "error": "Name is required"
        }
        ```

    * **Code:** `401 Unauthorized`

        ```json
        {
            "error": "No token provided"
        }
        ```

    * **Code:** `500 Internal Server Error`

        ```json
        {
            "error": "Internal Server Error"
        }
        ```

###   Update Team

* **URL:** `/teams/:id`
* **Method:** `PUT`
* **Description:** Updates an existing team.
* **Authorization:** `Bearer <token>`
* **Parameters:**
    * `id` (Path parameter): Team ID (integer)
    * **Body:** (Fields to update, all optional)

        ```json
        {
            "name": "Updated Team Name",
            "description": "Updated description."
        }
        ```

* **Response:**
    * **Code:** `200 OK`

        ```json
        {
            "id": 3,
            "name": "Updated Team Name",
            "captain_id": 3,
            "event_id": 2,
            "description": "Updated description.",
            "created_at": "2025-05-01T10:00:00.000Z",
            "updated_at": "2025-05-01T12:00:00.000Z"
        }
        ```

    * **Code:** `400 Bad Request`

        ```json
        {
            "error": "Name is required"
        }
        ```

    * **Code:** `404 Not Found`

        ```json
        {
            "error": "Team not found"
        }
        ```

    * **Code:** `401 Unauthorized`

        ```json
        {
            "error": "No token provided"
        }
        ```

    * **Code:** `500 Internal Server Error`

        ```json
        {
            "error": "Internal Server Error"
        }
        ```

###   Delete Team

* **URL:** `/teams/:id`
* **Method:** `DELETE`
* **Description:** Deletes a team.
* **Authorization:** `Bearer <token>`
* **Parameters:**
    * `id` (Path parameter): Team ID (integer)
* **Response:**
    * **Code:** `204 No Content`

    * **Code:** `404 Not Found`

        ```json
        {
            "error": "Team not found"
        }
        ```

    * **Code:** `401 Unauthorized`

        ```json
        {
            "error": "No token provided"
        }
        ```

    * **Code:** `500 Internal Server Error`

        ```json
        {
            "error": "Internal Server Error"
        }
        ```

###   Get Team Members

* **URL:** `/teams/:id/members`
* **Method:** `GET`
* **Description:** Retrieves a list of members of a team.
* **Authorization:** `Bearer <token>`
* **Parameters:**
    * `id` (Path parameter): Team ID (integer)
* **Response:**
    * **Code:** `200 OK`

        ```json
        [
            {
                "id": 2,
                "role": "athlete",
                "name": "John Doe",
                "email": "john.doe@example.com"
            },
            {
                "id": 4,
                "role": "athlete",
                "name": "Alice Wonderland",
                "email": "alice@example.com"
            }
        ]
        ```

    * **Code:** `404 Not Found`

        ```json
        {
            "error": "Team not found"
        }
        ```

    * **Code:** `401 Unauthorized`

        ```json
        {
            "error": "No token provided"
        }
        ```

    * **Code:** `500 Internal Server Error`

        ```json
        {
            "error": "Internal Server Error"
        }
        ```

###   Add Team Member

* **URL:** `/teams/:id/members`
* **Method:** `POST`
* **Description:** Adds a member to a team.
* **Authorization:** `Bearer <token>`
* **Parameters:**
    * `id` (Path parameter): Team ID (integer)
    * **Body:**

        ```json
        {
            "user_id": 5  //  ID of the user to add to the team
        }
        ```

* **Response:**
    * **Code:** `201 Created`

    * **Code:** `404 Not Found`

        ```json
        {
            "error": "Team not found"
        }
        ```

    * **Code:** `400 Bad Request`

        ```json
        {
            "error": "User not found"
        }
        ```

    * **Code:** `401 Unauthorized`

        ```json
        {
            "error": "No token provided"
        }
        ```

    * **Code:** `500 Internal Server Error`

        ```json
        {
            "error": "Internal Server Error"
        }
        ```

###   Remove Team Member

* **URL:** `/teams/:id/members`
* **Method:** `DELETE`
* **Description:** Removes a member