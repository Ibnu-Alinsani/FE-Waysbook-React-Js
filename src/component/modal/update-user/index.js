import * as react from 'react'
import { Modal, Container, Form, Button } from "react-bootstrap"
import { UserContext } from '../../../context';
import { useMutation } from 'react-query';
import { API } from '../../../config/api';
import Swal from "sweetalert2";

function UpdateUser(props) {
    const [state, _] = react.useContext(UserContext);
    const [preview, setPreview] = react.useState("");

    const [form, setForm] = react.useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        avatar: "",
    });

    react.useEffect(() => {
            setForm(state.user)
    }, [])

    function handleChange(e) {
        setForm({
          ...form,
          [e.target.name]:
            e.target.type === "file" ? e.target.files : e.target.value,
        });
    
        if (e.target.type === "file") {
          let url = URL.createObjectURL(e.target.files[0]);
          setPreview(url);
          console.log(url);
        }
      }

    const handleSubmit = useMutation(async (e) => {
        try {
            const config = {
                headers: {
                    "Content-type": "multipart/form-data",
                },
            }

            const formData = new FormData()
            formData.set("name", form.name)
            formData.set("email", form.email)
            formData.set("phone", form.phone)
            formData.set("address", form.address)
            formData.set("avatar", form.avatar[0], form.avatar[0]?.name)

            const response = await API.patch(`/user/${state.user.id}`, formData, config)
            
            Swal.fire({
                title: "Update Success",
                text: `Enjoy Your Book`,
                icon: "success",
                showConfirmButton: false,
                timer: 1500,
              });
            
        } catch (error) {
            console.log("update failed",error)
        }
    })
    return (
        <>
          <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
          >
            <Container className="py-5 px-5">
              {preview ? (
                <img
                  src={preview}
                  alt="..."
                  className="h-25 rounded"
                  style={{
                    height: "202px",
                    width: "226px",
                    marginBottom: "1rem",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <></>
              )}
              <Form onSubmit={(e) => handleSubmit.mutate(e)}>
                {/* name */}
                <Form.Group className="mb-3" >
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    id='name'
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                  />
                </Form.Group>
    
                {/* email */}
                <Form.Group className="mb-3" >
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" id='email' name="email" value={form.email} onChange={handleChange} />
                </Form.Group>
    
                {/* phone */}
                <Form.Group className="mb-3" >
                  <Form.Label>No. Handphone</Form.Label>
                  <Form.Control
                    type="number"
                    id='phone'
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                  />
                </Form.Group>
    
                {/* address */}
                <Form.Group className="mb-3" >
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    id='address'
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                  />
                </Form.Group>
    
                {/* image */}
                <Form.Group className="mb-3">
                  <Form.Label>Upload image</Form.Label>
                  <Form.Control type="file" name="avatar" id='avatar' onChange={handleChange} />
                </Form.Group>
                <Button
                  variant="dark"
                  className="text-light w-25 ms-0 mt-3"
                  type="submit"
                >
                  Submit
                </Button>
              </Form>
            </Container>
          </Modal>
        </>
      );
}

export default UpdateUser