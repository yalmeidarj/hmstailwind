import { auth } from '@clerk/nextjs';

interface PostInput {
  url: string;
  body?: string;
  headers?: {};
  addAuth?: boolean;
}

interface GetInput {
  url: string;
  headers?: {};
  addAuth?: boolean;
}

interface Headers {
  [key: string]: string;
}

const buildHeaders = async (headers: {}, addAuth: boolean) => {
  let defaultHeaders: Headers = { 'content-type': 'application/json' };

  if (addAuth) {
    const { getToken } = auth();
    const token = await getToken();
    defaultHeaders['authentication'] = `${token}`;
  }

  return { ...defaultHeaders, ...headers };
};

export const post = async ({
  url,
  body = '',
  headers = {},
  addAuth = true,
}: PostInput) => {
  return fetch(url, {
    method: 'POST',
    headers: await buildHeaders(headers, addAuth),
    body,
  });
};

export const get = async ({ url, headers = {}, addAuth = true }: GetInput) => {
  return fetch(url, {
    method: 'GET',
    headers: await buildHeaders(headers, addAuth),
  });
};
