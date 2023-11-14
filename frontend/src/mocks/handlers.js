import { rest } from "msw";

const baseURL = "http://localhost:8000/";

export const handlers = [
  rest.get(`${baseURL}dj-rest-auth/user/`, (req, res, ctx) => {
    return res(
      ctx.json({
        pk: 1,
        username: "admin",
        email: "",
        first_name: "",
        last_name: "",
        profile_id: 1,
        profile_image:
          "https://res.cloudinary.com/dy6ugjuru/image/upload/v1/media/images/mushroom_hh1hfn",
      })
    );
  }),
  rest.post(`${baseURL}dj-rest-auth/logout/`, (req, res, ctx) => {
    return res(ctx.status(200));
  }),
];
