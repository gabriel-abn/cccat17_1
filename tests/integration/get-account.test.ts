import type { AccountProps } from "@/domain/account";
import server from "@/main/app/app";
import { faker } from "@faker-js/faker";
import RandExp from "randexp";
import request from "supertest";

describe("SignUp", () => {
  let user: AccountProps;

  beforeEach(() => {
    user = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: "Password123!@",
      accountId: "",
      carPlate: new RandExp(/[A-Z]{3}\d{4}/).gen(),
      cpf: faker.helpers.arrayElement([
        "97456321558",
        "71428793860",
        "87748248800",
      ]),
      isDriver: true,
      isPassenger: false,
    };
  });

  it("Deve retornar uma conta", async () => {
    const signUpResponse = await request(server)
      .post("/api/v1/account/sign-up")
      .send({ ...user });

    const getAccountResponse = await request(server).get(
      `/api/v1/account/${signUpResponse.body.accountId}`,
    );

    expect(getAccountResponse.body).toHaveProperty("accountId");
    expect(getAccountResponse.body.email).toBe(user.email);
  });

  it("Deve retornar 400 se a conta não existir", async () => {
    const getAccountResponse = await request(server).get(
      `/api/v1/account/${crypto.randomUUID()}`,
    );

    expect(getAccountResponse.status).toBe(404);
    expect(getAccountResponse.body).toHaveProperty(
      "error",
      "ACCOUNT_NOT_FOUND",
    );
  });
});
