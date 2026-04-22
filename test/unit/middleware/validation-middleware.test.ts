import { validateDirector } from "../../../src/middlewares/validation-middleware";
import { HttpError } from "../../../src/errors/http-error";
import { jest, expect, test } from "@jest/globals";

test("Should call next with HttpError 400 if name is too short", () => {
  const req = { body: { name: "Ab" } } as any;
  const res = {} as any;
  const next = jest.fn();

  validateDirector(req, res, next);

  expect(next).toHaveBeenCalledWith(expect.any(HttpError));

  expect(next).toHaveBeenCalledWith(
    expect.objectContaining({ statusCode: 400 }),
  );
});
