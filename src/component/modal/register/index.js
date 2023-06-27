import { Form, Modal, Button } from "react-bootstrap";
import * as react from "react";
import {useMutation} from "react-query"
import { API } from "../../../config/api"
import Swal from "sweetalert2";

function Register(props) {
  const [form, setForm] = react.useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    gender: "",
    address: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const submit = useMutation(async (e) => {
    e.preventDefault()
    try {
        const response = await API.post("/register", form)
        props.setmodalregister(false)
        
        props.setmodal(true)
        const Toast = Swal.mixin({
          toast: true,
          position: 'top',
          iconColor: 'white',
          customClass: {
            popup: 'colored-toast'
          },
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true
        })
      
        await Toast.fire({
        icon: 'success',
        title: `Register Success`
        })
    } catch (err) {
        Swal.fire({
          title: "Registrasi Error",
          text: `Your email already exists`,
          icon: "error",
          showConfirmButton: false,
          timer: 2000,
        });
        console.log("register failed", err)
    }
  })

  return (
    <Modal
      {...props}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Form className="p-5" style={{ maxHeight: "30rem", overflowY: "scroll" }} onSubmit={(e) => submit.mutate(e)}>
        <h4
          style={{ fontFamily: "Times New Roman", fontSize: "36px" }}
          className="mb-4 fw-bold"
        >
          Register
        </h4>
        <Form.Group className="mb-4">
          <Form.Control
            type="text"
            placeholder="Name"
            className="p-2 bg-body-secondary"
            name="name"
            onChange={handleChange}
            id="name"
            required
          />
        </Form.Group>
        <Form.Group className="mb-4">
          <Form.Control
            type="email"
            placeholder="Email"
            className="p-2 bg-body-secondary"
            name="email"
            onChange={handleChange}
            id="email"
            required
          />
        </Form.Group>
        <Form.Group className="mb-4">
          <Form.Control
            type="password"
            placeholder="Password"
            className="p-2 bg-body-secondary"
            name="password"
            onChange={handleChange}
            id="password"
            required
          />
        </Form.Group>
        <Form.Group className="mb-4">
          <Form.Control
            type="tel"
            placeholder="Nomer Handphone"
            className="p-2 bg-body-secondary"
            name="phone"
            onChange={handleChange}
            id="phone"
            required
          />
        </Form.Group>
        <Form.Group className="mb-4 d-flex gap-2">
          <Form.Check
            name="gender"
            type="radio"
            id="male"
            onChange={handleChange}
            value="male"
          />
          <Form.Label className="me-4" for="male">Male</Form.Label>
          <Form.Check
            name="gender"
            type="radio"
            id="female"
            onChange={handleChange}
            value="female"
          />
          <Form.Label for="female">Female</Form.Label>
        </Form.Group>
        <Form.Group className="mb-4">
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Address"
            className="p-2 bg-body-secondary"
            name="address"
            onChange={handleChange}
            id="address"
            required
          />
        </Form.Group>
        <Button className="w-100 p-2 mt-3 rounded-0 fw-bold bg-dark border-dark" type="submit">
          Register
        </Button>
      </Form>
      <p className="text-center pt-3">
        Already have an account?
        <button
          style={{ background: "none", border: "none" }}
          className="fw-semibold"
          onClick={() => {
            props.setmodal(true);
            props.setmodalregister(false);
          }}
        >
          Klik here
        </button>
      </p>
    </Modal>
  );
}

export default Register;
