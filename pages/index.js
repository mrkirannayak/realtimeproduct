import * as React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import CircularProgress from "@mui/material/CircularProgress";

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";

import DialogContent from "@mui/material/DialogContent";

import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";

import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

import Grid from "@mui/material/Grid";
import Tooltip from "@mui/material/Tooltip";
import Zoom from "@mui/material/Zoom";

import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import LogoutIcon from "@mui/icons-material/Logout";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";

import { Field, Form, Formik } from "formik";
import * as Yup from "yup";

import Head from "next/head";

import { app, database } from "../firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { async } from "@firebase/util";
import { MenuItem } from "@mui/material";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

export default function Home() {
  const [open, setOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [isUpdate, setIsUpdate] = useState(false);
  const [ID, setID] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const databaseRef = collection(database, "All Products");

  const router = useRouter();
  useEffect(() => {
    let token = sessionStorage.getItem("Token");
    if (token) {
      fetchData();
      setLoading(false);
    }
    if (!token) {
      router.push("/register");
    }
  }, []);

  const selectType = [
    { key: "Select Type", value: "" },
    { key: "Food", value: "food" },
    { key: "Drinks", value: "drinks" },
  ];

  const initialValues = {
    product: "",
    type: "",
    quantity: "",
    unitPrice: "",
  };

  const validationSchema = Yup.object({
    product: Yup.string().required("Please enter products name"),
    type: Yup.string().required("Please enter Type"),
    quantity: Yup.string().required("Please enter Quantity in Number"),
    unitPrice: Yup.string().required("Please enter UnitPrice in Number"),
  });

  const onSubmit = async (values, props) => {
    const { product, type, quantity, unitPrice } = values;
    addDoc(databaseRef, {
      product,
      type,
      quantity,
      unitPrice,
    })
      .then(() => {
        alert("Product has been sent to the FireBase");
        setOpen(false);
        setLoading(true);
        fetchData();
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
      });

    props.resetForm();
  };

  const fetchData = async () => {
    await getDocs(databaseRef).then((response) => {
      setProducts(
        response.docs.map((data) => {
          console.log(data.data());
          return { ...data.data(), id: data.id };
        })
      );
    });
  };

  const getID = (id, product, type, quantity, unitPrice) => {
    setOpen(true);
    id, product, type, quantity, unitPrice, setIsUpdate(true);
    console.log(getID);
  };

  const updateProduct = () => {
    let editProduct = doc(database, "All Products", ID);
    updateDoc(editProduct, {
      product,
      type,
      quantity,
      unitPrice,
    })
      .then(() => {
        alert("Data Updated");
        setOpen(false);
        fetchData();
        setIsUpdate(false);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const deleteProduct = (id) => {
    let editProduct = doc(database, "All Products", id);
    deleteDoc(editProduct)
      .then(() => {
        setLoading(true);
        alert("Are you sure you want to Delete Product?");
        fetchData();
        setLoading(false);
      })
      .catch((error) => {
        alert("Can not the Delete");
      });
  };

  const signout = () => {
    setLoading(true);
    sessionStorage.removeItem("Token");
    setLoading(false);
    router.push("/login");
  };

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.common.white,
      fontSize: 15,
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
      fontSize: 14,
    },
    // hide last border
    "&:last-child td, &:last-child th": {
      border: 0,
    },
  }));

  return (
    <>
      <Head>
        <title>Home | Real Time Products</title>
        <meta name="description" content="Real Time Products" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {loading && (
        <div className="CircularProgress">
          <CircularProgress color="primary" />
        </div>
      )}

      <div className="addProduct">
        <Container maxWidth="lg" className="formBox">
          <div className="productsData">
            <Grid container>
              <Grid xs={8}>
                <Typography variant="h1">Available Products</Typography>
              </Grid>

              <Grid xs className="rightsidebutton">
                <Button
                  variant="text"
                  size="small"
                  startIcon={<AddShoppingCartIcon />}
                  onClick={handleClickOpen}
                >
                  Add New Product
                </Button>
                <Button
                  variant="text"
                  size="small"
                  startIcon={<LogoutIcon />}
                  onClick={signout}
                >
                  Sign Out
                </Button>
              </Grid>
            </Grid>

            <TableContainer>
              <Table
                sx={{ minWidth: 700 }}
                size="medium"
                aria-label="customized table"
              >
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Product</StyledTableCell>
                    <StyledTableCell align="center">Type</StyledTableCell>
                    <StyledTableCell align="center">Quantity</StyledTableCell>
                    <StyledTableCell align="center">UnitPrice</StyledTableCell>
                    <StyledTableCell align="center">Action</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {products.map((data) => (
                    <StyledTableRow key={data.id}>
                      <StyledTableCell component="th" scope="row">
                        {data.product}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {data.type}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {data.quantity}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {data.unitPrice}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        <Tooltip
                          TransitionComponent={Zoom}
                          title="Delete Product"
                        >
                          <IconButton
                            aria-label="delete"
                            size="small"
                            onClick={() => deleteProduct(data.id)}
                          >
                            <DeleteIcon fontSize="inherit" />
                          </IconButton>
                        </Tooltip>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </Container>
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
        keepMounted
        aria-describedby="alert-dialog-slide-description"
        className="dialogBox"
      >
        <DialogTitle>Add New Product</DialogTitle>
        <DialogContent>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {({ errors, isValid, touched, dirty }) => (
              <Form>
                <div className="fieldGroup">
                  <Field
                    name="product"
                    type="product"
                    as={TextField}
                    variant="outlined"
                    color="primary"
                    label="Product"
                    fullWidth
                    size="small"
                    error={Boolean(errors.product) && Boolean(touched.product)}
                    helperText={Boolean(touched.product) && errors.product}
                  />
                </div>

                <div className="fieldGroup">
                  <Field
                    name="type"
                    type="text"
                    as={TextField}
                    variant="outlined"
                    color="primary"
                    label="Type"
                    select
                    fullWidth
                    size="small"
                    multiple={true}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    error={Boolean(errors.type) && Boolean(touched.type)}
                    helperText={Boolean(touched.type) && errors.type}
                  >
                    {selectType.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.key}
                      </MenuItem>
                    ))}
                  </Field>
                </div>
                <div className="fieldGroup">
                  <Field
                    name="quantity"
                    type="number"
                    as={TextField}
                    variant="outlined"
                    color="primary"
                    label="Quantity"
                    fullWidth
                    size="small"
                    error={
                      Boolean(errors.quantity) && Boolean(touched.quantity)
                    }
                    helperText={Boolean(touched.quantity) && errors.quantity}
                  />
                </div>
                <div className="fieldGroup">
                  <Field
                    name="unitPrice"
                    type="number"
                    as={TextField}
                    variant="outlined"
                    color="primary"
                    label="UnitPrice"
                    fullWidth
                    size="small"
                    error={
                      Boolean(errors.unitPrice) && Boolean(touched.unitPrice)
                    }
                    helperText={Boolean(touched.unitPrice) && errors.unitPrice}
                  />
                </div>
                <div className="fieldGroup">
                  {isUpdate ? (
                    <Button
                      type="button"
                      onClick={updateProduct}
                      variant="contained"
                      color="primary"
                      size="large"
                      fullWidth
                      startIcon={<LogoutIcon />}
                      disabled={!dirty || !isValid}
                    >
                      Update Product
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      size="large"
                      fullWidth
                      startIcon={<LogoutIcon />}
                      disabled={!dirty || !isValid}
                    >
                      Save
                    </Button>
                  )}
                </div>
              </Form>
            )}
          </Formik>
        </DialogContent>
      </Dialog>
    </>
  );
}
