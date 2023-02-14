"use client";

import { LockClosedIcon } from "@heroicons/react/20/solid";
import logoWhite from "@public/logo_white.png";
import Image from "next/image";
import { useEffect, useReducer, useContext } from "react";
import { Context, SupabaseContext } from "@/components/supa-provider";
import { useRouter } from "next/navigation";

const initialState = {
  email: "",
  emailTouched: false,
  password: "",
  passwordTouched: false,
  emailError: "",
  PWError: "",
  isRegistering: false,
  apiError: "",
};

type ACTIONTYPE =
  | { type: "SET_EMAIL"; payload: string }
  | { type: "SET_EMAIL_TOUCHED" }
  | { type: "SET_PW"; payload: string }
  | { type: "SET_PW_TOUCHED" }
  | { type: "SET_EMAIL_ERROR"; payload: string }
  | { type: "SET_PW_ERROR"; payload: string }
  | { type: "TOGGLE_REGISTERTING" }
  | { type: "SET_BOTH_TOUCHED" }
  | { type: "SET_FORM_VALIDITY"; payload: boolean }
  | { type: "SET_API_ERROR"; payload: string };

function reducer(state: typeof initialState, action: ACTIONTYPE) {
  switch (action.type) {
    case "SET_EMAIL":
      return { ...state, email: action.payload };
    case "SET_EMAIL_TOUCHED":
      return { ...state, emailTouched: true };
    case "SET_EMAIL_ERROR":
      return { ...state, emailError: action.payload };

    case "SET_PW":
      return { ...state, password: action.payload };
    case "SET_PW_TOUCHED":
      return { ...state, passwordTouched: true };
    case "SET_PW_ERROR":
      return { ...state, PWError: action.payload };

    case "TOGGLE_REGISTERTING":
      return { ...state, isRegistering: !state.isRegistering };
    case "SET_BOTH_TOUCHED":
      return { ...state, emailTouched: true, passwordTouched: true };
    case "SET_API_ERROR":
      return { ...state, apiError: action.payload };
    default:
      return state;
  }
}

export default function Auth() {
  const { supabase } = useContext(Context) as SupabaseContext;

  const router = useRouter();
  const [state, dispatch] = useReducer(reducer, initialState);
  const formValidity = !state.emailError && !state.PWError;

  useEffect(() => {
    const email = state.email.trim();
    const password = state.password.trim();

    const emailValidity = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
      email
    );
    const emailInvalidity = !emailValidity && state.emailTouched;
    const passwordValidity = !/^(.{0,7}|[^0-9]*|[^A-Z]*|[^a-z]*)$/.test(
      password
    );
    const passwordInvalidity = !passwordValidity && state.passwordTouched;

    if (emailInvalidity) {
      dispatch({ type: "SET_EMAIL_ERROR", payload: "Email is not valid" });
    } else if (emailValidity) {
      dispatch({
        type: "SET_EMAIL_ERROR",
        payload: "",
      });
    }
    if (passwordInvalidity) {
      dispatch({
        type: "SET_PW_ERROR",
        payload:
          "Password must contain at least 8 characters, 1 number, 1 uppercase and 1 lowercase letter",
      });
    } else if (passwordValidity) {
      dispatch({ type: "SET_PW_ERROR", payload: "" });
    }
  }, [state.email, state.password, state.emailTouched, state.passwordTouched]);

  const formSubmitHandler = async (event: React.SyntheticEvent) => {
    event.preventDefault();

    if (!formValidity) return;

    const supa_function = state.isRegistering
      ? supabase.auth.signUp
      : supabase.auth.signInWithPassword;

    const { data, error } = await supa_function.bind(supabase.auth)({
      email: state.email,
      password: state.password,
      options: {
        emailRedirectTo: "/",
      },
    });

    if (error) {
      console.log(error.message);
      dispatch({ type: "SET_API_ERROR", payload: error.message });
    } else {
      console.log(data);
      router.replace("/");
    }
  };

  return (
    <>
      <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div>
            <Image
              src={logoWhite}
              alt="Pimp logo"
              width={300}
              height={300}
              className="mx-auto w-auto"
            />
            <h2 className="text-gray-900 mt-6 text-center text-3xl font-bold tracking-tight">
              {state.isRegistering
                ? "Create an account"
                : "Sign in to your account"}
            </h2>
            <p className="text-gray-600 mt-2 text-center text-sm">
              Or{" "}
              <button
                onClick={() => dispatch({ type: "TOGGLE_REGISTERTING" })}
                className="font-medium text-purple-600 hover:text-purple-500"
              >
                {state.isRegistering
                  ? "log in to your account"
                  : "sign up for free with an email"}
              </button>
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={formSubmitHandler}>
            <input type="hidden" name="remember" defaultValue="true" />
            <div className="-space-y-px rounded-md shadow-sm">
              <div>
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                {state.emailError && (
                  <p
                    className="border-red-500 text-grey-900 placeholder-gray-500 focus:border-red-500 focus:ring-red-500 relative block w-full appearance-none rounded-none
                              rounded-t-md border px-3 py-2 focus:z-10 focus:outline-none sm:text-sm"
                  >
                    {state.emailError}
                  </p>
                )}
                <input
                  id="email-address"
                  onChange={(e) =>
                    dispatch({ type: "SET_EMAIL", payload: e.target.value })
                  }
                  onBlur={() => dispatch({ type: "SET_EMAIL_TOUCHED" })}
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="border-gray-300 text-gray-900 placeholder-gray-500 relative block w-full appearance-none rounded-none rounded-t-md border px-3 py-2 focus:z-10 focus:border-purple-500 focus:outline-none focus:ring-purple-500 sm:text-sm"
                  placeholder="Email address"
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                {state.PWError && (
                  <p
                    className="border-red-500 text-gray-900 placeholder-gray-500 focus:border-red-500 focus:ring-red-500 relative block w-full appearance-none rounded-none
				   rounded-t-md border px-3 py-2
				    focus:z-10 focus:outline-none sm:text-sm"
                  >
                    {state.PWError}
                  </p>
                )}
                <input
                  onChange={(e) =>
                    dispatch({ type: "SET_PW", payload: e.target.value })
                  }
                  onBlur={() => dispatch({ type: "SET_PW_TOUCHED" })}
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="border-gray-300 text-gray-900 placeholder-gray-500 relative block w-full appearance-none rounded-none rounded-b-md border px-3 py-2 focus:z-10 focus:border-purple-500 focus:outline-none focus:ring-purple-500 sm:text-sm"
                  placeholder="Password"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="border-gray-300 h-4 w-4 rounded text-purple-600 focus:ring-purple-500"
                />
                <label
                  htmlFor="remember-me"
                  className="text-grey-500 ml-2 block text-sm"
                >
                  Remember me
                </label>
              </div>

              {!state.isRegistering && (
                <div className="text-sm">
                  <a
                    href="#"
                    className="font-medium text-purple-600 hover:text-purple-500"
                  >
                    Forgot your password?
                  </a>
                </div>
              )}
            </div>

            {state.apiError && (
              <p className="text-rose-500 text-center font-medium">
                {state.apiError}
              </p>
            )}

            <div>
              <button
                onClick={() => dispatch({ type: "SET_BOTH_TOUCHED" })}
                type="submit"
                className="bg-purple-600 border-transparent text-white group relative flex w-full justify-center rounded-md border py-2 px-4 text-sm font-medium hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
              >
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <LockClosedIcon
                    className="h-5 w-5 text-purple-300 group-hover:text-purple-400"
                    aria-hidden="true"
                  />
                </span>
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
