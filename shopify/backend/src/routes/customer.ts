/*
 * Copyright (c) TIKI Inc.
 * MIT license. See LICENSE file in root directory.
 */

export async function dataRequest(): Promise<Response> {
  return new Response(null, {
    status: 200,
  });
}

export async function redact(): Promise<Response> {
  return new Response(null, {
    status: 200,
  });
}
