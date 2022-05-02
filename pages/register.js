import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import LogoutIcon from "@mui/icons-material/Logout";
import GoogleIcon from "@mui/icons-material/Google";

import { Field, Form, Formik } from "formik";
import * as Yup from "yup";

import Head from "next/head";
import { useEffect } from "react";
import { app } from "../firebaseConfig";
import {
  getAuth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { useRouter } from "next/router";
import Link from "next/link";

const Register = () => {
  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .required("Please enter a valid email address")
      .email("invalid email format"),
    password: Yup.string()
      .required("Please enter password")
      .min(6, "Password should be minimum 6 characters"),
  });

  const onSubmit = async (values, props) => {
    const { email, password } = values;
    createUserWithEmailAndPassword(auth, email, password)
      .then((response) => {
        sessionStorage.setItem("Token", response.user.accessToken);
        router.push("/");
      })
      .catch((error) => {
        console.log(error);
      });
    props.resetForm();
  };

  const auth = getAuth();
  const googleProvider = new GoogleAuthProvider();
  const router = useRouter();

  const signUpWithGoogle = () => {
    signInWithPopup(auth, googleProvider)
      .then((response) => {
        sessionStorage.setItem("Token", response.user.accessToken);
        router.push("/");
      })
      .catch((error) => {
        alert("Email Already Exit...");
      });
  };

  useEffect(() => {
    let token = sessionStorage.getItem("Token");
    if (token) {
      router.push("/");
    }
  }, []);

  return (
    <>
      <Head>
        <title>Register your account | Real Time Products</title>
        <meta name="description" content="Real Time Products" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="formWrap">
        <Container maxWidth="lg" className="formBox">
          <Typography variant="h6" gutterBottom>
            Create your account
          </Typography>
          <Box className="FormBox">
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={onSubmit}
            >
              {({ errors, isValid, touched, dirty }) => (
                <Form>
                  <div className="fieldGroup">
                    <Field
                      name="email"
                      type="email"
                      as={TextField}
                      variant="outlined"
                      color="primary"
                      label="Email"
                      fullWidth
                      size="small"
                      error={Boolean(errors.email) && Boolean(touched.email)}
                      helperText={Boolean(touched.email) && errors.email}
                    />
                  </div>
                  <div className="fieldGroup">
                    <Field
                      name="password"
                      type="password"
                      as={TextField}
                      variant="outlined"
                      color="primary"
                      label="Password"
                      fullWidth
                      size="small"
                      error={
                        Boolean(errors.password) && Boolean(touched.password)
                      }
                      helperText={Boolean(touched.password) && errors.password}
                    />
                  </div>
                  <div className="fieldGroup">
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      size="large"
                      fullWidth
                      startIcon={<LogoutIcon />}
                      disabled={!dirty || !isValid}
                    >
                      Sign Up
                    </Button>
                  </div>
                  <div className="fieldGroup">
                    <div className="signinLink">
                      Already have an account?
                      <Link href={`/login`}>
                        <a>Sign In</a>
                      </Link>
                    </div>
                  </div>
                  <div className="fieldGroup">
                    <Button
                      className="googlebutton"
                      type="button"
                      variant="text"
                      color="primary"
                      size="large"
                      fullWidth
                      startIcon={<GoogleIcon />}
                      onClick={signUpWithGoogle}
                    >
                      Continue with google
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          </Box>
        </Container>
      </div>
    </>
  );
};

export default Register;
