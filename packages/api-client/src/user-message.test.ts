import { describe, expect, it } from "vitest";

import { ApiClientError } from "./error";
import { getErrorCode, toUserMessage } from "./user-message";

describe("user messages", () => {
  it("maps known ApiClientError codes", () => {
    expect(
      toUserMessage(
        new ApiClientError("Unauthorized", {
          code: "UNAUTHORIZED",
          status: 401,
        }),
      ),
    ).toBe("Vous devez être connecté.");
  });

  it("falls back to status messages for unknown ApiClientError codes", () => {
    expect(
      toUserMessage(
        new ApiClientError("Unknown", {
          code: "UNKNOWN_CODE",
          status: 403,
        }),
      ),
    ).toBe("Vous n'avez pas accès à cette ressource.");
  });

  it("falls back to status messages for plain errors", () => {
    expect(toUserMessage({ status: 503 })).toBe(
      "Le service est temporairement indisponible.",
    );
  });

  it("extracts direct error codes", () => {
    const error = { code: "NETWORK_ERROR" };

    expect(getErrorCode(error)).toBe("NETWORK_ERROR");
    expect(toUserMessage(error)).toBe("Impossible de contacter le serveur.");
  });

  it("extracts nested auth error codes", () => {
    const error = { error: { code: "INVALID_EMAIL_OR_PASSWORD" } };

    expect(getErrorCode(error)).toBe("INVALID_EMAIL_OR_PASSWORD");
    expect(toUserMessage(error)).toBe("Email ou mot de passe invalide.");
  });

  it("maps aborted requests", () => {
    expect(
      toUserMessage(
        new ApiClientError("Request aborted.", {
          code: "REQUEST_ABORTED",
          status: 0,
        }),
      ),
    ).toBe("La requête a été annulée.");
  });

  it("maps raw fetch network errors", () => {
    expect(toUserMessage(new TypeError("Failed to fetch"))).toBe(
      "Impossible de contacter le serveur.",
    );
  });

  it("uses the default message for unknown errors", () => {
    expect(toUserMessage(new Error("Unexpected"))).toBe(
      "Une erreur est survenue. Réessayez dans un instant.",
    );
  });
});
