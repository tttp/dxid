import test from "ava";

test("id is a number and it's weird  above maxSafeInteger", (t) => {
  t.is(typeof 1984, "number");
  t.true(Number.isSafeInteger(Number.MAX_SAFE_INTEGER - 1));
  t.true(Number.isSafeInteger(Number.MAX_SAFE_INTEGER));
  t.false(Number.isSafeInteger(Number.MAX_SAFE_INTEGER + 1));
  t.is(Number.MAX_SAFE_INTEGER, 9007199254740991);
  t.is(Number.MAX_SAFE_INTEGER + 1, 9007199254740992);
  t.is(Number.MAX_SAFE_INTEGER + 2, 9007199254740992);
  // biome-ignore lint/correctness/noPrecisionLoss: ignore
  t.is(9007199254740993, 9007199254740992);
});
