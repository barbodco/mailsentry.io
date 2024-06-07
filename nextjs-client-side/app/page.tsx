"use client";
import EmailValidation from "@/components/EmailValidation";
import ErrorMsg from "@/components/ErrorMsg";
import { Response } from "@/interface";
import { FormEvent, useState } from "react";
export default function Home() {
  const [email, setEmail] = useState("hello@mailsentry.io");
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<Response | null>();
  const [errorMsg, setErrorMsg] = useState<string | null>();
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setResult(null);
    setErrorMsg(null);
    setPending(true);
    try {
      const result = await mailSentryApi();
      setResult(result);
    } catch (error) {
    } finally {
      setPending(false);
    }
  };
  const mailSentryApi = async (): Promise<Response | undefined> => {
    try {
      const API = process.env.NEXT_PUBLIC_API;
      const XAPIKEY = process.env.NEXT_PUBLIC_XAPIKEY;
      const AUTH = process.env.NEXT_PUBLIC_AUTH;
      const url = `${API}/email/verify/instant?email=${email}`;
      const myHeaders = new Headers();
      myHeaders.append("authorization", `Bearer ${AUTH}`);
      myHeaders.append("x-api-key", XAPIKEY as string);
      const requestOptions: RequestInit = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      };
      const response = await fetch(url, requestOptions);
      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage =
          errorData.message && errorData.message.message
            ? errorData.message.message
            : `HTTP error! Status: ${response.status}`;
        throw new Error(errorMessage);
      }
      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        setErrorMsg(error.message);
      } else {
        setErrorMsg("Something went wrong!");
      }
    }
  };
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };
  return (
    <main className="bg-blue-900 min-h-screen text-white flex justify-center items-center p-4">
      <div className="w-full max-w-lg bg-gray-800 p-6 rounded-lg shadow-xl space-y-5">
        <div className="flex items-center justify-between">
          <a
            className="text-4xl font-bold text-center text-white hover:text-blue-300 transition-colors"
            href="https://mailsentry.io/"
          >
            Mailsentry.io
          </a>
          <a
            className="text-base underline font-bold text-center text-white hover:text-blue-300 transition-colors"
            href="https://mailsentryio.readme.io/reference/verify-email-validity-instantly"
          >
            Get your API key
          </a>
        </div>
        <form
          className="mt-8 flex flex-col gap-4 items-center"
          onSubmit={handleSubmit}
        >
          <input
            className="w-full p-3 bg-gray-700 text-white placeholder-gray-500 rounded-lg focus:ring-2 focus:ring-blue-300 focus:outline-none transition"
            type="email"
            name="email"
            id="email"
            value={email}
            onChange={handleInputChange}
            placeholder="Enter your email address"
          />
          {!pending ? (
            <button
              className="bg-blue-500 hover:bg-blue-600 w-full text-white py-2 rounded-lg transition-colors disabled:opacity-50"
              type="submit"
            >
              Submit
            </button>
          ) : (
            <span className="border-gray-300 h-10 w-10 animate-spin rounded-full border-8 border-t-blue-600"></span>
          )}
        </form>
        {errorMsg ? <ErrorMsg errorMsg={errorMsg} /> : null}
        {result ? <EmailValidation list={result} /> : null}
      </div>
    </main>
  );
}
